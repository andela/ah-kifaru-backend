// Mock this
import BaseRepository from '../repository/base.repository';
import responseGenerator from '../helpers/responseGenerator';
import db from '../database/models';

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
  static async followUser(req, res) {
    try {
      //  Please inform team to change the id of the decrypted user to id when been parsed with req object
      const { followeeId } = req.body;
      const followerId = parseInt(req.userInfo);
      const details = { followeeId, followerId };
      const followedUser = await BaseRepository.findOrCreate(
        db.Follower,
        details
      );
      const [user, created] = followedUser;
      const theFollowedUser = await user.get({ plain: true });
      console.log(theFollowedUser);

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
   * @param {object} req - express request object
   * @param {object} res - express response object
   * @returns {object}- return user's account information
   * @memberof UserController
   */
  static async unfollowUser(req, res) {
    try {
      const { id: unfollowerId, followeeId } = req.body;
      const details = { followeeId, followerId: unfollowerId };

      const followExist = await BaseRepository.findOneByField(db.Followers, {
        details
      });
      if (!followExist) {
        return responseGenerator.sendSuccess(
          res,
          200,
          null,
          `You were not following this user`
        );
      }
      await BaseRepository.remove(db.Followers, details);
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
