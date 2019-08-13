import BaseRepository from '../repository/base.repository';
import responseGenerator from '../helpers/responseGenerator';
import utility from '../helpers/utils';
import db from '../database/models';
import Pagination from '../helpers/pagination';
import NotificationHelper from '../helpers/notifications';
import mailer from '../helpers/mailer';

const { User } = db;

const BASE_URL =
  process.NODE_ENV === 'development'
    ? 'localhost:3000'
    : 'https://errorswagfrontend-staging.herokuapp.com';

const { jwtSigner, verifyPassword } = utility;
const { onFollowNotification } = NotificationHelper;
/**
 * @class UserController
 */
class UserController {
  /**
   * @param {object} req - express request object
   * @param {object} res - express response object
   * @returns {object}- return user's account information
   * @memberof UserController
   */
  static async createAccount(req, res) {
    try {
      const { username, email, password } = req.body;

      const user = await BaseRepository.findOneByField(db.User, { email });

      if (user) {
        if (user.status === 'unverified') {
          return responseGenerator.sendError(
            res,
            400,
            `This account is already registered. A verification link has been sent to your email. Check your email to continue.`
          );
        }

        return responseGenerator.sendError(
          res,
          400,
          'User with this email address already exist'
        );
      }

      const createdUser = await BaseRepository.create(db.User, {
        username,
        email,
        password
      });

      const { id, role, status } = createdUser;

      const token = jwtSigner({
        id,
        username,
        email,
        role
      });

      mailer({
        name: username,
        receiver: email,
        subject: 'Welcome to ErrorSwag',
        templateName: 'confirm_account',
        buttonUrl: `${BASE_URL}/verify/${token}`
      });

      return responseGenerator.sendSuccess(
        res,
        201,
        {
          username,
          email,
          role,
          status,
          token
        },
        'Account created successfully. An email verification link has been sent to your email address.'
      );
    } catch (error) {
      return responseGenerator.sendError(res, 500, error.message);
    }
  }

  /**
   * @param {object} req - express request object
   * @param {object} res - express response object
   * @returns {object}- return user's account information
   * @memberof UserController
   */
  static async loginUser(req, res) {
    const { email, password } = req.body;
    try {
      const user = await BaseRepository.findOneByField(db.User, { email });

      if (user) {
        const bcryptResponse = await verifyPassword(password, user.password);
        if (bcryptResponse) {
          const { id, username, email, role, status } = user;
          const token = jwtSigner({
            id,
            username,
            email,
            role
          });

          if (user.status === 'unverified') {
            mailer({
              name: username,
              receiver: email,
              subject: 'Welcome to ErrorSwag',
              templateName: 'confirm_account',
              buttonUrl: `${BASE_URL}/verify/${token}`
            });

            return responseGenerator.sendSuccess(
              res,
              200,
              {
                token
              },
              `Account has not been activated. Kindly check your email address for a verification link.`
            );
          }

          if (user.status === 'inactive') {
            return responseGenerator.sendSuccess(
              res,
              200,
              {
                token
              },
              `Your account has been deactivated. Kindly contact support for help.`
            );
          }
          return responseGenerator.sendSuccess(res, 200, {
            username,
            email,
            role,
            status,
            token
          });
        }
      }

      return responseGenerator.sendError(res, 401, 'Invalid user credentials.');
    } catch (error) {
      return responseGenerator.sendError(res, 500, error.message);
    }
  }

  /**
   * @static
   * @param {object} req - express request object
   * @param {object} res - express response object
   * @returns {object}- return updated row in json format
   * @memberof UserController
   */
  static async verifyUser(req, res) {
    const { email } = req.currentUser;

    try {
      const user = await BaseRepository.findOneByField(db.User, { email });

      if (user && user.status !== 'active') {
        const updatedUser = await BaseRepository.update(
          db.User,
          { status: 'active' },
          { email }
        );

        if (updatedUser[0] > 0) {
          return responseGenerator.sendSuccess(
            res,
            200,
            null,
            'Your account has been activated.'
          );
        }
      }

      return responseGenerator.sendError(res, 400, 'Invalid validation token.');
    } catch (error) {
      return responseGenerator.sendError(res, 500, error);
    }
  }

  /**
   *
   *
   * @static
   * @param {object} req - express request object
   * @param {object} res - express response object
   * @returns {object} - return user's updated data
   * @memberof UserController
   */
  static async updateProfile(req, res) {
    try {
      const { firstname, lastname, avatar, bio } = req.body;
      const { id: userId } = req.currentUser;
      const userExist = await BaseRepository.findOneByField(db.User, {
        id: userId
      });
      if (userExist) {
        await BaseRepository.update(
          db.User,
          { firstname, lastname, avatar, bio },
          { id: userId }
        );
        return responseGenerator.sendSuccess(
          res,
          200,
          null,
          'Record successfully updated'
        );
      }
      return responseGenerator.sendSuccess(res, 404, null, 'User not found');
    } catch (error) {
      return responseGenerator.sendError(res, 500, error.message);
    }
  }

  /**
   *
   *
   * @description This is the method that generates the password reset email
   * @param  {object} req The request object
   * @param  {object} res The response object
   * @returns {object} json response
   */
  static async resetPassword(req, res) {
    try {
      const user = await BaseRepository.findOne(User, {
        where: { email: req.body.email }
      });
      if (!user) {
        return responseGenerator.sendError(
          res,
          400,
          'Email does not match any account in our record'
        );
      }
      const token = jwtSigner({
        email: user.dataValues.email,
        time: { expiresIn: 600 }
      });

      mailer({
        name: user.dataValues.username,
        receiver: user.dataValues.email,
        subject: 'Password reset',
        templateName: 'reset_password',
        buttonUrl: `${BASE_URL}/reset-password/${token}`
      });
      return responseGenerator.sendSuccess(
        res,
        200,
        null,
        'A password reset link would be sent to the email provided if it is associated with a registered email'
      );
    } catch (error) {
      return responseGenerator.sendError(res, 500, error.message);
    }
  }

  /**
   *
   *
   * @static
   * @param {object} req - express request object
   * @param {object} res - express response object
   * @returns {object} - returns number of rows updated
   * @memberof UserController
   */
  static async updateRole(req, res) {
    try {
      const { role } = req.body;
      const { id } = req.params;
      const findId = await BaseRepository.findOneByField(db.User, { id });
      if (findId) {
        const userObject = await BaseRepository.update(
          db.User,
          { role },
          { id }
        );
        return responseGenerator.sendSuccess(res, 200, { userObject });
      }
      return responseGenerator.sendError(res, 400, 'Invalid User ID');
    } catch (error) {
      return responseGenerator.sendError(res, 500, error.message);
    }
  }

  /**
   *
   *
   * @static
   * @param {object} req - express request object
   * @param {object} res - express response object
   * @returns {object} - return user's  object data
   * @memberof UserController
   */
  static async viewProfile(req, res) {
    try {
      const { id } = req.params;
      const userObject = await BaseRepository.findOneByField(db.User, {
        id,
        status: 'active'
      });
      if (userObject) {
        return responseGenerator.sendSuccess(res, 200, userObject);
      }
      return responseGenerator.sendError(res, 400, 'Invalid User ID');
    } catch (error) {
      return responseGenerator.sendError(res, 500, error.message);
    }
  }

  /**
   *
   *
   * @description This is method that resets the User password
   * @param  {object} req The request object
   * @param  {object} res The response object
   * @returns {object} json response
   */
  static async reset(req, res) {
    const { email } = req.currentUser;
    try {
      const reset = await BaseRepository.find(User, { email });
      if (!reset) {
        return responseGenerator.sendError(
          res,
          401,
          `verification link not valid`
        );
      }
      await BaseRepository.update(
        User,
        {
          password: req.body.password
        },
        {
          email
        }
      );
      return responseGenerator.sendSuccess(
        res,
        200,
        null,
        'Password reset successful'
      );
    } catch (err) {
      return responseGenerator.sendError(res, 500, err.message);
    }
  }

  /**
   * @static
   * @param {object} req - express request object
   * @param {object} res - express response object
   * @returns {object}- returns information about the follow status of the requested user
   * @memberof UserController
   */
  static async followUser(req, res) {
    try {
      const { followeeId } = req.body;
      const { id: followerId } = req.currentUser;
      const details = { followeeId, followerId };
      const followedUser = await BaseRepository.findOrCreate(
        db.Follower,
        details
      );
      const [user, created] = followedUser;

      if (created) {
        await onFollowNotification(req, followeeId);

        return responseGenerator.sendSuccess(
          res,
          200,
          null,
          `You just followed the user with id = ${followeeId}`
        );
      }
      return responseGenerator.sendError(
        res,
        400,
        `You were already following the user with id = ${followeeId}`
      );
    } catch (err) {
      return responseGenerator.sendError(res, 500, err.message);
    }
  }

  /**
   * @static
   * @param {object} req - express request object
   * @param {object} res - express response object
   * @returns {object}- returns information about the follow status of the requested user
   * @memberof UserController
   */
  static async unfollowUser(req, res) {
    try {
      const { followeeId } = req.body;
      const { id: followerId } = req.currentUser;

      const details = {
        followerId,
        followeeId
      };

      const follower = await BaseRepository.findOneByField(
        db.Follower,
        details
      );
      if (!follower) {
        return responseGenerator.sendError(
          res,
          400,
          `You were not following this user`
        );
      }
      await BaseRepository.remove(db.Follower, details);
      return responseGenerator.sendSuccess(
        res,
        200,
        null,
        `You have succesfully unfollowed user with id =${followeeId}`
      );
    } catch (err) {
      return responseGenerator.sendError(res, 500, err.message);
    }
  }

  /**
   * @static
   * @param {object} req - express request object
   * @param {object} res - express response object
   * @returns {object}- returns information about the follow status of the requested user
   * @memberof UserController
   */
  static async getFollowers(req, res) {
    const { id: followeeId } = req.currentUser;

    const { page } = req.query;
    const paginate = new Pagination(page, req.query.limit);
    const { limit, offset } = paginate.getQueryMetadata();

    const {
      count,
      rows: followings
    } = await BaseRepository.findCountAndInclude({
      model: db.Follower,
      options: { followeeId },
      limit,
      offset,
      alias: 'followee',
      associatedModel: db.User,
      attributes: ['id', 'username', 'email']
    });
    if (count > 0) {
      return responseGenerator.sendSuccess(
        res,
        200,
        followings,
        null,
        paginate.getPageMetadata(count, '/api/v1/users')
      );
    }
    return responseGenerator.sendSuccess(
      res,
      200,
      followings,
      `You do not have any followers at the moment`
    );
  }

  /**
   * @static
   * @param {object} req - express request object
   * @param {object} res - express response object
   * @returns {object}- returns information about the follow status of the requested user
   * @memberof UserController
   */
  static async getFollowings(req, res) {
    const { id: followerId } = req.currentUser;

    const { page } = req.query;
    const paginate = new Pagination(page, req.query.limit);
    const { limit, offset } = paginate.getQueryMetadata();

    const {
      count,
      rows: followings
    } = await BaseRepository.findCountAndInclude({
      model: db.Follower,
      options: { followerId },
      limit,
      offset,
      alias: 'followee',
      associatedModel: db.User,
      attributes: ['id', 'username', 'email']
    });
    if (count > 0) {
      return responseGenerator.sendSuccess(
        res,
        200,
        followings,
        null,
        paginate.getPageMetadata(count, '/api/v1/users')
      );
    }
    return responseGenerator.sendSuccess(
      res,
      200,
      null,
      `You are not following anyone at the moment`
    );
  }

  /**
   * Get users and their corresponding profiles
   * @async
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {json} Returns json object
   * @static
   */
  static async listUsers(req, res) {
    try {
      const { page } = req.query;
      const paginate = new Pagination(page, req.query.limit);
      const { limit, offset } = paginate.getQueryMetadata();
      const { count, rows: users } = await BaseRepository.findAndCountAll(
        db.User,
        {
          limit,
          offset,
          attributes: ['id', 'username', 'email', 'avatar', 'role', 'status']
        }
      );
      return responseGenerator.sendSuccess(
        res,
        200,
        users,
        paginate.getPageMetadata(count, '/api/v1/users')
      );
    } catch (error) {
      return responseGenerator.sendError(res, 500, error.message);
    }
  }
}
export default UserController;
