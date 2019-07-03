module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Articles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING
      },
      body: {
        type: Sequelize.TEXT
      },
      image: {
        type: Sequelize.STRING
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false
      },
      publishedDate: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.ENUM('draft', 'active', 'deactivated'),
        defaultValue: 'draft'
      },
      authorId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date()
      }
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('Articles');
  }
};
