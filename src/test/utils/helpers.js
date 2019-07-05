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
