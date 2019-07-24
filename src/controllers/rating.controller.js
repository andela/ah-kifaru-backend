import db from '../database/models';
import BaseRepository from '../repository/base.repository';
import responseGenerator from '../helpers/responseGenerator';
import { checkRater } from '../middleware/users.middleware';
import Pagination from '../helpers/pagination';

const { Rating } = db;

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
    const { articleId } = req.params;
    const { id: userId } = req.currentUser;
    const { ratings } = req.body;

    const { article } = req;

    const author = checkRater(userId, article);

    if (author) {
      return responseGenerator.sendError(
        res,
        403,
        'You cannot rate your article'
      );
    }
    try {
      const rater = await BaseRepository.findOneByField(Rating, {
        articleId,
        userId
      });

      let newRating;
      if (rater) {
        newRating = await BaseRepository.update(
          Rating,
          { ratings },
          { userId, articleId }
        );
      } else {
        newRating = await BaseRepository.create(Rating, {
          articleId,
          ratings,
          userId
        });
      }
      newRating.ratings = parseInt(newRating.ratings, 10);
      delete newRating.dataValues.userId;
      return responseGenerator.sendSuccess(res, 200, newRating);
    } catch (error) {
      return responseGenerator.sendError(res, 500, error.message);
    }
  }

  /**
   * Get all bookmarked articles
   * @async
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {json} Returns containing all ratings of an article
   * @static
   */
  static async getRatings(req, res) {
    const { articleId } = req.params;

    const averageRating = await BaseRepository.findAverage(
      articleId,
      db.Rating,
      'articleId',
      'ratings'
    );
    const [response] = averageRating;
    if (!response) {
      return responseGenerator.sendError(
        res,
        404,
        'This article has not been rated yet'
      );
    }

    const summary = {
      articleId: response.articleId,
      averageRating: Number(response.avgRating).toFixed(1),
      totalNumberOfRatings: Number(response.totalCount)
    };

    return responseGenerator.sendSuccess(res, 200, { ...summary });
  }
}

export default RatingsController;
