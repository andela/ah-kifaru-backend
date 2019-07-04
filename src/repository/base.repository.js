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
   * @param {*} model
   * @param {*} options
   * @returns {object} - returns an database object
   * @memberof BaseRepository
   */
  static async findOneByField(model, options) {
    // console.log(model);
    // console.log(options);
    return model.findOne({ where: options });
  }
}

export default BaseRepository;
