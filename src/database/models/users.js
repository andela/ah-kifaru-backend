module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'users',
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING
    },
    {}
  );
  Users.associate = models => {
    // associations can be defined here
    const { Ratings } = models;
    Users.hasMany(Ratings, {
      foreignKey: 'userId',
      as: 'rating'
    });
  };
  return Users;
};
