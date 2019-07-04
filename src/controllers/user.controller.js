import BaseRepository from '../repository/base.repository';
import responseGenerator from '../helpers/responseGenerator';
import utility from '../helpers/utils';

import db from '../database/models';

const { hashPassword, jwtSigner, verifyPassword } = utility;

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
          // TODO : SEND EMAIL TO USER
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

      // create user
      const encryptPassword = hashPassword(password);

      const createdUser = await BaseRepository.create(db.User, {
        username,
        email,
        password: encryptPassword
      });

      const { id, role, status } = createdUser;

      const token = jwtSigner({
        id,
        username,
        email,
        role
      });

      // TODO : SEND EMAIL TO USER

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
            // TODO : SEND EMAIL TO USER
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
    const { email } = req.token;

    try {
      const user = await BaseRepository.findOneByField(db.User, { email });

      if (user && user.status !== 'active') {
        const updatedUser = await BaseRepository.update(
          db.User,
          { status: 'active' },
          { email }
        );

        if (updatedUser > 0) {
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
      return responseGenerator.sendError(res, 500, error.message);
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
      //  Please inform team to change the id of the decrypted user to id when been parsed with req object
      const { followeeId } = req.body;
      const { id: followerId } = req.token;
      const details = { followeeId, followerId };
      const followedUser = await BaseRepository.findOrCreate(
        db.Follower,
        details
      );
      const [user, created] = followedUser;

      if (created) {
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
      const { id: followerId } = req.token;

      const details = {
        followerId,
        followeeId
      };

      const followExist = await BaseRepository.findOneByField(
        db.Follower,
        details
      );
      if (!followExist) {
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
}

export default UserController;
