import { Router } from 'express';
import UserController from '../../controllers/user.controller';
import validationMiddleware from '../../middleware/validation.middleware';
import authMiddleware from '../../middleware/auth.middleware';
import paginationValidations from '../../middleware/pagination.validation';

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

router.get(
  '/users',
  validateRequest,
  authMiddleware,
  paginationValidations,
  UserController.listUsers
);

export default router;
