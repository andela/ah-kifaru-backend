import { Router } from 'express';
import SearchController from '../../controllers/search.controller';
import SearchDbController from '../../controllers/searchDb.controller';
import paginationValidations from '../../middleware/pagination.validation';

const router = Router();

router.get('/articles/', SearchDbController.findArticles);
router.get('/', SearchController.generateSearchQuery);

export default router;
