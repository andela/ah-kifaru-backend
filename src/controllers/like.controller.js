import models from '../database/models/index';
import commentHelpers from '../helpers/commentHelpers';
import responseGenerator from '../helpers/responseGenerator';

const { CommentLike, Comments } = models;
const { liker } = commentHelpers;

const likeController = async (req, res) => {
  const { commentId: id } = req.params;
  const commentId = id;
  const isExist = await Comments.findByPk(id);
  if (!isExist) {
    return responseGenerator.sendError(
      res,
      400,
      'The specified comment id does not exist'
    );
  }
  const userId = req.currentUser.id;

  const likeData = { commentId, userId };
  return liker(CommentLike, res, likeData, 'Comment');
};

export default likeController;
