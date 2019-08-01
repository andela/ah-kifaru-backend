module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Reports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reporterId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'SET NULL',
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId'
        }
      },
      articleId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'SET NULL',
        references: {
          model: 'Articles',
          key: 'id',
          as: 'articleId'
        }
      },
      violation: {
        allowNull: false,
        type: Sequelize.ENUM(
          'Discrimination',
          'Plagiarism',
          'Sexual Content',
          'Others',
          'Offensive Language'
        )
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING
      },
      resolved: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    }),
  down: queryInterface => queryInterface.dropTable('Reports')
};
