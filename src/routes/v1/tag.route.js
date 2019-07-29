import { Router } from 'express';
import authMiddleware from '../../middleware/auth.middleware';
import superAdminCheck from '../../middleware/permission.middleware';
import validationMiddleware from '../../middleware/validation.middleware';
import TagController from '../../controllers/tag.controller';
import paginationValidations from '../../middleware/pagination.validation';

const validateRequest = validationMiddleware();

const router = Router();

router.put('/create', authMiddleware, validateRequest, TagController.createTag);
router.delete(
  '/:id/delete',
  authMiddleware,
  superAdminCheck,
  validateRequest,
  TagController.deleteTag
);
router.get(
  '/',
  authMiddleware,
  paginationValidations,
  TagController.fetchAllTags
);

export default router;
