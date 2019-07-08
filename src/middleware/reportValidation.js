import helpers from '../helpers/helpers';
import models from '../database/models';
import errorObj from '../helpers/errorHelpers';

const { notFound } = errorObj;
const { checkProps } = helpers;
const { Articles } = models;

const reportValidation = {
  /**
   * @description Validate the violation type passed
   * @param  {object} req The HTTP request object
   * @param  {object} res The HTTP response object
   * @param  {object} next The next middleware
   * @returns {object} The response object or the next middleware
   */
  validateViolation: (req, res, next) => {
    const violations = [
      'Discrimination',
      'Sexual Content',
      'Offensive Language',
      'Plagiarism'
    ];

    // Check if violation specified is allowed
    const found = violations.find(element => element === req.body.violation);

    if (!found) {
      return res.status(400).jsend.fail({
        message:
          "Invalid violation. Violation can be ['Discrimination', 'Plagiarism', 'Sexual Content', 'Offensive Language']"
      });
    }

    return next();
  },

  /**
   * @description Validate the objects passed in the body
   * @param  {object} req The HTTP request object
   * @param  {object} res The HTTP response object
   * @param  {object} next The next middleware
   * @returns {object} The HTTP response object or the next middleware
   */
  validateRequestObject: (req, res, next) => {
    const { valid, invalidMessages } = checkProps(
      req.body,
      'violation',
      'description'
    );

    if (!valid) {
      return res.status(400).jsend.fail({
        messages: invalidMessages
      });
    }

    return next();
  },
  validArticleId: (req, res, next) => {
    Articles.findOne({
      where: {
        id: req.params.articleId
      }
    })
      .then(record => {
        if (!record) {
          return notFound(req, res, 'Article');
        }
        return next();
      })
      .catch(() => notFound(req, res, 'Article'));
  }
};

export default reportValidation;
