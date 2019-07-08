import express from 'express';
import reportArticles from '../controllers/reportControllers';
import reportValidation from '../middleware/reportValidation';
// import               from '../middleware/permission.middleware';
const {
  validArticleId,
  validateRequestObject,
  validateViolation
} = reportValidation;

const { articleReport } = reportArticles;

const articleRoutes = express.Router();

articleRoutes.post(
  '/:articleId/report/article',
  validateRequestObject,
  validateViolation,
  validArticleId,
  // userCheck,
  articleReport
);

export default articleRoutes;
