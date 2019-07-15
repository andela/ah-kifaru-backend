import faker from 'faker';
import db from '../../database/models';
import BaseRepository from '../../repository/base.repository';

export const getUser = async () => ({
  username: faker.internet.userName(),
  email: faker.internet.email(),
  avatar: faker.image.imageUrl(),
  password: faker.internet.password(),
  role: 'user',
  active: 'verified'
});

export const createUser = async theUser => {
  const created = await BaseRepository.create(
    db.User,
    theUser || (await getUser())
  );
  const plain = await created.get({ plain: true });
  return plain;
};

export const generateArticle = async ({ authorId = 1 } = {}) => ({
  title: faker.lorem.word(),
  body: faker.lorem.words(),
  image: faker.image.imageUrl(),
  publishedDate: new Date(),
  authorId,
  slug: faker.lorem.slug(),
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
