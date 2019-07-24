import { Router } from 'express';
import ArticleController from '../../controllers/article.controller';
import authMiddleware from '../../middleware/auth.middleware';
import validationMiddleware from '../../middleware/validation.middleware';
import paginationValidations from '../../middleware/pagination.validation';
import { articleExist } from '../../middleware/article.middleware';

const validateRequest = validationMiddleware();

const router = Router();
router.get('/', paginationValidations, ArticleController.fetchAllArticles);

router.get(
  '/bookmarks',
  paginationValidations,
  authMiddleware,
  ArticleController.getBookMarks
);
router.patch(
  '/bookmark',
  validateRequest,
  articleExist,
  authMiddleware,
  ArticleController.addBookMark
);
router.patch(
  '/unbookmark',
  validateRequest,
  articleExist,
  authMiddleware,
  ArticleController.removeBookMark
);

export default router;
