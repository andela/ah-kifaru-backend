import jwt from 'jsonwebtoken';
import Ratings from '../helpers/ratingsInsertion';
import responseGenerator from '../helpers/responseGenerator';

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
    const { serverError, msg } = await Ratings.addRating(req.body);
    if (serverError) {
      return responseGenerator.sendError(res, 500, msg);
    }
    return responseGenerator.sendSuccess(res, 200, msg);
  }
}

export default RatingsController;
