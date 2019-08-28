/* eslint-disable require-jsdoc */
import models from '../database/models';
import commentHelpers from '../helpers/commentHelpers';
import Baserepository from '../repository/base.repository';
import responseGerator from '../helpers/responseGenerator';

const { Comments, User } = models;
const { updater } = commentHelpers;

class CommentsController {
  static async getComments(req, res) {
    const { articleId } = req.params;
    try {
      const getAllComent = await Baserepository.findAndCountAll(Comments, {
        where: {
          articleId
        },
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username']
          }
        ]
      });
      return responseGerator.sendSuccess(
        res,
        200,
        getAllComent,
        'Operation Successful'
      );
    } catch (e) {
      return responseGerator.sendSuccess(
        res,
        500,
        'There was a problem processing your request'
      );
    }
  }

  static async addComment(req, res) {
    const { article } = req;
    const { content } = req.body;
    const userId = req.currentUser.id;

    const userComment = {
      content,
      userId,
      articleId: article.id
    };

    try {
      const comment = await Baserepository.create(Comments, userComment);
      return responseGerator.sendSuccess(
        res,
        201,
        comment,
        'Commented successfully'
      );
    } catch (error) {
      return responseGerator.sendSuccess(
        res,
        500,
        'There was a problem processing your request'
      );
    }
  }

  static async updateComment(req, res) {
    try {
      const commentExist = await Baserepository.find(Comments, {
        where: {
          id: req.params.commentId
        }
      });
      if (!commentExist) {
        return responseGerator.sendError(
          res,
          404,
          'The specified comment is not found'
        );
      }

      const reqData = {
        content: req.body.content,
        commentId: req.params.commentId
      };

      return updater(res, Comments, reqData, 'Comment');
    } catch (e) {
      return responseGerator.sendError(
        res,
        500,
        'there is an internal server error'
      );
    }
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
  static async deleteComment(request, response) {
    const { commentId } = request.params;
    const { id, role } = request.currentUser;
    try {
      const comment = await Baserepository.findOneByField(Comments, {
        id: commentId
      });

      if (comment) {
        if (comment.userId !== id && role !== 'superadmin') {
          return responseGerator.sendError(
            response,
            403,
            'Unauthorized: You cannot delete this comment'
          );
        }

        await Baserepository.remove(Comments, { id: commentId });
      }

      return responseGerator.sendSuccess(
        response,
        200,
        null,
        'Comment successfully deleted'
      );
    } catch (error) {
      return responseGerator.sendError(response, 500, error.message);
    }
  }
}

export default CommentsController;
