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
        values: ['1', '2', '3', '4', '5'],
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
    // associations can be defined here
    // const { User } = models;
    // Ratings.belongsTo(User, {
    //   foriegnKey: 'userId',
    //   as: 'rater'
    // });
  };
  return Ratings;
};
