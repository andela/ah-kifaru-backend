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
            'publishedDate',
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

  /**
   *
   *
   * @static
   * @param {*} request -- Request object
   * @param {*} response -- Response object
   * @returns {json} -- Returns a json object
   * @memberof ArticleController
   */
  static async draftArticle(request, response) {
    const { id: authorId } = request.currentUser;
    const { title, description, body, image } = request.body;
    const createDate = new Date();
    try {
      const article = await BaseRepository.create(db.Article, {
        title,
        description,
        body,
        image,
        slug: slug(
          `${title}-${crypto.randomBytes(12).toString('base64')}`
        ).toLowerCase(),
        authorId,
        createdAt: createDate,
        updatedAt: null
      });
      return responseGenerator.sendSuccess(
        response,
        201,
        article,
        'Artilcle successfully created'
      );
    } catch (error) {
      return responseGenerator.sendError(response, 500, error.message);
    }
  }

  /**
   *
   *
   * @static
   * @param {*} request - - express request parameter
   * @param {*} response - - express response parameter
   * @returns {object} - - article object
   * @memberof ArticleController
   */
  static async fetchSpecificArticle(request, response) {
    const { article } = request;
    return responseGenerator.sendSuccess(response, 200, article);
  }

  /**
   *
   *
   * @static
   * @param {*} request - - express request parameter
   * @param {*} response - - express response parameter
   * @returns  {object} - - article object
   * @memberof ArticleController
   */
  static async deleteArticle(request, response) {
    const { articleId } = request.params;
    const { id, role } = request.currentUser;
    try {
      const article = await BaseRepository.findOneByField(db.Article, {
        id: articleId
      });

      if (article) {
        if (article.authorId !== id && role !== 'superadmin') {
          return responseGenerator.sendError(
            response,
            403,
            'Unauthorized: You cannot delete this article'
          );
        }

        await BaseRepository.remove(db.Article, { id: article.id });
      }

      return responseGenerator.sendSuccess(
        response,
        200,
        null,
        'Article successfully deleted'
      );
    } catch (error) {
      return responseGenerator.sendError(response, 500, error.message);
    }
  }

  /**
   *
   *
   * @static
   * @param {*} request - - express request parameter
   * @param {*} response - - express response parameter
   * @returns {object} - - article object
   * @memberof ArticleController
   */
  static async updateOneArticle(request, response) {
    const { articleId } = request.params;
    const { id: authorId } = request.currentUser;
    const { title, description, body, image } = request.body;
    const newUpdateDate = new Date();

    try {
      const updatedArticle = await BaseRepository.update(
        db.Article,
        {
          title,
          description,
          body,
          image,
          updatedAt: newUpdateDate
        },
        { id: articleId, authorId }
      );

      if (updatedArticle[0]) {
        return responseGenerator.sendSuccess(
          response,
          200,
          updatedArticle[1][0].dataValues,
          'Article successfully updated'
        );
      }
      return responseGenerator.sendError(
        response,
        404,
        'The requested article was not found'
      );
    } catch (error) {
      return responseGenerator.sendError(response, 500, error.message);
    }
  }
}

export default ArticleController;
