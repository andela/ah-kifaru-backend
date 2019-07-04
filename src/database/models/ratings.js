module.exports = (sequelize, DataTypes) => {
  const Ratings = sequelize.define(
    'ratings',
    {
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ratings: {
        type: DataTypes.ENUM(1, 2, 3, 4, 5),
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  Ratings.associate = models => {
    // associations can be defined here
    const { Users } = models;
    Ratings.belongsTo(Users, {
      foriegnKey: 'userId',
      as: 'rater'
    });
  };
  return Ratings;
};
