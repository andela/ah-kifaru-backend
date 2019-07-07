module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'ratings',
      [
        {
          articleId: 1,
          ratings: '5'
        },
        {
          articleId: 1,
          ratings: '3'
        },
        {
          articleId: 1,
          ratings: '1'
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ratings', null, {});
  }
};
