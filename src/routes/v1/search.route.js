import { Router } from 'express';
import SearchController from '../../controllers/search.controller';

const router = Router();

router.get('/:author', SearchController.searchByAuthor);

export default router;
