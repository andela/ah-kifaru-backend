import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { config } from 'dotenv';
import BaseRepository from '../repository/base.repository';
import {
  createUser,
  getUser,
  generateArticle,
  createArticle
} from './utils/helpers';
import app from '../index';
import db from '../database/models';
import helper from '../helpers/utils';
import NotificationHelper from '../helpers/notifications';

const USER_API = '/api/v1/users';

config();
chai.use(chaiHttp);

const server = () => chai.request(app);
const { onFollowNotification, onCommentNotification } = NotificationHelper;

describe('Test notification related endpoints', async () => {
  beforeEach(async () => {
    await db.Notification.destroy({ cascade: true, truncate: true });
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

    const newNotification = await BaseRepository.findAll(db.Notification, {
      receiverId: followee.id
    });

    expect(newNotification.length).to.equal(1);
    expect(newNotification[0].message).to.equal(message);
    expect(newNotification[0].link).to.equal(link);
  });

  it.only('should send in app notification to the author of article when there is a new comment', async () => {
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

    const newNotification = await BaseRepository.findAll(db.Notification, {
      receiverId: author.id
    });

    expect(newNotification.length).to.equal(1);
    expect(newNotification[0].message).to.equal(message);
    expect(newNotification[0].link).to.equal(link);
  });
});
