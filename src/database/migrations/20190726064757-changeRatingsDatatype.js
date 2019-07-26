module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      (queryInterface.removeColumn('Ratings', 'ratings'),
      queryInterface.sequelize.query('DROP TYPE "enum_Ratings_ratings";'),
      queryInterface.addColumn('Ratings', 'ratings', {
        type: Sequelize.INTEGER,
        validate: {
          isInt: true,
          isIn: [[1, 2, 3, 4, 5]],
          min: 0
        }
      }))
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Ratings', 'ratings'),
      queryInterface.addColumn('Ratings', 'ratings', {
        type: Sequelize.ENUM,
        values: [1, 2, 3, 4, 5],
        allowNull: false
      })
    ]);
  }
};
