import express from 'express';
import authMiddleware from '../../middleware/auth.middleware';
import likeController from '../../controllers/like.controller';
import validationMiddleware from '../../middleware/validation.middleware';

const validateRequest = validationMiddleware();

const commentRouter = express.Router();

//  like comment
commentRouter.post(
  '/:articleId/comments/:commentId/like',
  authMiddleware,
  validateRequest,
  likeController
);

export default commentRouter;
