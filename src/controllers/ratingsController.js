import Ratings from '../helper/ratingsInsertion';

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
    const rated = await Ratings.addRating(req.body);
    return res.status(200).json(rated);
  }
}

export default RatingsController;
