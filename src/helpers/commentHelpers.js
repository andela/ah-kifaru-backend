import responseGerator from './responseGenerator';

const commentHelpers = {
  updater: async (res, model, reqData, type) => {
    const contentId = reqData.commentId;
    const { content } = reqData;

    try {
      const comment = await model.findOne({ where: { id: contentId } });

      if (content === comment.dataValues.content) {
        return responseGerator.sendSuccess(
          res,
          200,
          comment.dataValues.content,
          `${type} is the same, no change was effected`
        );
      }

      await model.update(
        { content, edited: true },
        { where: { id: contentId } }
      );
      return responseGerator.sendSuccess(
        res,
        200,
        comment.dataValues.content
        `${type} updated`
      );
    } catch (error) {
      return responseGerator.sendError(
        res,
        500,
        'There was a problem processing your request'
      );
    }
  }
};

export default commentHelpers;