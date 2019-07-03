const bcrypt = require('bcrypt');

module.exports = {
  up: (queryInterface /* , Sequelize */) =>
    queryInterface.bulkInsert('Users', [
      {
        username: 'JonSnow',
        email: 'jonsnow@got.com',
        avatar: '/img/profile.png',
        bio: 'Quick Intro',
        password: bcrypt.hashSync('password', 15),
        role: 'superAdmin',
        status: 'active'
      },
      {
        username: 'TimiTejumola',
        email: 'timitejumola@andela.com',
        avatar: '/img/profile.png',
        bio: 'Quick Intro',
        password: bcrypt.hashSync('password', 15),
        role: 'user',
        status: 'active'
      },
      {
        username: 'Shola Bola',
        email: 'sholabola@gmail.com',
        avatar: '/img/profile.png',
        bio: 'Quick Intro',
        password: bcrypt.hashSync('password', 15),
        role: 'user',
        status: 'unverified'
      }
    ]),

  down: (queryInterface /* ,  Sequelize */) =>
    queryInterface.bulkDelete('Users', null, {})
};
