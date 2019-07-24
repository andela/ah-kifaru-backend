import { Router } from 'express';
import authMiddleware from '../../middleware/auth.middleware';
import validationMiddleware from '../../middleware/validation.middleware';
import RatingsController from '../../controllers/rating.controller';
import { articleExist } from '../../middleware/article.middleware';
import paginationValidations from '../../middleware/pagination.validation';

const validateRequest = validationMiddleware();

const router = Router();
router.patch(
  '/:articleId/ratings',
  authMiddleware,
  validateRequest,
  articleExist,
  RatingsController.rateArticles
);

router.get(
  '/ratings/:articleId',
  paginationValidations,
  validateRequest,
  articleExist,
  RatingsController.getRatings
);

export default router;
