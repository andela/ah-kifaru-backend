import faker from 'faker';
import slug from 'slug';
import crypto from 'crypto';
import db from '../models';
import BaseRepository from '../../repository/base.repository';

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
const getFakeArticle = async ({ authorId, publishedDate = null }) => ({
  title: faker.lorem.word(),
  body: faker.lorem.sentences(),
  image: faker.image.imageUrl(),
  publishedDate,
  authorId,
  slug: slug(
    `${faker.lorem.word()}-${crypto.randomBytes(12).toString('base64')}`
  ).toLowerCase(),
  description: faker.lorem.word(),
  status: 'active'
});

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
