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

      return responseGenerator.sendSuccess(res, 200, notification);
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
      const markRead = await BaseRepository.update(
        Notification,
        { read },
        { id: notificationId, receiverId }
      );

      if (markRead[0] > 0) {
        return responseGenerator.sendSuccess(
          res,
          200,
          null,
          'Notification has been read'
        );
      }
      return responseGenerator.sendError(
        res,
        404,
        'Failed to update notification read status'
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
        return responseGenerator.sendSuccess(
          res,
          200,
          null,
          'Email notifications has been enabled'
        );
      }

      return responseGenerator.sendSuccess(
        res,
        200,
        null,
        'Email notifications has been disabled'
      );
    } catch (error) {
      return responseGenerator.sendError(res, 500, error.message);
    }
  }
}

export default NotificationController;
