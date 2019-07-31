import Pusher from 'pusher';
import dotenv from 'dotenv';
import BaseRepository from '../repository/base.repository';
import db from '../database/models';
import mailer from './mailer';

dotenv.config();

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  useTLS: true
});

const pushNotification = async (receiverIds, message) => {
  receiverIds.forEach(id => {
    if (process.env.NODE_ENV !== 'production') {
      pusher.trigger('my-channel', 'my-event', { message });
    } else {
      pusher.trigger('notifications', `event_${id}`, message);
    }
  });
};

const createInAppNotification = async ({ receiverId, payload }) => {
  return BaseRepository.create(db.Notification, {
    receiverId,
    payload
  });
};

// ON FOLLOW NOTICATION
const onFollowNotification = async (req, followeeId) => {
  const { protocol, currentUser: sender } = req;

  const receiver = await BaseRepository.findOneByField(db.User, {
    id: followeeId
  });

  const payload = {
    follower: sender.username,
    type: 'new_follower'
  };

  const { id: receiverId, username, email, emailNotify } = receiver;

  // SEND EMAIL TO THE FOLLOWED USER
  if (emailNotify) {
    mailer({
      name: username,
      receiver: email,
      subject: `<b>${sender.username}</b> just followed you.`,
      templateName: 'new_notification',
      buttonUrl: `${protocol}://${req.get('host')}/profile/${sender.username}`
    });
  }

  await createInAppNotification({
    receiverId,
    payload
  });
  await pushNotification([receiverId], payload);
};

// ON COMMENT NOTICATION
const onCommentNotification = async (req, articleId) => {
  const { protocol, currentUser: sender } = req;
  const article = await BaseRepository.findAndInclude({
    model: db.Article,
    options: { id: articleId },
    associatedModel: db.User,
    alias: 'author'
  });

  const payload = {
    commenter: sender.username,
    title: article[0].title,
    slug: article[0].slug,
    type: 'new_comment'
  };

  // SEND EMAIL TO THE AUTHOR
  if (article[0]['author.emailNotify']) {
    mailer({
      name: article[0]['author.username'],
      receiver: article[0]['author.email'],
      subject: `<b>${sender.username}</b> just commented on <b>${article[0].title}</b>`,
      templateName: 'new_notification',
      buttonUrl: `${protocol}://${req.get('host')}/article/${
        article[0].slug
      }/#commentId`
    });
  }

  await createInAppNotification({
    receiverId: article[0]['author.id'],
    payload
  });

  await pushNotification([article[0]['author.id']], payload);
};

// ON PUBLISH NOTICATION
const onPublishArticleNotification = async (req, { userId, articleId }) => {
  const followers = await BaseRepository.findAndInclude({
    model: db.Follower,
    options: { followeeId: userId },
    associatedModel: db.User,
    alias: 'follower'
  });

  const article = await BaseRepository.findAndInclude({
    model: db.Article,
    options: { id: articleId },
    associatedModel: db.User,
    alias: 'author'
  });

  const followerEmails = followers.filter(follower => follower.emailNotify);

  const followerIds = followers.map(follower => follower.followerId);
  const payload = {
    author: article[0]['author.username'],
    title: article[0].title,
    slug: article[0].slug,
    type: 'new_article'
  };

  // SEND EMAIL TO ALL FOLLOWERS
  const { protocol } = req || {};
  followerEmails.forEach(email => {
    mailer({
      name: article[0]['author.username'],
      receiver: email,
      subject: `<b>${article[0]['author.username']}</b> just published <b>${
        article[0].title
      }</b>`,
      templateName: 'new_notification',
      buttonUrl: `${protocol}://${req.get('host')}/article/${article[0].slug}`
    });
  });

  const data = followerIds.map(id => ({
    receiverId: id,
    payload
  }));

  await BaseRepository.bulkCreate(db.Notification, data);
  await pushNotification(followerIds, payload);
};

export default {
  onFollowNotification,
  onCommentNotification,
  onPublishArticleNotification,
  createInAppNotification
};
