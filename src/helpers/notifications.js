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

export const createInAppNotification = async ({
  receiverId,
  message,
  link
}) => {
  return BaseRepository.create(db.Notification, {
    receiverId,
    message,
    link
  });
};

/**
 * @static
 * @param {id} followerId - primary key of a follower alias (notification sender)
 * @param {id} followeeId - primary key of a followee alias (notification receiver)
 * @returns {object}- returns information about the follow status of the requested user
 */
const onFollowNotification = async ({ followerId, followeeId }) => {
  const sender = await BaseRepository.findOneByField(db.User, {
    id: followerId
  });

  const receiver = await BaseRepository.findOneByField(db.User, {
    id: followeeId
  });

  const { id: receiverId, emailNotify } = receiver;

  const message = `<b>${sender.username}</b> just followed you.`;
  const link = `/profile/${sender.username}`;

  if (emailNotify) {
    // TODO: send email notification at this point
  }

  await createInAppNotification({
    receiverId,
    message,
    link
  });
  await pushNotification([receiverId], message);
};

const onCommentNotification = async ({ commenterId, articleId }) => {
  // TODO: implement notification on comment of an article
};

const onPublishArticleNotification = async ({ userId, articleId }) => {
  // TODO: implement notification on publish of an article
};

export default {
  onFollowNotification,
  onCommentNotification,
  onPublishArticleNotification
};
