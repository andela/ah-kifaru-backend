import Joi from 'joi';

const username = Joi.string()
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

const loginPassword = Joi.string()
  .required()
  .strict();

const descriptionRequired = Joi.string()
  .min(10)
  .required()
  .strict();

const descriptionNotRequired = Joi.optional().allow('');

const token = Joi.string().required();

const followeeId = Joi.number()
  .integer()
  .required();

const articleId = Joi.number().required();

const bookmarkArticle = {
  body: {
    articleId
  }
};

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
    password: loginPassword
  }
};
const resetPasswordSchema = {
  body: {
    password
  },
  params: {
    token
  }
};
const requestPasswordSchema = {
  body: {
    email
  }
};

const verifyTokenSchema = {
  params: {
    token
  }
};

const updateProfileSchema = {
  body: {
    avatar: Joi.string()
      .regex(/(\.jpg|\.jpeg|\.png|\.gif)$/i)
      .trim()
      .error(new Error('Avatar should be an Image')),
    bio: Joi.string().trim()
  }
};

const ratingSchema = {
  params: {
    articleId: Joi.number()
      .min(1)
      .required()
  },
  body: {
    ratings: Joi.number()
      .min(1)
      .max(5)
      .required()
      .error(new Error('ratings must be a number between 1 and 5'))
  }
};

const articleBodySchema = {
  body: {
    title: Joi.string()
      .trim()
      .min(3)
      .required()
      .error(
        new Error(
          'Please provide a title for your article with minimum of 3 characters'
        )
      ),
    description: Joi.required(),
    body: Joi.required(),
    image: Joi.required()
  }
};

const articleParamsSchema = {
  params: {
    articleId: Joi.number()
      .integer()
      .positive()
      .required()
      .error(
        new Error('Invalid Article ID. Article ID must be a positive integer')
      )
  }
};

const updateArticleSchema = {
  params: {
    articleId: Joi.number()
      .integer()
      .positive()
      .required()
      .error(
        new Error('Invalid Article ID. Article ID must be a positive integer')
      )
  },
  body: {
    title: Joi.string()
      .trim()
      .min(3)
      .required()
      .error(
        new Error(
          'Please provide a title for your article with minimum of 3 characters'
        )
      ),

    description: Joi.required(),
    body: Joi.required(),
    image: Joi.required()
  }
};

const reportArticle = {
  params: {
    articleId: Joi.number()
      .integer()
      .positive()
      .required()
      .error(
        new Error('Invalid Article ID. Article ID must be a positive integer')
      )
  },
  body: {
    violation: Joi.string()
      .required()
      .valid(
        'Discrimination',
        'Sexual Content',
        'Offensive Language',
        'Plagiarism',
        'Others'
      )
      .strict()
      .lowercase(),
    description: Joi.alternatives().when('violation', {
      is: 'Others',
      then: descriptionRequired,
      otherwise: descriptionNotRequired
    })
  }
};

const publishedArticle = {
  query: {
    articleId: Joi.number().error(
      new Error(
        'Invalid article id. Article id must be a non-zero positive integer'
      )
    )
  },
  body: {
    title: Joi.string()
      .min(3)
      .required()
      .trim()
      .error(new Error('Title is required')),
    body: Joi.string()
      .min(3)
      .required()
      .trim()
      .error(new Error('A body is required. . .')),
    image: Joi.string()
      .uri()
      .required()
      .trim()
      .error(new Error('Invalid image url')),
    description: Joi.string()
      .min(3)
      .required()
      .trim()
      .error(new Error('Enter a brief description for the article')),
    tag: Joi.string()
      .min(2)
      .error(new Error('Tag must be provided and should contain only letters'))
  }
};

const createTag = {
  body: {
    tag: Joi.string()
      .min(2)
      .required()
      .error(new Error('Tag must be provided and should contain only letters'))
  }
};

const deleteTag = {
  params: {
    id: Joi.number()
      .min(1)
      .required()
      .error(
        new Error('Invalid tag id. Tag id must be a non-zero positive integer')
      )
  }
};

const notificationSchema = {
  params: {
    notificationId: Joi.number()
      .min(1)
      .required()
  }
};

const emailNotification = {
  body: {
    emailNotify: Joi.boolean()
      .required()
      .error(new Error('emailNotify should be set to either true or false'))
  }
};

export default [
  {
    route: '/signup',
    method: 'post',
    schema: createAccountSchema
  },
  {
    route: '/login',
    method: 'post',
    schema: loginSchema
  },
  {
    route: '/reset-password',
    method: 'post',
    schema: requestPasswordSchema
  },
  {
    route: '/reset-password/:token',
    method: 'put',
    schema: resetPasswordSchema
  },
  {
    route: '/verify/:token',
    method: 'patch',
    schema: verifyTokenSchema
  },
  {
    route: '/follow',
    method: 'patch',
    schema: followOrUnfollow
  },
  {
    route: '/unfollow',
    method: 'patch',
    schema: followOrUnfollow
  },
  {
    route: '/user/:id',
    method: 'patch',
    schema: updateProfileSchema
  },
  {
    route: '/bookmark',
    method: 'patch',
    schema: bookmarkArticle
  },
  {
    route: '/unbookmark',
    method: 'patch',
    schema: bookmarkArticle
  },
  {
    route: '/:articleId/ratings',
    method: 'patch',
    schema: ratingSchema
  },
  {
    route: '/',
    method: 'post',
    schema: articleBodySchema
  },
  {
    route: '/:articleId',
    method: 'get',
    schema: articleParamsSchema
  },
  {
    route: '/:articleId',
    method: 'put',
    schema: updateArticleSchema
  },
  {
    route: '/:articleId',
    method: 'delete',
    schema: articleParamsSchema
  },
  {
    route: '/publish',
    method: 'put',
    schema: publishedArticle
  },
  {
    route: '/:notificationId',
    method: 'patch',
    schema: notificationSchema
  },
  {
    route: '/opt',
    method: 'patch',
    schema: emailNotification
  },
  {
    route: '/create',
    method: 'put',
    schema: createTag
  },
  {
    route: '/:id/delete',
    method: 'delete',
    schema: deleteTag
  },
  {
    route: '/:articleId',
    method: 'get',
    schema: articleParamsSchema
  },
  {
    route: '/:articleId',
    method: 'put',
    schema: updateArticleSchema
  },
  {
    route: '/:articleId',
    method: 'delete',
    schema: articleParamsSchema
  },
  { route: '/:articleId/report', method: 'post', schema: reportArticle }
];
