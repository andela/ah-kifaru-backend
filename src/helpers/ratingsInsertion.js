import db from '../database/models';
import BaseRepository from '../repository/base.repository';

const { Ratings, Article } = db;

export default {
  /**
   *
   * @param {Object} ratingsInfo - validated form data
   * @async
   * @returns {Object} - data of rating added, articles not found, or ratings created
   */
  async addRating(ratingsInfo) {
    const { articleId, userId, ratings } = ratingsInfo;

    try {
      const article = await BaseRepository.findOneByField(Article, {
        id: articleId
      });
      if (!article) {
        return { serverError: false, msg: 'Article does not exist' };
      }

      const rater = await BaseRepository.findOneByField(Ratings, {
        articleId,
        userId
      });

      if (!rater.dataValues) {
        const addRating = await BaseRepository.create(Ratings, ratingsInfo);
        return { serverError: false, msg: addRating };
      }

      const updateRatings = await BaseRepository.updateField(rater, {
        ratings
      });
      return { serverError: false, msg: updateRatings };
    } catch (error) {
      return { serverError: true, msg: error.message };
    }
  }
};
