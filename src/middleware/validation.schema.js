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

const userId = Joi.number()
  .min(1)
  .required();

const articleId = Joi.number()
  .min(1)
  .required();

const ratings = Joi.number()
  .min(1)
  .max(5)
  .required();

const token = Joi.string().required();

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

const verifySchema = {
  params: {
    token
  }
};

const rateArticles = {
  params: {
    userId,
    articleId,
    ratings
  }
};

export default {
  '/signup': createAccountSchema,
  '/login': loginSchema,
  '/verify/:token': verifySchema,
  '/articles/:articleId/:ratings': rateArticles
};
