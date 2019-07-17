import { Router } from 'express';
import ArticleController from '../../controllers/article.controller';
import authMiddleware from '../../middleware/auth.middleware';
import articleMiddleware from '../../middleware/article.middleware';
import validationMiddleware from '../../middleware/validation.middleware';
import paginationValidations from '../../middleware/pagination.validation';

const validateRequest = validationMiddleware();

const router = Router();
router.get('/', paginationValidations, ArticleController.fetchAllArticles);

router.get(
  '/bookmark',
  paginationValidations,
  authMiddleware,
  ArticleController.getBookMarks
);
router.patch(
  '/bookmark',
  validateRequest,
  articleMiddleware,
  authMiddleware,
  ArticleController.addBookMark
);
router.patch(
  '/unbookmark',
  validateRequest,
  articleMiddleware,
  authMiddleware,
  ArticleController.removeBookMark
);

export default router;
