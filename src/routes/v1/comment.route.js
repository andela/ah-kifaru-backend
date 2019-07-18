import express from 'express';
import authMiddleware from '../../middleware/auth.middleware';
import commentControllers from '../../controllers/comment.controller';
import articleMiddleware from '../../middleware/article.middleware';
import validationMiddleware from '../../middleware/validation.middleware';

const validateRequest = validationMiddleware();

const {
  addComment,
  updateComment,
  getComments,
  deleteComment
} = commentControllers;

const commentRouter = express.Router();


commentRouter.get(
  '/:articleId',
  authMiddleware,
  validateRequest,
  articleMiddleware,
  getComments
);

commentRouter.post(
  '/:articleId',
  authMiddleware,
  validateRequest,
  articleMiddleware,
  addComment
);


commentRouter.put(
  '/:commentId',
  authMiddleware,
  validateRequest,
  updateComment
);


commentRouter.delete(
  '/:commentId',
  authMiddleware,
  validateRequest,
  deleteComment
);

export default commentRouter;
