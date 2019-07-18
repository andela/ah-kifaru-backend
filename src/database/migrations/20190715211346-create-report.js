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
<<<<<<< HEAD
          as: 'userId'
=======
          as: 'reporterId'
>>>>>>> reportArticle(): create article report
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
<<<<<<< HEAD
          'Others',
=======
>>>>>>> reportArticle(): create article report
          'Offensive Language'
        )
      },
      description: {
<<<<<<< HEAD
        allowNull: true,
=======
        allowNull: false,
>>>>>>> reportArticle(): create article report
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
