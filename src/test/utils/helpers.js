import faker from 'faker';
import User from '../../database/models';
import BaseRepository from '../../repository/base.repository';

export const createUser = newUser => BaseRepository.create(User, newUser);

export const getUser = () => ({
  username: faker.internet.userName(),
  email: faker.internet.email(),
  avatar: faker.image.imageUrl(),
  passowrd: faker.internet.password(),
  role: 'user',
  active: 'verified'
});
