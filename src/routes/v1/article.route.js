import { Router } from 'express';
import ArticleController from '../../controllers/article.controller';
import RatingsController from '../../controllers/rating.controller';
import authMiddleware from '../../middleware/auth.middleware';
import articleMiddleware from '../../middleware/article.middleware';
import validationMiddleware from '../../middleware/validation.middleware';
import paginationValidations from '../../middleware/pagination.validation';



const validateRequest = validationMiddleware();

const router = Router();

router.get('/', paginationValidations, ArticleController.fetchAllArticles);

router.get(
  '/popular',
  paginationValidations,
  ArticleController.fetchArticlesByRatings
);

router.get(
  '/bookmarks',
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

router.put(
  '/publish',
  authMiddleware,
  validateRequest,
  ArticleController.publishArticle
);

router.post(
  '/',
  authMiddleware,
  validateRequest,
  ArticleController.createDraft
);

router.delete(
  '/:articleId',
  authMiddleware,
  validateRequest,
  ArticleController.deleteArticle
);

router.put(
  '/:articleId',
  authMiddleware,
  validateRequest,
  ArticleController.updateOneArticle
);
router.post(
  '/:articleId/report',
  authMiddleware,
  validateRequest,
  articleMiddleware,
  ArticleController.reportArticle
);

router.get(
  '/:articleId',
  validateRequest,
  ArticleController.fetchSpecificArticle
);

router.patch(
  '/:articleId/ratings',
  authMiddleware,
  validateRequest,
  articleMiddleware,
  RatingsController.rateArticles
);

export default router;
