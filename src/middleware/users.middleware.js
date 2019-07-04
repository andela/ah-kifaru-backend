import BaseRepository from '../repository/base.repository';
import db from '../database/models';
import responseGenerator from '../helpers/responseGenerator';

export const userExist = async (req, res, next) => {
  const { followeeId } = req.body;

  const theUser = await BaseRepository.findOneByField(db.User, {
    id: followeeId
  });
  if (!theUser) {
    return responseGenerator.sendError(
      res,
      400,
      `There is no user with id = ${followeeId}`
    );
  }
  next();
};

export const isSelf = async (req, res, next) => {
  const { followeeId } = req.body;
  const { id: followerId } = req.token;
  if (followeeId === followerId) {
    return responseGenerator.sendError(
      res,
      400,
      `You cannot follow or unfollow yourself`
    );
  }
  next();
};

export default { userExist, isSelf };
