import faker from 'faker';
import jwt from 'jsonwebtoken';
import db from '../../database/models';
import BaseRepository from '../../repository/base.repository';

export const createUser = async newUser => {
  const created = await BaseRepository.create(db.User, newUser);
  const plain = await created.get({ plain: true });
  return plain;
};

export const getUser = async () => ({
  username: faker.internet.userName(),
  email: faker.internet.email(),
  avatar: faker.image.imageUrl(),
  password: faker.internet.password(),
  role: 'user',
  active: 'verified'
});

export const jwtSigner = async payload => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// export const createUser = async (model, options) => {
//   return model.create(options);
// };
