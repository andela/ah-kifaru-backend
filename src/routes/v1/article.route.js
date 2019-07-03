import { Router } from 'express';
import ArticleController from '../../controllers/article.controller';
import authMiddleware from '../../middleware/auth.middleware';
import articleMiddleware from '../../middleware/article.middleware';
import validationMiddleware from '../../middleware/validation.middleware';
import paginationValidations from '../../middleware/pagination.validation';
import RatingsController from '../../controllers/rating.controller';

const router = Router();
router.get('/', paginationValidations, ArticleController.fetchAllArticles);
const validateRequest = validationMiddleware();

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
router.patch(
  '/:articleId/ratings',
  authMiddleware,
  validateRequest,
  articleMiddleware,
  RatingsController.rateArticles
);

router.post(
  '/',
  authMiddleware,
  validateRequest,
  ArticleController.createArticle
);

router.get('/', ArticleController.fetchAllArticles);

router.get(
  '/:articleId',
  articleMiddleware,
  ArticleController.fetchSpecificArticle
);

router.put(
  '/:articleId',
  authMiddleware,
  validateRequest,
  articleMiddleware,
  ArticleController.updateOneArticle
);

router.delete(
  '/:articleId',
  authMiddleware,
  articleMiddleware,
  ArticleController.deleteArticle
);

export default router;
