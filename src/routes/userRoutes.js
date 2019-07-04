import express from 'express';
import userController from '../controllers/userControllers';
import auth from '../middleware/auth';
import usersValidations from '../middleware/usersValidations';

const { validateNewPassword } = usersValidations;
const userRoutes = express.Router();

userRoutes.post('/auth/reset-password', userController.resetPassword);
userRoutes.put(
  '/auth/reset-password/:token',
  auth,
  validateNewPassword,
  userController.reset
);

export default userRoutes;
