import models from '../database/models';

const { sequelize } = models;

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
   * @param {*} model
   * @param {*} options
   * @returns {object} - returns an database object
   * @memberof BaseRepository
   */
  static async find(model, options) {
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
      where: { ...options }
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
    return model.update(fields, {
      where: options,
      returning: true
    });
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
  static async findItAll(model, options) {
    return model.findAll({ raw: true, where: { ...options } });
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

  /**
   *
   *
   * @static
   * @param {object} model - database model
   * @param {object} options - column options
   * @param {object} associatedModel - associated database model
   * @param {string} alias - title of the alias
   * @param {object} associatedOptions - query for the associated model
   * @returns {object} - returns a database object
   * @memberof BaseRepository
   */
  static async findAndInclude({
    model,
    options,
    limit,
    offset,
    associatedModel,
    alias,
    attributes
  }) {
    return model.findAll({
      raw: true,
      where: options,
      limit,
      offset,
      include: {
        model: associatedModel,
        as: alias,
        attributes
      }
    });
  }

  /**
   *
   *
   * @static
   * @param {object} model - database model
   * @param {object} options - column options
   * @param {object} associatedModel - associated database model
   * @param {string} alias - title of the alias
   * @param {array} attributes - array of required attributes from associated model
   * @param {integer} limit - maximum reponse objects
   * @param {integer} offset - page number
   * @returns {object} returns a database object
   * @memberof BaseRepository
   */
  static async findCountAndInclude({
    model,
    options,
    associatedModel,
    alias,
    attributes,
    limit,
    offset
  }) {
    return model.findAndCountAll({
      raw: true,
      where: { ...options },
      include: {
        model: associatedModel,
        as: alias,
        attributes
      },
      limit,
      offset
    });
  }

  /**
   * @static
   * @param {*} model
   * @param {*} options
   * @returns {object} - returns an database object
   * @memberof BaseRepository
   */
  static findOne(model, options) {
    return model.findOne(options);
  }

  /**
   * @static
   * @param {*} model
   * @param {*} options
   * @returns {object} - returns an database object
   * @memberof BaseRepository
   */
  static findOneByEmail(model, options) {
    return model.findOne(options);
  }

  /**
   * @static
   * @param {*} model
   * @param {*} options
   * @returns {object} - returns an database object
   * @memberof BaseRepository
   */
  static async delete(model, options) {
    return model.destory({
      where: options
    });
  }

  /**
   *
   *
   * @static
   * @param {object}  searchModified
   * @returns {object} - returns a database object
   * @memberof BaseRepository
   */
  static async searchAll(searchModified) {
    return sequelize.query(
      `SELECT a.id, a.title, a.body, a.description, u.username,
    (similarity(?, u.username)) as user_score,
    (similarity(?, a.title)) as title_score,
    (similarity(?, tg.name)) as tag_score
    from "Articles" a
    JOIN "Users" u ON u.id = a."authorId"
    JOIN "ArticleTags" at1 ON at1."articleId" = a.id
    JOIN "Tags" tg ON tg.id = at1."tagId"
    WHERE 
    a."publishedDate" is not null
    and a.status = 'active' and a."publishedDate" <= NOW()
    and (u.username ilike ?
    or a.title ilike ?
    or tg.name ilike ?)
    ORDER BY user_score, title_score, tag_score desc
    LIMIT 10 OFFSET 0`,
      {
        replacements: new Array(3)
          .fill(searchModified)
          .concat(new Array(3).fill(`%${searchModified}%`)),
        type: sequelize.QueryTypes.SELECT
      }
    );
  }

  /**
   *
   *
   * @static
   * @param {object} model
   * @param {array} data
   * @returns {object} - returns an database object
   * @memberof BaseRepository
   */
  static bulkCreate(model, data) {
    return model.bulkCreate(data);
  }

  /**
   *
   *
   * @static
   * @param {*} page - page to render
   * @param {*} limit - number of articles to display per request
   * @returns {object} - returns an database object
   * @memberof BaseRepository
   */
  static async findByRatingsAndReviews(page = 0, limit = 9) {
    const offset = page * 9;
    return sequelize.query(
      `SELECT a.id, a.title, a."publishedDate", a.title, a.image, a.description, AVG(r.ratings) avg_rating, COUNT(r."userId") count_rating, u.username
      FROM "Articles" a
      LEFT OUTER JOIN "Users" u ON u.id = a."authorId"
      LEFT OUTER JOIN "Ratings" r ON r."articleId" = a.id
      GROUP BY a.id, u.username
      ORDER BY count_rating desc, avg_rating desc
      LIMIT :limit OFFSET :offset`,
      { replacements: { offset, limit }, type: sequelize.QueryTypes.SELECT }
    );
  }

  /**
   * @static
   * @param {*} articleId - what to searchBy
   * @param {*} model - model to search
   * @param {*} searchBy - column name of what to seach by
   * @param {*} value - column name of what to calculate average by
   * @param {*} associatedModel - associated model name
   * @param {*} alias - alias for the relationship
   * @param {*} attributes - attributes to load from associated table
   * @returns {object} - returns an database object
   * @memberof BaseRepository
   */
  static async findAverage(articleId) {
    const query = `SELECT a.id, a.title, a.image, a.description, a.body, a."publishedDate", a."authorId",
    ARRAY(SELECT t.name
    FROM "Tags" t
    JOIN "ArticleTags" at ON at."tagId" = t.id
    JOIN "Articles" a ON a.id = at."articleId"
    WHERE a.id = :articleId
    )as tags, u.username, u.avatar, AVG(r.ratings) avg_rating, COUNT(r."userId") count_rating
    FROM "Articles" a
    LEFT OUTER JOIN "Users" u ON u.id = a."authorId"
    LEFT OUTER JOIN "Ratings" r ON r."articleId" = a.id
    WHERE a.id = :articleId
    GROUP BY a.id, u.username, u.avatar;`;

    const options = {
      replacements: { articleId },
      type: sequelize.QueryTypes.SELECT
    };

    return sequelize.query(query, options);
  }

  /*
   * @static
   * @param {*} model
   * @param {*} options
   * @returns {object} - returns an database object
   * @memberof BaseRepository
   */
  static find(model, options) {
    return model.findOne(options);
  }
}

export default BaseRepository;
