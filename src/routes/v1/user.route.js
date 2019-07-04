import { Router } from 'express';
import UserController from '../../controllers/user.controller';
import { userExist, isSelf } from '../../middleware/users.middleware';
import validationMiddleware from '../../middleware/validation.middleware';
import authMiddleware from '../../middleware/auth.middleware';

const router = Router();
const validateRequest = validationMiddleware();

router.post('/signup', validateRequest, UserController.createAccount);

router.post('/login', validateRequest, UserController.loginUser);

router.patch(
  '/verify/:token',
  validateRequest,
  authMiddleware,
  UserController.verifyUser
);

router.patch(
  '/unfollow',
  authMiddleware,
  validateRequest,
  isSelf,
  userExist,
  UserController.unfollowUser
);

router.patch(
  '/follow',
  authMiddleware,
  validateRequest,
  isSelf,
  userExist,
  UserController.followUser
);

export default router;
