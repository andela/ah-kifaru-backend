import db from '../database/models';
import BaseRepository from '../repository/base.repository';
import responseGenerator from '../helpers/responseGenerator';
import { updateAverage } from '../helpers/ratingsHelpers';
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

    // const { article } = req;
    try {
      let theRating;
      theRating = await BaseRepository.findOrCreate(
        Rating,
        { articleId, userId },
        {
          articleId,
          userId,
          ratings
        }
      );
      const [user, created] = theRating;
      theRating = await user.get({ plain: true });

      created && updateAverage(articleId);

      if (!created) {
        theRating = await BaseRepository.update(
          Rating,
          { ratings },
          { userId, articleId }
        );
        updateAverage(articleId);
      }

      return responseGenerator.sendSuccess(
        res,
        200,
        null,
        'Article Rated Successfully'
      );
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
