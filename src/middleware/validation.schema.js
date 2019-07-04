import Joi from 'joi';

const followeeId = Joi.number()
  .integer()
  .required();

const id = Joi.number()
  .integer()
  .required();

const followOrUnfollow = {
  body: {
    followeeId
  }
};

// const

export default {
  '/follow': followOrUnfollow,
  '/unfollow': followOrUnfollow
};
