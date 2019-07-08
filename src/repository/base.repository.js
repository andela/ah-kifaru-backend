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
   * @param {object} fields - a table column in the database
   * @param {object} options - column options
   * @returns {object} - returns an database object
   * @memberof BaseRepository
   */
  static async update(model, fields, options) {
    return model.update(fields, { where: options });
  }

  /**
   *
   *
   * @static
   * @param {object} model - database model
   * @param {object} options - column options
   * @returns {object} - returns a database object
   * @memberof BaseRepository
   */

  static async find(model, option) {
    return model.findOne({ where: option });
  }

  /**
   *
   *
   * @static
   * @param {object} model - database model
   * @param {object} options - column options
   * @returns {object} - returns a database object
   * @memberof BaseRepository
   */

  static async findOrCreate(model, option) {
    return model.findOrCreate({ where: option });
  }

  /**
   *
   *
   * @static
   * @param {object} model - database model
   * @param {object} options - column options
   * @returns {object} - returns a database object
   * @memberof BaseRepository
   */

  static async delete(model, options) {
    return model.destory({
      where: options
    });
  }
}

export default BaseRepository;
