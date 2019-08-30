import express from 'express';
import authMiddleware from '../../middleware/auth.middleware';
import likeController from '../../controllers/like.controller';
import commentControllers from '../../controllers/comment.controller';
import articleMiddleware from '../../middleware/article.middleware';
import validationMiddleware from '../../middleware/validation.middleware';

const validateRequest = validationMiddleware();

const commentRouter = express.Router();
const {
  addComment,
  updateComment,
  getComments,
  deleteComment
} = commentControllers;

//  like comment
commentRouter.post(
  '/:articleId/comments/:commentId/like',
  authMiddleware,
  validateRequest,
  likeController
);

commentRouter.get('/:articleId', articleMiddleware, getComments);

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
