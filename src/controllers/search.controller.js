import BaseRepository from '../repository/base.repository';
import db from '../database/models';
import responseGenerator from '../helpers/responseGenerator';

/**
 * @description class representing Article Controller
 * @class SearchController
 */
class SearchController {
  /**
   * @description - This method is responsible for searching articles by author
   * @static
   * @param {object} req - Req sent to the router
   * @param {object} res - Response sent from the controller
   * @returns {object} - object representing response messages
   * @memberof SearchController
   */
  static async generateSearchQuery(req, res) {
    try {
      let searchResult;
      if (req.query.search) {
        const { search } = req.query;

        const searchModified = search.toLowerCase();
        searchResult = await BaseRepository.searchAll(searchModified);
        return responseGenerator.sendSuccess(res, 200, searchResult, null);
      }
      searchResult = await BaseRepository.findAndCountAll(db.Article, {
        attributes: ['id', 'authorId', 'title', 'body', 'image', 'status']
      });
      const { rows } = searchResult;
      return responseGenerator.sendSuccess(res, 200, rows, null);
    } catch (error) {
      return responseGenerator.sendError(res, 500, error.message);
    }
  }
}

export default SearchController;
