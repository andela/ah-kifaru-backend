import BaseRepository from '../repository/base.repository';
import responseGenerator from '../helpers/responseGenerator';
import db from '../database/models';
import Pagination from '../helpers/pagination';

/**
 * @description class representing Article Controller
 * @class SearchController
 */
class SearchDbController {
  /**
   * @description - This method is responsible for searching articles by author
   * @static
   * @param {object} req - Req sent to the router
   * @param {object} res - Response sent from the controller
   * @returns {object} - object representing response messages
   * @memberof SearchController
   */
  static async findArticles(req, res) {
    try {
      let searchResult;

      console.log(req.query, 'the query<<<<<<<<<<>>>>>>>>>>>.');

      console.log(req.params);
      const param = req.query.params;

      console.log('the params', param);
      if (param.length < 1) {
        searchResult = await BaseRepository.findByRatingsAndReviews();
      }

      searchResult = await BaseRepository.findSearchArticle(param);
      if (searchResult.length < 1) {
        return responseGenerator.sendSuccess(
          res,
          200,
          searchResult,
          'There are no articles that match this search result'
        );
      }
      return responseGenerator.sendSuccess(
        res,
        200,
        searchResult,
        null
        // paginate.getPageMetadata(count, '/api/v1/articles/popular')
      );
    } catch (error) {
      return responseGenerator.sendError(res, 500, error.message);
    }
  }
}

export default SearchDbController;
