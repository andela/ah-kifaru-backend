import responseGenerator from '../helpers/responseGenerator';
import db from '../database/models';
import BaseRepository from '../repository/base.repository';

const { Ratings, Article } = db;

/** Rating Class */
class RatingsController {
  /**
   * Handles User ability to rate Articles
   * @method
   * @async
   * @param  {Object}   req  - express http request object
   * @param  {Object}   res  - express http response object
   * @return {Object}        - returns an http response object
   * @static
   */
  static async rateArticles(req, res) {
    // needed parameters
    const { id } = req.params;
    const userId = req.currentUser.id;
    const { ratings } = req.body;

    const articleId = id;

    try {
      const article = await BaseRepository.findOneByField(Article, {
        id: articleId
      });

      if (article) {
        const rater = await BaseRepository.findOneByField(Ratings, {
          articleId,
          userId
        });

        if (rater) {
          const updateRatings = await BaseRepository.updateField(rater, {
            ratings
          });
          updateRatings.ratings = parseInt(updateRatings.ratings, 10);
          delete updateRatings.dataValues.userId;
          return responseGenerator.sendSuccess(res, 200, updateRatings);
        }

        const addRating = await BaseRepository.create(Ratings, {
          articleId,
          ratings,
          userId
        });
        addRating.ratings = parseInt(addRating.ratings, 10);
        delete addRating.dataValues.userId;
        return responseGenerator.sendSuccess(res, 200, addRating);
      }

      return responseGenerator.sendError(res, 200, 'Article does not exist');
    } catch (error) {
      return responseGenerator.sendError(res, 500, error.message);
    }
  }
}

export default RatingsController;
