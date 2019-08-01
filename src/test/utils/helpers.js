import faker from 'faker';
import slug from 'slug';
import crypto from 'crypto';
import db from '../../database/models';
import BaseRepository from '../../repository/base.repository';

export const getUser = async () => ({
  username: faker.internet.userName().toLowerCase(),
  email: faker.internet.email().toLowerCase(),
  avatar: faker.image.imageUrl().toLowerCase(),
  password: faker.internet.password().toLowerCase(),
  role: 'user',
  status: 'unverified',
  emailNotify: false
});

export const createUser = async theUser => {
  const created = await BaseRepository.create(
    db.User,
    theUser || (await getUser())
  );
  const plain = await created.get({ plain: true });
  return plain;
};
export const generateUser = async ({ username }) => ({
  username,
  email: faker.internet.email().toLowerCase(),
  avatar: faker.image.imageUrl().toLowerCase(),
  password: faker.internet.password().toLowerCase(),
  role: 'user',
  status: 'unverified'
});

export const generateArticle = async ({ authorId, publishedDate = null }) => ({
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

export const generateReport = async ({
  reporterId,
  articleId,
  violation,
  description = faker.lorem.word()
}) => ({
  reporterId,
  articleId,
  description,
  violation
});

export const reportArticle = async (articleId, report) => {
  const created = await BaseRepository.findOrCreate(
    db.Report,
    { articleId },
    report
  );
  return created;
};

export const createArticle2 = async article => {
  const created = await BaseRepository.findOrCreate(
    db.Article,
    { id: article.id },
    article
  );
  return created;
};

export const createArticle = async article => {
  const created = await BaseRepository.create(db.Article, article);
  const plain = await created.get({ plain: true });
  return plain;
};

export const followUser = async (firstId, secondId) => {
  await BaseRepository.create(db.Follower, {
    followerId: secondId,
    followeeId: firstId
  });
};

export const rateArticle = async ({ articleId, userId, ratings }) => {
  await BaseRepository.create(db.Rating, { articleId, userId, ratings });
};

export const ratings = {
  ratings: faker.random.number({
    min: 1,
    max: 5
  })
};

export const article = {
  title: faker.lorem.sentence(),
  body: faker.lorem.paragraphs(),
  image: faker.image.imageUrl(),
  description: faker.lorem.sentence(),
  tag: 'javascript java ruby'
};

export const articleWithShortTitle = {
  title: 'ak',
  body: faker.lorem.paragraphs(),
  image: 'https://stackoverflow.com',
  description: faker.lorem.sentence()
};

export const articleWithShortBody = {
  title: faker.lorem.sentence(),
  body: 'ak',
  image: faker.image.imageUrl(),
  description: faker.lorem.sentence()
};

export const articleWithShortImage = {
  title: faker.lorem.sentence(),
  body: faker.lorem.paragraphs(),
  image: 'ak',
  description: faker.lorem.sentence()
};

export const articleWithShortDescription = {
  title: faker.lorem.sentence(),
  body: faker.lorem.paragraphs(),
  image: faker.image.imageUrl(),
  description: 'ak'
};
export const createTag = async theTag => {
  const created = await BaseRepository.create(db.Tags, theTag);
  const plain = await created.get({ plain: true });
  return plain;
};

export const createArticleTag = async theArticleTag => {
  const created = await BaseRepository.create(db.ArticleTags, theArticleTag);
  const plain = await created.get({ plain: true });
  return plain;
};

export const addNotification = async (receiverId, read, payload) => {
  const notification = {
    payload: payload || {},
    read,
    receiverId
  };

  const createNotification = await BaseRepository.create(
    db.Notification,
    notification
  );
  return createNotification;
};

export const newNotification = {
  receiverId: 1,
  payload: {}
};
