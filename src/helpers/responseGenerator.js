import utility from './utils';

const responseGenerator = {
  /**
   * @param {*} res - express response object
   * @param {*} statusCode - response status code
   * @param {*} [message=undefined] - error message
   * @returns {Object} return a failed response
   */
  sendError(res, statusCode, message = undefined) {
    return res.status(statusCode).send({
      status: 'error',
      message
    });
  },

  /**
   * @param {Object} res - express response object
   * @param {int} statusCode - response status code
   * @param {*} data - response status code
   * @param {string} [message=undefined] - error message
   * @param {*} [pagination=undefined] - pagination
   * @returns {Object} return a success response
   */
  sendSuccess(
    res,
    statusCode,
    data,
    message = undefined,
    pagination = undefined
  ) {
    const filteredResponse = utility.stripNull({
      status: 'success',
      message,
      data,
      pagination
    });
    return res.status(statusCode).send(filteredResponse);
  }
};

export default responseGenerator;
