import BaseRepository from '../repository/base.repository';
import responseGenerator from '../helpers/responseGenerator';
import db from '../database/models';
import Pagination from '../helpers/pagination';

/**
 * @class UserController
 */
class ArticleController {
  /**
   * Get users and their corresponding profiles
   * @async
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {json} Returns json object
   * @static
   */
  static async fetchAllArticles(req, res) {
    try {
      const { page } = req.query;
      const paginate = new Pagination(page, req.query.limit);
      const { limit, offset } = paginate.getQueryMetadata();
      const { count, rows: articles } = await BaseRepository.findAndCountAll(
        db.Article,
        {
          limit,
          offset,
          attributes: [
            'id',
            'authorId',
            'title',
            'body',
            'image',
            'published',
            'status'
          ]
        }
      );
      return responseGenerator.sendSuccess(
        res,
        200,
        articles,
        null,
        paginate.getPageMetadata(count, '/api/v1/articles')
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
   * @return {json} Returns json object
   * @static
   */
  static async getBookMarks(req, res) {
    const { id: userId } = req.currentUser;
    try {
      const { page } = req.query;
      const paginate = new Pagination(page, req.query.limit);
      const { limit, offset } = paginate.getQueryMetadata();

      const {
        count,
        rows: allBookMarks
      } = await BaseRepository.findCountAndInclude({
        model: db.Bookmark,
        options: { userId },
        limit,
        offset,
        alias: 'article',
        associatedModel: db.Article,
        attributes: ['id', 'title', 'authorId', 'description']
      });
      const message = count
        ? 'Bookmarks found'
        : 'You currently do not have any article in your bookmark';

      if (count > 0) {
        return responseGenerator.sendSuccess(
          res,
          200,
          allBookMarks,
          message,
          paginate.getPageMetadata(count, '/api/v1/articles')
        );
      }
      return responseGenerator.sendSuccess(res, 200, allBookMarks, message);
    } catch (err) {
      return responseGenerator.sendError(res, 500, err.message);
    }
  }

  /**
   * Add article to bookmarks
   * @async
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {json} Returns json object
   * @static
   */
  static async addBookMark(req, res) {
    try {
      const { id: userId } = req.currentUser;
      const { articleId } = req.body;

      await BaseRepository.findOrCreate(
        db.Bookmark,
        { articleId, userId },
        { articleId, userId }
      );

      return responseGenerator.sendSuccess(
        res,
        200,
        null,
        'Article Bookmarked successfully'
      );
    } catch (err) {
      return responseGenerator.sendError(res, 500, err.message);
    }
  }

  /**
   * Remove article from bookmarks
   * @async
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {json} Returns json object
   * @static
   */
  static async removeBookMark(req, res) {
    try {
      const { articleId } = req.body;
      const { id: userId } = req.currentUser;
      await BaseRepository.remove(db.Bookmark, {
        articleId,
        userId
      });
      return responseGenerator.sendSuccess(
        res,
        200,
        null,
        `article with id = ${articleId} has been successfully removed from your bookmarks`
      );
    } catch (err) {
      return responseGenerator.sendError(res, 500, err.message);
    }
  }
}

export default ArticleController;
