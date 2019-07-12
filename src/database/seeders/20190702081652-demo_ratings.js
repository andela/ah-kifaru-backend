module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Ratings',
      [
        {
          articleId: 1,
          ratings: '5',
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          articleId: 1,
          ratings: '3',
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          articleId: 1,
          ratings: '1',
          userId: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Ratings', null, {});
  }
};
