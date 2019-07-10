import { Router } from 'express';
import UserController from '../controllers/user.controller';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';

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

export default router;
