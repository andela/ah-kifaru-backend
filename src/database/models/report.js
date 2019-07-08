const Report = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    violation: {
      type: DataTypes.ENUM(
        'Discrimination',
        'Plagiarism',
        'Sexual Content',
        'Offensive Language'
      ),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    resolved: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  });

  // Report.associate = (models) => {
  //   Report.belongsTo(models.Users, {
  //     foreignKey: 'userId',
  //     onDelete: 'SET NULL'
  //   });

  //   Report.belongsTo(models.Articles, {
  //     foreignKey: 'articleId',
  //     onDelete: 'SET NULL'
  //   });
  // };

  return Report;
};

export default Report;
