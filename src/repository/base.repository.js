/**
 * @class BaseRepository
 */
class BaseRepository {
  /**
   * @static
   * @param {*} model - database model
   * @param {object} options - database objects
   * @returns {object} returns an database object
   * @memberof BaseRepository
   */
  static async create(model, options) {
    return model.create(options);
  }

  /**
   * @static
   * @param {*} model
   * @param {*} options
   * @returns {object} - returns an database object
   * @memberof BaseRepository
   */
  static async findOneByField(model, options) {
    return model.findOne({ where: options });
  }

  /**
   * @static
   * @param {object} model - database model
   * @param {object} options - column options
   * @returns {object} - returns an database object
   * @memberof BaseRepository
   */
  static async updateField(model, options) {
    return model.update(options);
  }
}

export default BaseRepository;
