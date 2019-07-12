import Joi from 'joi';

const username = Joi.string()
  .regex(/^\D+$/)
  .lowercase()
  .required();

const email = Joi.string()
  .email()
  .lowercase()
  .required();

const password = Joi.string()
  .min(8)
  .required()
  .strict();

const articleId = Joi.number()
  .min(1)
  .required();
const ratings = Joi.number()
  .min(1)
  .max(5)
  .required();
const token = Joi.string().required();

const followeeId = Joi.number()
  .integer()
  .required();

const followOrUnfollow = {
  body: {
    followeeId
  }
};

const createAccountSchema = {
  body: {
    username,
    email,
    password
  }
};

const loginSchema = {
  body: {
    email,
    password
  }
};

const verifyTokenSchema = {
  params: {
    token
  }
};

const ratingSchema = {
  params: {
    id: Joi.number()
      .min(1)
      .required()
  },
  body: {
    ratings: Joi.number()
      .min(1)
      .max(5)
      .required()
  }
};

export default {
  '/signup': createAccountSchema,
  '/login': loginSchema,
  '/verify/:token': verifyTokenSchema,
  '/follow': followOrUnfollow,
  '/unfollow': followOrUnfollow,
  '/:id/ratings': ratingSchema
};
