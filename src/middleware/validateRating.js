import Joi from 'joi';
import jwt from 'jsonwebtoken';

export default {
  async validateRatings(req, res, next) {
    const payload = {
      id: 1,
      name: 'Joe',
      role: 'user'
    };
    const tokens = await jwt.sign(payload, 'secret', { expiresIn: '1h' });
    const token = await jwt.verify(tokens, 'secret');
    req.token = token;
    const articleId = parseInt(req.params.articleId, 10);
    const ratings = parseInt(req.params.rating, 10);
    const schema = Joi.object().keys({
      userId: Joi.number()
        .min(1)
        .required(),
      articleId: Joi.number()
        .min(1)
        .required(),
      ratings: Joi.number()
        .min(1)
        .max(5)
        .required()
    });
    const { error, value } = Joi.validate(
      { userId: req.token.id, articleId, ratings },
      schema
    );
    if (error) {
      const errs = error.details[0].message.replace(/['"]/g, '');
      return res.status(400).json({
        message: errs
      });
    }
    process.stdout.write(value);
    req.body = value;
    next();
  }
};
