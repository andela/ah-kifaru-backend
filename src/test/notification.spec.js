import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { config } from 'dotenv';
import sinon from 'sinon';
import BaseRepository from '../repository/base.repository';
import {
  createUser,
  generateArticle,
  createArticle,
  addNotification,
  newNotification
} from './utils/helpers';
import app from '../index';
import db from '../database/models';
import helper from '../helpers/utils';
import NotificationHelper from '../helpers/notifications';

const {
  onFollowNotification,
  onCommentNotification,
  createInAppNotification
} = NotificationHelper;
const { User, Follower, Notification } = db;

config();
chai.use(chaiHttp);

describe('Test notification related endpoints', () => {
  describe('Test notification helper functions', async () => {
    beforeEach(async () => {
      await User.destroy({ truncate: true, cascade: true });
      await Follower.destroy({ truncate: true, cascade: true });
      await Notification.destroy({ truncate: true, cascade: true });
    });
    it('see if it returns an object of the created notification', async () => {
      const notification = await createInAppNotification(newNotification);

      expect(notification.message).to.equal(newNotification.message);
      expect(notification.receiverId).to.equal(newNotification.receiverId);
      expect(notification.link).to.equal(newNotification.link);
    });

    it('should send in app notification when a user is followed', async () => {
      const follower = await createUser();
      const followee = await createUser();

      const message = `<b>${follower.username}</b> just followed you.`;
      const link = `/profile/${follower.username}`;

      await onFollowNotification({
        followerId: follower.id,
        followeeId: followee.id
      });

      const notification = await BaseRepository.findAll(db.Notification, {
        receiverId: followee.id
      });

      expect(notification.length).to.equal(1);
      expect(notification[0].message).to.equal(message);
      expect(notification[0].link).to.equal(link);
    });

    it('should send in app notification to the author of article when there is a new comment', async () => {
      const author = await createUser();
      const commenter = await createUser();

      const generatedArticle = await generateArticle(author.id);
      const article = await createArticle(generatedArticle);

      const message = `<b>${commenter.username}</b> just commented on <b>${article.title}</b>`;
      const link = `/article/${article.slug}/#commentId`;

      await onCommentNotification({
        commenterId: commenter.id,
        articleId: article.id
      });

      const notification = await BaseRepository.findAll(db.Notification, {
        receiverId: author.id
      });

      expect(notification.length).to.equal(1);
      expect(notification[0].message).to.equal(message);
      expect(notification[0].link).to.equal(link);
    });
  });

  describe('Test notification related endpoints', () => {
    describe('GET /api/v1/notifications', () => {
      beforeEach(async () => {
        await User.destroy({ truncate: true, cascade: true });
        await Follower.destroy({ truncate: true, cascade: true });
        await Notification.destroy({ truncate: true, cascade: true });
      });
      it('Returns 404 and error message if no notification was found', async () => {
        const newUser = await createUser();
        const token = helper.jwtSigner(newUser);

        const response = await chai
          .request(app)
          .get('/api/v1/notifications')
          .set('x-access-token', token);

        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('You have no notifications');
      });
      it('Returns 200 and notifications found', async () => {
        const newUser = await createUser();
        const token = helper.jwtSigner(newUser);
        const secondUser = await createUser();
        const notify = await addNotification(secondUser.id);
        const response = await chai
          .request(app)
          .get('/api/v1/notifications')
          .set('x-access-token', token);
        expect(response.status).to.equal(200);
        expect(response.body.data[0].id).to.equal(notify.id);
        expect(response.body.data[0].read).to.equal(notify.read);
        expect(response.body.data[0].link).to.equal(notify.link);
        expect(response.body.data[0].recieverId).to.equal(notify.recieverId);
      });
      it('should return error if database error occurs', async () => {
        const newUser = await createUser();
        const token = helper.jwtSigner(newUser);
        const findAllStub = sinon.stub(BaseRepository, 'findAll');
        findAllStub.rejects(new Error('Server Error'));
        const response = await chai
          .request(app)
          .get('/api/v1/notifications')
          .set('x-access-token', token);
        expect(response.status).to.equal(500);
        expect(response.body.message).to.equal('Server Error');
        findAllStub.restore();
      });
    });

    describe('PATCH /api/v1/notifications/:notificationId', () => {
      beforeEach(async () => {
        await User.destroy({ truncate: true, cascade: true });
        await Follower.destroy({ truncate: true, cascade: true });
        await Notification.destroy({ truncate: true, cascade: true });
      });
      it('Returns 400 and error message if no notification id was found', async () => {
        const newUser = await createUser();
        const token = helper.jwtSigner(newUser);

        const response = await chai
          .request(app)
          .patch(`/api/v1/notifications/${'form'}`)
          .set('x-access-token', token);
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          'notificationId must be a number'
        );
      });
      it('Returns 404 and error message if no notification was found', async () => {
        const newUser = await createUser();
        const token = helper.jwtSigner(newUser);

        const response = await chai
          .request(app)
          .patch(`/api/v1/notifications/${4}`)
          .set('x-access-token', token);

        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('Notification does not exist');
      });
      it('Returns 200 and notifications found', async () => {
        const newUser = await createUser();
        const token = helper.jwtSigner(newUser);
        const notify = await addNotification(newUser.id, false);
        const response = await chai
          .request(app)
          .patch(`/api/v1/notifications/${notify.id}`)
          .set('x-access-token', token);
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal(
          'Notification has been marked as read'
        );
      });
      it('Returns 200 and notification has been read', async () => {
        const newUser = await createUser();
        const token = helper.jwtSigner(newUser);
        const notify = await addNotification(newUser.id, true);
        const response = await chai
          .request(app)
          .patch(`/api/v1/notifications/${notify.id}`)
          .set('x-access-token', token);
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Notification has been read');
      });
      it('should return error if database error occurs', async () => {
        const newUser = await createUser();
        const token = helper.jwtSigner(newUser);
        const notify = await addNotification(newUser.id, true);
        const findAllStub = sinon.stub(BaseRepository, 'findOneByField');
        findAllStub.rejects(new Error('Server Error'));
        const response = await chai
          .request(app)
          .patch(`/api/v1/notifications/${notify.id}`)
          .set('x-access-token', token);
        expect(response.status).to.equal(500);
        expect(response.body.message).to.equal('Server Error');
        findAllStub.restore();
      });
    });

    describe('PATCH /api/v1/notifications/opt', () => {
      beforeEach(async () => {
        await User.destroy({ truncate: true, cascade: true });
        await Follower.destroy({ truncate: true, cascade: true });
        await Notification.destroy({ truncate: true, cascade: true });
      });
      it('Returns 400 and error message if the email notification was not sent in the body', async () => {
        const newUser = await createUser();
        const token = helper.jwtSigner(newUser);

        const response = await chai
          .request(app)
          .patch(`/api/v1/notifications/opt`)
          .set('x-access-token', token);
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          'emailNotify should be set to either true or false'
        );
      });
      it('Returns 200 if notificationhas been enabled', async () => {
        const newUser = await createUser();
        const token = helper.jwtSigner(newUser);
        const response = await chai
          .request(app)
          .patch(`/api/v1/notifications/opt`)
          .set('x-access-token', token)
          .send({ emailNotify: true });
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal(
          'Email notifications has been enabled'
        );
      });
      it('Returns 200 if notificationhas been disabled', async () => {
        const newUser = await createUser();
        const token = helper.jwtSigner(newUser);
        newUser.emailNotify = true;
        const response = await chai
          .request(app)
          .patch(`/api/v1/notifications/opt`)
          .set('x-access-token', token)
          .send({ emailNotify: false });
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal(
          'Email notifications has been disabled'
        );
      });
      it('should return error if database error occurs', async () => {
        const newUser = await createUser();
        const token = helper.jwtSigner(newUser);
        const findAllStub = sinon.stub(BaseRepository, 'update');
        findAllStub.rejects(new Error('Server Error'));
        const response = await chai
          .request(app)
          .patch('/api/v1/notifications/opt')
          .set('x-access-token', token)
          .send({ emailNotify: false });
        expect(response.status).to.equal(500);
        expect(response.body.message).to.equal('Server Error');
        findAllStub.restore();
      });
    });
  });
});
