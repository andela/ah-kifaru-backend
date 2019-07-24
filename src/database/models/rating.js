export default (sequelize, DataTypes) => {
  const Rating = sequelize.define(
    'Rating',
    {
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ratings: {
        type: DataTypes.ENUM,
        values: [1, 2, 3, 4, 5],
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  Rating.associate = models => {
    Rating.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId'
    });
  };

  Rating.associate = models => {
    Rating.belongsTo(models.Article, {
      as: 'article',
      foreignKey: 'articleId'
    });
  };
  return Rating;
};
