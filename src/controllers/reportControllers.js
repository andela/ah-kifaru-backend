import db from '../database/models';
import baseRepository from '../repository/base.repository';

const { findOrCreate } = baseRepository;
const { Report } = db;

/**
 * @desc This a controller object literal that handles
 * containing functions that handles action relating to Articles
 */
class ReportArticles {
  /**
   * @description Reports a defaulting article
   * @param  {object} req The request object
   * @param  {object} res The response object
   * @return {object} The response object
   */
  static articleReport(req, res) {
    const { id } = req.token;
    const { articleId } = req.params;
    const { violation } = req.body;

    findOrCreate(Report, {
      id,
      articleId,

      defaults: {
        id,
        articleId,
        violation,
        description: req.body.description || ''
      }
    }).spread((report, created) => {
      if (!created) {
        return res.status(409).jsend.fail({
          message: 'You have reported this article already'
        });
      }
      return res.status(201).json({
        status: 201,
        message: 'This case has been recorded and will be reviewed'
      });
    });
  }
}

export default ReportArticles;
