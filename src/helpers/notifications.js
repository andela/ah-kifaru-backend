import Pusher from 'pusher';
import dotenv from 'dotenv';
import BaseRepository from '../repository/base.repository';
import db from '../database/models';

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
const onFollowNotification = async (sender, followeeId) => {
  const receiverId = followeeId;
  const payload = {
    follower: sender.username,
    type: 'new_follower'
  };
  await createInAppNotification({
    receiverId,
    payload
  });
  await pushNotification([receiverId], payload);
};

// ON COMMENT NOTICATION
const onCommentNotification = async (sender, articleId) => {
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

  await createInAppNotification({
    receiverId: article[0]['author.id'],
    payload
  });

  await pushNotification([article[0]['author.id']], payload);
};

// ON PUBLISH NOTICATION
const onPublishArticleNotification = async ({ userId, articleId }) => {
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

  const followerIds = followers.map(follower => follower.followerId);
  const payload = {
    author: article[0]['author.username'],
    title: article[0].title,
    slug: article[0].slug,
    type: 'new_article'
  };

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
