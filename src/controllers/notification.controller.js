import BaseRepository from '../repository/base.repository';
import responseGenerator from '../helpers/responseGenerator';
import db from '../database/models';

const { User, Notification } = db;

/**
 * @class NotificationController
 */
class NotificationController {
  /**
   * Get all notifications
   * @async
   * @param {Object} req - Object of the HTTP request
   * @param {Object} res - Object of the HTTP response
   * @returns {json} Returns json Object
   * @static
   */
  static async getNotifications(req, res) {
    const { id: recieverId } = req.currentUser;
    try {
      const notification = await BaseRepository.findAll(Notification, {
        recieverId
      });

      if (notification.length > 0) {
        return responseGenerator.sendSuccess(res, 200, notification);
      }

      return responseGenerator.sendError(res, 404, 'You have no notifications');
    } catch (error) {
      return responseGenerator.sendError(res, 500, error.message);
    }
  }

  /**
   * Mark if the notification was read
   * @async
   * @param {Object} req - Object of the HTTP request
   * @param {Object} res - Object of the HTTP response
   * @returns {json} Returns json Object
   * @static
   */
  static async readNotification(req, res) {
    const read = true;
    const { notificationId } = req.params;
    const { id: receiverId } = req.currentUser;
    try {
      const notification = await BaseRepository.findOneByField(Notification, {
        id: notificationId,
        receiverId
      });

      if (notification) {
        const notificationRead = notification.read;
        if (notificationRead === true) {
          return responseGenerator.sendError(
            res,
            200,
            'Notification has been read'
          );
        }
        const markRead = await BaseRepository.update(
          Notification,
          { read },
          { id: notificationId, receiverId }
        );

        if (markRead) {
          return responseGenerator.sendError(
            res,
            200,
            'Notification has been marked as read'
          );
        }
      }
      return responseGenerator.sendError(
        res,
        404,
        'Notification does not exist'
      );
    } catch (error) {
      return responseGenerator.sendError(res, 500, error.message);
    }
  }

  /**
   * Mark if the notification was read
   * @async
   * @param {Object} req - Object of the HTTP request
   * @param {Object} res - Object of the HTTP response
   * @returns {json} Returns json Object
   * @static
   */
  static async toggleNotification(req, res) {
    const { emailNotify } = req.body;
    const { id } = req.currentUser;
    try {
      const emailNotification = await BaseRepository.update(
        User,
        { emailNotify },
        { id }
      );

      if (emailNotification && emailNotify) {
        return responseGenerator.sendError(
          res,
          200,
          'Email notifications has been enabled'
        );
      }

      return responseGenerator.sendError(
        res,
        200,
        'Email notifications has been disabled'
      );
    } catch (error) {
      return responseGenerator.sendError(res, 500, error.message);
    }
  }
}

export default NotificationController;
