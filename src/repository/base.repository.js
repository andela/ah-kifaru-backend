/**
 * @class BaseRepository
 */
class BaseRepository {
  /**
   * @param {object} model - database model
   * @param {object} field - parameters specific to the row in the database
   * @param {object} options - data to supply to the columns if the data does not exist
   * @returns {*} - data of the user, and a boolean for whether or not it was just created
   * @memberof BaseRepository
   */
  static async findOrCreate(model, field, options) {
    return model.findOrCreate({
      where: field,
      defaults: options
    });
  }

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
   * @param {object} options - data to sprcific to the rows to be deleted in the database
   * @returns {*} - data of the user, and a boolean for whether or not it was just created
   * @memberof BaseRepository
   */
  static async remove(model, options) {
    return model.destroy({
      where: options
    });
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
   * @static
   * @param {object} data - object of containing the relevant data
   * @param {object} options - column options
   * @returns {object} - returns an database object
   * @memberof BaseRepository
   */
  static async updateField(data, options) {
    return data.update(options);
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
  static async findAll(model, options) {
    return model.findAll({ ...options });
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
  static async findAndCountAll(model, options) {
    return model.findAndCountAll({ ...options });
  }
}

export default BaseRepository;
