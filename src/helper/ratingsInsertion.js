import models from '../database/models';

const { Ratings } = models;

export default {
  /**
   *
   * @param {Object} ratingsInfo - validated form data
   * @async
   * @returns {Object} - data of rating added
   */
  async addRating(ratingsInfo) {
    try {
      const rated = await Ratings.create(ratingsInfo);
      process.stdout.write(rated);
      return rated;
    } catch (error) {
      return error;
    }
  }
};
