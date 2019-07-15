import { Router } from 'express';
import articleController from '../../controllers/article.controller';
import authMiddleware from '../../middleware/auth.middleware';
import articleMiddleware from '../../middleware/article.middleware';
import validationMiddleware from '../../middleware/validation.middleware';
import paginationValidations from '../../middleware/pagination.validation';

const validateRequest = validationMiddleware();

const router = Router();

router.get(
  '/bookmark',
  paginationValidations,
  authMiddleware,
  articleController.getBookMarks
);
router.patch(
  '/bookmark',
  validateRequest,
  articleMiddleware,
  authMiddleware,
  articleController.addBookMark
);
router.patch(
  '/unbookmark',
  validateRequest,
  articleMiddleware,
  authMiddleware,
  articleController.removeBookMark
);

export default router;
