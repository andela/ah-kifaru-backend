import db from '../database/models';
import BaseRepository from '../repository/base.repository';
import responseGenerator from '../helpers/responseGenerator';
import Pagination from '../helpers/pagination';

const { Tags } = db;
/**
 * @class TagController
 */
class TagController {
  /**
   * Creates Tags
   *
   * @static
   * @async
   * @param {object} req
   * @param {object} res
   * @memberof TagController
   * @return {json} - Return json data
   */
  static async createTag(req, res) {
    const { tag } = req.body;
    try {
      const createdTag = await BaseRepository.findOrCreate(
        Tags,
        { name: tag },
        { name: tag }
      );

      if (createdTag[1]) {
        return responseGenerator.sendSuccess(
          res,
          201,
          createdTag[0],
          'Tag has been created'
        );
      }
      return responseGenerator.sendSuccess(
        res,
        200,
        createdTag[0],
        'Tag exists'
      );
    } catch (error) {
      return responseGenerator.sendError(res, 500, error.message);
    }
  }

  /**
   * Delete Tags
   *
   * @static
   * @async
   * @param {object} req
   * @param {object} res
   * @memberof TagController
   * @return {json} - Return json data
   */
  static async deleteTag(req, res) {
    const { id } = req.params;
    try {
      await BaseRepository.remove(Tags, { id });
      return responseGenerator.sendSuccess(
        res,
        200,
        null,
        'Tag successfully deleted'
      );
    } catch (error) {
      return responseGenerator.sendError(res, 500, error.message);
    }
  }

  /**
   *
   * Get all tags
   * @static
   * @param {*} request -- request object
   * @param {*} response -- response object
   * @returns {json} -- returns a json
   * @memberof TagController
   */
  static async fetchAllTags(request, response) {
    try {
      const { page } = request.query;
      const paginate = new Pagination(page, request.query.limit);
      const { limit, offset } = paginate.getQueryMetadata();
      const { count, rows: tags } = await BaseRepository.findAndCountAll(
        db.Tags,
        {
          limit,
          offset,
          attributes: ['id', 'name']
        }
      );
      return responseGenerator.sendSuccess(
        response,
        200,
        tags,
        null,
        paginate.getPageMetadata(count, '/api/v1/tags')
      );
    } catch (error) {
      return responseGenerator.sendError(response, 500, error.message);
    }
  }
}

export default TagController;
