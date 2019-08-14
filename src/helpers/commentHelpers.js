import responseGenerator from './responseGenerator';

const commentHelpers = {
  liker: (model, res, likeData, type) => {
    model
      .findOrCreate({ where: likeData, defaults: { liked: true } })
      .spread((result, created) => {
        const { liked } = result.dataValues;
        // When user is liking for the first time
        if (created) {
          return responseGenerator.sendSuccess(res, 201, `${type} liked`);
        }

        // This block creates the toggle effect of liking and unliking
        return model.update({ liked: !liked }, { where: likeData }).then(() => {
          return responseGenerator.sendSuccess(
            res,
            200,
            `${type} ${liked ? 'reaction removed' : 'liked'}`
          );
        });
      })
      .catch(error => res.status(500).json(error.message));
  }
};

export default commentHelpers;
