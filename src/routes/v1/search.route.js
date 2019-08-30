import { Router } from 'express';
import SearchController from '../../controllers/search.controller';
import SearchDbController from '../../controllers/searchDb.controller';
import paginationValidations from '../../middleware/pagination.validation';

const router = Router();

router.get('/?search', SearchController.generateSearchQuery);

router.get(
  '/articles/',
  //   paginationValidations,
  SearchDbController.findArticles
);

export default router;
