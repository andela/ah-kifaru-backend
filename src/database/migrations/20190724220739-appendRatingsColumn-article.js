module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Articles', 'avgRating', {
      type: Sequelize.FLOAT
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Articles', 'avgRating');
  }
};
