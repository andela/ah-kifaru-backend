import { Router } from 'express';
import UserController from '../../controllers/user.controller';
import { userExist, isSelf } from '../../middleware/users.middleware';
import validationMiddleware from '../../middleware/validation.middleware';
import authMiddleware from '../../middleware/auth.middleware';

const router = Router();
const validateRequest = validationMiddleware();

router.patch(
  '/follow',
  authMiddleware,
  validateRequest,
  isSelf,
  userExist,
  UserController.followUser
);

router.patch(
  '/unfollow',
  authMiddleware,
  validateRequest,
  isSelf,
  userExist,
  UserController.unfollowUser
);

export default router;
