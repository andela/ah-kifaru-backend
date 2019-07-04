import Joi from 'joi';

export default {
  validateRatings(req, res, next) {
    const articleId = parseInt(req.params.articleId, 10);
    const rating = req.body;
    const schema = Joi.object().keys({
      articleId: Joi.number()
        .min(1)
        .required(),
      rating: Joi.number()
        .min(1)
        .required()
    });
    const { error, value } = Joi.validate({ articleId, rating }, schema);
    if (error) {
      const errs = error.details[0].message.replace(/['"]/g, '');
      process.stdout.write(error.message);
      return res.status(400).json({
        message: errs
      });
    }
    process.stdout.write(value);
    req.body = value;
    next();
  }
};
