import faker from 'faker';
import slug from 'slug';
import crypto from 'crypto';
import db from '../models';
import BaseRepository from '../../repository/base.repository';

const body = JSON.stringify({
  time: 1550476186479,
  blocks: [
    {
      type: 'header',
      data: {
        text: 'Let’ s Get Started',
        level: 2
      }
    },
    {
      type: 'paragraph',
      data: {
        text:
          'How do we test asynchronous actions? The ones that depends on a API call that may or may not be resolved. This is what we are going to focus here: how to make sure your actions are called in order and how to intercept axios to not make actual API calls.'
      }
    },
    {
      type: 'paragraph',
      data: {
        text: 'Just to be clear this is what we are going to be using:'
      }
    },
    {
      type: 'list',
      data: {
        style: 'unordered',
        items: [
          'Jest as a test framework;',
          'Moxios to mock API calls made by Axios',
          'redux-mock-store to mock our store',
          'Enzyme for testing utilities',
          'Redux Thunk for dispatching async actions',
          'Enzyme for testing utilities'
        ]
      }
    },
    {
      type: 'paragraph',
      data: {
        text:
          'Let’s begin talking about our stack. Moxios is a testing utility created by Axios with the intent to mock our calls, so we don’t hit the server every time we run our tests. If you look at the documentation you will see that it works by intercepting the calls when they are made and mocking the response. Later we will see what are the necessary configurations for that!'
      }
    },
    {
      type: 'paragraph',
      data: {
        text:
          'Redux-mock-store is exactly what the name implies. Although it should not be used to mock an actual store to use in a Provider (to test connected components, see this and this). The goal of the library is to test actions and middlewares. The mocked store stores (no pun intended) the actions called in an array for you to compare to what you expect it to be.'
      }
    },
    {
      type: 'paragraph',
      data: {
        text: 'So let’s get to it!'
      }
    },
    {
      type: 'paragraph',
      data: {
        text:
          'First things first, this is the action we are going to test: loginUser. It accepts userData as a parameter which returns a dispatch function (thunk) which returns the axios call. This is important: to return the axios call(a promise), we will see why later.'
      }
    },
    {
      type: 'image',
      data: {
        file: {
          url:
            'https://miro.medium.com/fit/c/12000/8000/1*wQrhSP0wBTxQ8kl6cr1SFw@2x.jpeg',
          caption: 'redux thunk'
        }
      }
    },
    {
      type: 'paragraph',
      data: {
        text:
          'The step by step is commented in the code, but basically the action hits an API which returns an JWT Token (more about that here), that we store it locally. The token is set to every call header that axios make for now on, so we have authorized credentials. Then we decode the token using jwt_decodeand dispatch the setCurrentUser action, that makes our user authenticated to our app. If any exceptions happen, we catch it and send a getErrors action. If the double arrow function confuses you check this.'
      }
    },
    {
      type: 'paragraph',
      data: {
        text:
          'If you haven’t done it yet, install every module necessary using npm or yarn: axios, moxios, redux-mock-store, redux-thunk'
      }
    },
    {
      type: 'header',
      data: {
        text: 'Now let’ s get testing!',
        level: 2
      }
    },
    {
      type: 'paragraph',
      data: {
        text:
          'First we will need to configure our mockStore.A good idea is to create a Utils file(or helpers, or common, hard to decide…) to put your store configuration,so you don’ t need to create it in every test file you make.'
      }
    },
    {
      type: 'image',
      data: {
        file: {
          url:
            'https://images.unsplash.com/photo-1535551951406-a19828b0a76b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1946&q=80'
        },
        caption: 'image of my setup'
      }
    },
    {
      type: 'paragraph',
      data: {
        text:
          'To make moxios work,you need to add the beforeEach and afterEachfunctions installing and unistalling for each test suite.Inside the test, you should declare the payload to send to your action( in this case it’ s a user object) and specify what’ s the response you expect from the API call.This is what moxios.wait() does: it waits for the API call your action sends, intercept it and mock the response with the passed information.'
      }
    },
    {
      type: 'paragraph',
      data: {
        text:
          'You can see more about the redux - mock - store API in their github page,where maybe you’ ll think about cleaning all your actions after each test with store.clearActions(), or check your mock store state with store.getState().'
      }
    },
    {
      type: 'code',
      data: {
        code:
          'const { PASSWORD_RESET_PENDING,PASSWORD_RESET_SUCCESS,PASSWORD_RESET_FAILED}= actionTypes;\t\tconst initialState = {isPending: false,isSuccess: false,error: null,message: null};\n\nconst authTypes = [PASSWORD_RESET_PENDING,PASSWORD_RESET_SUCCESS,PASSWORD_RESET_FAILED];\n\nconst resetPassword = (state = initialState, { type, payload }) => {\n\n\treturn authTypes.includes(type) ? { ...state, ...payload } : state;};'
      }
    },
    {
      type: 'paragraph',
      data: {
        text:
          'You can see more about the redux - mock - store API in their github page,where maybe you’ ll think about cleaning all your actions after each test with store.clearActions(), or check your mock store state with store.getState().'
      }
    },
    {
      type: 'paragraph',
      data: {
        text:
          'To make moxios work,you need to add the beforeEach and afterEachfunctions installing and unistalling for each test suite.Inside the test, you should declare the payload to send to your action( in this case it’ s a user object) and specify what’ s the response you expect from the API call.This is what moxios.wait() does: it waits for the API call your action sends, intercept it and mock the response with the passed information.'
      }
    },
    {
      type: 'paragraph',
      data: {
        text: 'Thanks for reading🙌🙌🌟🤝'
      }
    }
  ],
  version: '2.8.1'
});

const image = [
  'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1966&q=80',
  'https://images.unsplash.com/photo-1517148815978-75f6acaaf32c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1526925539332-aa3b66e35444?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1001&q=80',
  'https://images.unsplash.com/photo-1488229297570-58520851e868?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2849&q=80',
  'https://images.unsplash.com/photo-1520085601670-ee14aa5fa3e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
];
const title = [
  'Customizing environment variables in React',
  'Stop Making Everything Perfect for Your Kid',
  'You’/re Not Lazy, Bored, or Unmotivated',
  'Tech vs. Media: Which TV Streaming Strategy Is Better?'
];
const description = [
  'Rich Greenfield, a veteran media analyst, noted that the release strategy of current and forthcoming streaming platforms seems to be split',
  'Rich Greenfield, a veteran media analyst, noted that the release strategy of current and forthcoming streaming platforms seems to be split.',
  'Rich Greenfield, a veteran media analyst, noted that the release strategy of current and forthcoming squarely ac',
  'Noted that the release strategy of current and forthcoming streaming platforms seems to be split squarely'
];

// USERS
const getFakeUser = async email => ({
  username: faker.internet.userName().toLowerCase(),
  email,
  avatar: faker.image.imageUrl().toLowerCase(),
  password: 'password',
  role: 'user',
  status: 'unverified'
});

const createUser = async email => {
  const created = await BaseRepository.create(
    db.User,
    await getFakeUser(email)
  );
  const plain = await created.get({ plain: true });
  return plain;
};

// ARTICLES
const getFakeArticle = async ({ authorId, publishedDate = null }) => {
  const randomNumber = Math.floor(Math.random() * 4);
  return {
    title: title[randomNumber],
    body,
    image: image[randomNumber],
    publishedDate,
    authorId,
    slug: slug(
      `${faker.lorem.word()}-${crypto.randomBytes(12).toString('base64')}`
    ).toLowerCase(),
    description: description[randomNumber],
    status: 'active'
  };
};

const createArticle = async article => {
  const created = await BaseRepository.create(db.Article, article);
  const plain = await created.get({ plain: true });
  return plain;
};

// BOOKMARK
const bookmarkArticle = async (articleId, userId) => {
  await BaseRepository.create(db.Bookmark, {
    userId,
    articleId
  });
};

// FOLLOW
const followUser = async (firstId, secondId) => {
  await BaseRepository.create(db.Follower, {
    followeeId: firstId,
    followerId: secondId
  });
};

// CREATE ARTICLE TAGS
const createTag = async tags => {
  if (tags.length > 0) {
    const lowerTags = Array.from(tags.map(tag => tag.toLowerCase()));
    const createTheTags = [];

    for (let i = 0; i < tags.length; i++) {
      const tag = await BaseRepository.findOrCreate(
        db.Tags,
        { name: lowerTags[i] },
        { name: lowerTags[i] }
      );
      const [theTag, created] = tag;
      const plainTag = await theTag.get({ plain: true });
      createTheTags.push(plainTag);
    }

    const tagIds = createTheTags.map(tag => tag.id);
    return tagIds;
  }
};

const createArticleTag = async (articleId, tagId) => {
  await BaseRepository.create(db.ArticleTags, { articleId, tagId });
};

// RATE AN ARTICLE
const rateArticle = async (articleId, userId, ratings) => {
  await BaseRepository.create(db.Rating, { articleId, userId, ratings });
};

// NOTIFICATION
const createInAppNotification = async ({ receiverId, payload }) => {
  return BaseRepository.create(db.Notification, {
    receiverId,
    payload
  });
};

// SEED DATABASE

/**
 * This is a function.
 *
 * @return {object} returns a seeded database
 *
 * @example
 *
 *     seed()
 */
async function seed() {
  const previousUsers = [];
  const previousArticles = [];

  for (let i = 0; i < 10; i++) {
    const user = await createUser(`user${i}@email.com`);

    const article = await createArticle(
      await getFakeArticle({ authorId: user.id })
    );

    // create one more article
    await createArticle(await getFakeArticle({ authorId: user.id }));

    // tag articles
    const tags = await createTag([faker.lorem.word(), faker.lorem.word()]);

    if (tags.length > 0) {
      tags.forEach(async tag => {
        await createArticleTag(article.id, tag);
      });
    }

    if (previousArticles.length > 0) {
      previousArticles.forEach(async theArticle => {
        const articleId = theArticle.id;
        // bookmark the article
        await bookmarkArticle(articleId, user.id);

        // rate the article
        await rateArticle(
          articleId,
          user.id,
          faker.random.number({ min: 1, max: 5 })
        );

        // receive publication notifcation
        const payload = {
          author: theArticle.authorName,
          title: theArticle.title,
          slug: theArticle.slug,
          type: 'new_article'
        };

        await createInAppNotification({ receiverId: user.id, payload });
      });
    }

    // follow other users
    if (previousUsers.length > 0) {
      previousUsers.forEach(async userId => {
        await followUser(userId, user.id);

        // Send Inapp follow notification
        const payload = {
          follower: user.id,
          type: 'new_follower'
        };
        await createInAppNotification({ receiverId: userId, payload });
      });
    }

    previousUsers.push(user.id);
    const authorName = user.username;
    previousArticles.push({ ...article, authorName });
  }

  await createUser(`superadmin@email.com`);
  await createUser(`admin@email.com`);
  await createUser(`superadmin1@email.com`);
}

seed()
  .then(() => {
    process.stdout.write(`Database seeded successfully`);
    process.exit(0);
  })
  .catch(err => {
    process.stdout.write(`seed unsuccessfull >>>>> ${err}`);
  });
