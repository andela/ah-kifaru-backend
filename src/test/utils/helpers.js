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
  status: 'unverified'
});

export const createUser = async theUser => {
  const created = await BaseRepository.create(
    db.User,
    theUser || (await getUser())
  );
  const plain = await created.get({ plain: true });
  return plain;
};

export const generateArticle = async ({ authorId }) => ({
  title: faker.lorem.word(),
  body: faker.lorem.sentences(),
  image: faker.image.imageUrl(),
  publishedDate: null,
  authorId,
  slug: slug(
    `${faker.lorem.word()}-${crypto.randomBytes(12).toString('base64')}`
  ).toLowerCase(),
  description: faker.lorem.word(),
  status: 'active'
});

export const createArticle = async article => {
  const created = await BaseRepository.create(db.Article, article);
  const plain = await created.get({ plain: true });
  return plain;
};

export const followUser = async (firstId, secondId) => {
  await BaseRepository.create({
    followerId: secondId,
    followeeId: firstId
  });
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
  description: faker.lorem.sentence()
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
