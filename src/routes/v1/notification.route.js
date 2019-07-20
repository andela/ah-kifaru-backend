import { Router } from 'express';
import notificationController from '../../controllers/notification.controller';
import authMiddleware from '../../middleware/auth.middleware';
import validationMiddleware from '../../middleware/validation.middleware';

const validateRequest = validationMiddleware();

const router = Router();
router.get('/', authMiddleware, notificationController.getNotifications);
router.patch(
  '/opt',
  authMiddleware,
  validateRequest,
  notificationController.toggleNotification
);
router.patch(
  '/:notificationId',
  authMiddleware,
  validateRequest,
  notificationController.readNotification
);

export default router;
