export default (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    reporterId: {
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
        'Others',
        'Offensive Language'
      ),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resolved: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  });

  Report.associate = models => {
    Report.belongsTo(models.User, {
      foreignKey: 'reporterId',
      onDelete: 'SET NULL'
    });

    Report.belongsTo(models.Article, {
      foreignKey: 'articleId',
      onDelete: 'SET NULL'
    });
  };

  return Report;
};
