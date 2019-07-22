import BaseRepository from '../repository/base.repository';
import db from '../database/models';
import responseGenerator from '../helpers/responseGenerator';

const { Op } = db.Sequelize;
/**
 * @description class representing Article Controller
 * @class SearchController
 */
class SearchController {
  /**
   * @description - This method is responsible for searching articles by author
   * @static
   * @param {object} req - Request sent to the router
   * @param {object} res - Response sent from the controller
   * @returns {object} - object representing response messages
   * @memberof SearchController
   */
  static async searchByAuthor(req, res) {
    const authorName = req.params.author;
    try {
      const authors = await BaseRepository.findOneAndInclude(
        db.User,
        {
          username: { [Op.like]: `%${authorName}%` }
        },
        {
          model: db.Article,
          as: 'Articles',
          attributes: [
            'authorId',
            'slug',
            'title',
            'description',
            'body',
            'image'
          ]
        },
        ['id', 'username', 'bio', 'email', 'avatar']
      );
      if (authors.length) {
        return responseGenerator.sendSuccess(res, 200, authors);
      }
      return responseGenerator.sendError(
        res,
        404,
        'No article or author found'
      );
    } catch (error) {
      return responseGenerator.sendError(res, 500, error.message);
    }
  }
}

export default SearchController;
