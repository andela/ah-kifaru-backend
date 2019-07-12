import dotenv from 'dotenv';
import { Router } from 'express';
import RatingsController from '../../controllers/ratings.controller';
import authMiddleware from '../../middleware/auth.middleware';
import validateRatings from '../../middleware/validation.middleware';

// middleware
const validateRequest = validateRatings();

dotenv.config();

const route = Router();

route.patch(
  '/:id/ratings',
  authMiddleware,
  validateRequest,
  RatingsController.rateArticles
);

export default route;
