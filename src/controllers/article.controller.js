import crypto from 'crypto';
import slug from 'slug';
import BaseRepository from '../repository/base.repository';
import responseGenerator from '../helpers/responseGenerator';
import db from '../database/models';
import Pagination from '../helpers/pagination';

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

  /**
   * @static
   * @param {object} req - - express request parameter
   * @param {object} res - - express response parameter
   * @returns {object} - - article object
   * @memberof ArticleController
   */
  static async createArticle(req, res) {
    const { id } = req.currentUser;
    const { title, description, body, image } = req.body;
    try {
      const article = await BaseRepository.create(db.Article, {
        title,
        description,
        body,
        image,
        slug: slug(
          `${title}-${crypto.randomBytes(12).toString('base64')}`
        ).toLowerCase(),
        authorId: id
      });
      return responseGenerator.sendSuccess(res, 201, article);
    } catch (error) {
      return responseGenerator.sendError(res, 500, error.message);
    }
  }

  /**
   * Get All Articles
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
          offset
        }
      );

      return articles.length > 0
        ? responseGenerator.sendSuccess(
            res,
            200,
            articles,
            null,
            paginate.getPageMetadata(count, '/api/v1/articles')
          )
        : responseGenerator.sendSuccess(
            res,
            404,
            null,
            'There are no articles found'
          );
    } catch (error) {
      return responseGenerator.sendError(res, 500, error.message);
    }
  }

  /**
   *
   *
   * @static
   * @param {*} req - - express request parameter
   * @param {*} res - - express response parameter
   * @returns {object} - - article object
   * @memberof ArticleController
   */
  static async fetchSpecificArticle(req, res) {
    const { articleId } = req.params;
    try {
      const article = await BaseRepository.findOne(db.Article, articleId);
      return responseGenerator.sendSuccess(res, 200, article);
    } catch (error) {
      return responseGenerator.sendError(res, 500, error.message);
    }
  }

  /**
   *
   *
   * @static
   * @param {*} req - - express request parameter
   * @param {*} res - - express response parameter
   * @returns {object} - - article object
   * @memberof ArticleController
   */
  static async updateOneArticle(req, res) {
    const { title, description, body, image } = req.body;
    const { articleId } = req.params;

    try {
      let article = await BaseRepository.findOne(db.Article, articleId);
      await BaseRepository.update(
        db.Article,
        {
          title,
          description,
          body,
          image
        },
        { id: articleId }
      );
      article = await BaseRepository.findOne(db.Article, articleId);
      return responseGenerator.sendSuccess(
        res,
        200,
        article,
        'Article successfully updated'
      );
    } catch (error) {
      return responseGenerator.sendError(res, 500, error.message);
    }
  }

  /**
   *
   *
   * @static
   * @param {*} req - - express request parameter
   * @param {*} res - - express response parameter
   * @returns  {object} - - article object
   * @memberof ArticleController
   */
  static async deleteArticle(req, res) {
    const { articleId } = req.params;
    try {
      await BaseRepository.remove(db.Article, { id: articleId });
      return responseGenerator.sendSuccess(
        res,
        200,
        null,
        'Article successfully deleted'
      );
    } catch (error) {
      return responseGenerator.sendError(res, 500, error.message);
    }
  }
}

export default ArticleController;
