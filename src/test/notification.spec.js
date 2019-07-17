import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { config } from 'dotenv';
import sinon from 'sinon';
import BaseRepository from '../repository/base.repository';
import {
  createUser,
  generateArticle,
  createArticle,
  newNotification,
  addNotification,
  followUser
} from './utils/helpers';
import app from '../index';
import db from '../database/models';
import helper from '../helpers/utils';
import NotificationHelper from '../helpers/notifications';

const {
  onFollowNotification,
  onCommentNotification,
  onPublishArticleNotification,
  createInAppNotification
} = NotificationHelper;

config();
chai.use(chaiHttp);

const { User, Follower, Notification } = db;

describe('Notification helper functions', () => {
  describe('CreateInAppNotification', async () => {
    beforeEach(async () => {
      await User.destroy({ truncate: true, cascade: true });
      await Follower.destroy({ truncate: true, cascade: true });
      await Notification.destroy({ truncate: true, cascade: true });
    });

    it('Returns an object of the created notification', async () => {
      newNotification.payload = {
        type: 'new_follower',
        follower: 'shola'
      };
      const notification = await createInAppNotification(newNotification);
      expect(notification.receiverId).to.equal(newNotification.receiverId);
      expect(notification.payload.type).to.equal(newNotification.payload.type);
      expect(notification.payload.follower).to.equal(
        newNotification.payload.follower
      );
    });

    it('should send in app notification when a user is followed', async () => {
      const follower = await createUser();
      const followee = await createUser();

      const payload = {
        follower: follower.username,
        type: 'new_follower'
      };

      await onFollowNotification(follower, followee.id);
      const notification = await BaseRepository.findAll(db.Notification, {
        receiverId: followee.id
      });

      expect(notification.length).to.equal(1);
      expect(notification[0].payload.follower).to.equal(payload.follower);
      expect(notification[0].payload.type).to.equal(payload.type);
    });

    it('should send in-app notification to the author of article when there is a new comment', async () => {
      const author = await createUser();
      const commenter = await createUser();

      const generatedArticle = await generateArticle(author.id);
      const article = await createArticle(generatedArticle);

      const payload = {
        commenter: commenter.username,
        title: article.title,
        slug: article.slug,
        type: 'new_comment'
      };

      await onCommentNotification(commenter, article.id);

      const notification = await BaseRepository.findAll(db.Notification, {
        receiverId: author.id
      });

      expect(notification.length).to.equal(1);
      expect(notification[0].payload.commenter).to.equal(payload.commenter);
      expect(notification[0].payload.title).to.equal(payload.title);
      expect(notification[0].payload.slug).to.equal(payload.slug);
      expect(notification[0].payload.type).to.equal(payload.type);
    });

    it('should send in-app notification to all followers when a new article is published', async () => {
      const author = await createUser();
      const firstFollower = await createUser();
      const secondFollower = await createUser();

      await followUser(author.id, firstFollower.id);
      await followUser(author.id, secondFollower.id);

      const generatedArticle = await generateArticle({ authorId: author.id });
      const article = await createArticle(generatedArticle);

      const payload = {
        author: author.username,
        title: article.title,
        slug: article.slug,
        type: 'new_article'
      };

      await onPublishArticleNotification({
        userId: author.id,
        articleId: article.id
      });

      const notification = await BaseRepository.findAll(db.Notification, {});

      expect(notification.length).to.equal(2);

      expect(notification[0].receiverId).to.equal(firstFollower.id);
      expect(notification[0].payload.author).to.equal(payload.author);
      expect(notification[0].payload.title).to.equal(payload.title);
      expect(notification[0].payload.slug).to.equal(payload.slug);

      expect(notification[1].receiverId).to.equal(secondFollower.id);
      expect(notification[1].payload.author).to.equal(payload.author);
      expect(notification[1].payload.title).to.equal(payload.title);
      expect(notification[1].payload.slug).to.equal(payload.slug);
    });
  });
});

describe('GET /api/v1/notifications', () => {
  beforeEach(async () => {
    await User.destroy({ truncate: true, cascade: true });
    await Follower.destroy({ truncate: true, cascade: true });
    await Notification.destroy({ truncate: true, cascade: true });
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
    expect(response.body.data[0].payload).to.be.a('object');
    expect(response.body.data[0].recieverId).to.equal(notify.recieverId);
  });
  it('Returns 200 and empty array if notification was not found', async () => {
    const newUser = await createUser();
    const token = helper.jwtSigner(newUser);
    const response = await chai
      .request(app)
      .get('/api/v1/notifications')
      .set('x-access-token', token);
    expect(response.status).to.equal(200);
    expect(response.body.data.length).to.equal(0);
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
    expect(response.body.message).to.equal('notificationId must be a number');
  });
  it('Returns 404 and error message if no notification to be marked as ready was found', async () => {
    const newUser = await createUser();
    const token = helper.jwtSigner(newUser);

    const response = await chai
      .request(app)
      .patch(`/api/v1/notifications/${1}`)
      .set('x-access-token', token);
    expect(response.status).to.equal(404);
    expect(response.body.message).to.equal(
      'Failed to update notification read status'
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
    const findAllStub = sinon.stub(BaseRepository, 'update');
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
  it('Returns 200 if notification has been enabled', async () => {
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
