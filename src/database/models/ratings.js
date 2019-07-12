module.exports = (sequelize, DataTypes) => {
  const Ratings = sequelize.define(
    'Ratings',
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
      },
      createdAt: {
        allowNull: false,
        defaultValue: new Date(),
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        defaultValue: new Date(),
        type: DataTypes.DATE
      }
    },
    {}
  );
  Ratings.associate = models => {
    Ratings.belongsTo(models.User, {
      as: 'rater',
      foreignKey: 'userId'
    });
    Ratings.belongsTo(models.Article, {
      as: 'rating',
      foreignKey: 'articleId'
    });
  };
  return Ratings;
};
