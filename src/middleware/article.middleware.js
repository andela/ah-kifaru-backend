import db from '../database/models';
import Baserepository from '../repository/base.repository';
import responseGenerator from '../helpers/responseGenerator';

export const articleExist = async (req, res, next) => {
  const { articleId } = req.params || req.body;
  try {
    const findArticle = await Baserepository.findOneByField(db.Article, {
      id: articleId
    });

    if (!findArticle) {
      return responseGenerator.sendError(
        res,
        404,
        'The requested article was not found'
      );
    }
    req.article = findArticle;
    next();
  } catch (error) {
    return responseGenerator.sendError(res, 500, error.message);
  }
};

export default articleExist;
