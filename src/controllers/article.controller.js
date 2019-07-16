import BaseRepository from '../repository/base.repository';
import responseGenerator from '../helpers/responseGenerator';
import db from '../database/models';

/**
 * @class UserController
 */
class ArticleController {
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

    const allBookMarks = await BaseRepository.findAndInclude(
      db.Bookmark,
      { userId },
      db.Article,
      'article'
    );

    if (allBookMarks.length < 1) {
      return responseGenerator.sendError(
        res,
        400,
        `You currently do not have any article in your bookmark`
      );
    }
    return responseGenerator.sendSuccess(res, 200, null, allBookMarks);
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
  }
}

export default ArticleController;
