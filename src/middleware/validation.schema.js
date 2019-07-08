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

const verifyTokenSchema = {
  params: {
    token
  }
};

export default {
  '/signup': createAccountSchema,
  '/login': loginSchema,
  '/verify/:token': verifyTokenSchema
};
