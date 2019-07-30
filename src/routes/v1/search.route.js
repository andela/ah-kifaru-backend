import { Router } from 'express';
import SearchController from '../../controllers/search.controller';

const router = Router();

router.get('/', SearchController.generateSearchQuery);

export default router;
