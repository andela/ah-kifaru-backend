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

const pushNotification = async receiverIds => {
  receiverIds.forEach(id => {
    pusher.trigger('notifications', `event_${id}`, `Show notification badge`);
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

  const message = `${sender.username} just followed you.`;
  const link = `/profile/${sender.id}`; // /username will be prefered here for easy navigation

  if (emailNotify) {
    // TODO: send email notification at this point
  }

  await createInAppNotification({
    receiverId,
    message,
    link
  });

  await pushNotification([receiverId]);
};

const onCommentNotification = async () => {
  // TODO: send in app notification when there is a comment an an article
};

const onPublishArticleNotification = async () => {
  // TODO: send in app notification when there is a comment an an article
};

export default {
  onFollowNotification,
  onCommentNotification,
  onPublishArticleNotification
};
