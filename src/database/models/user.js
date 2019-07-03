module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    bio: DataTypes.STRING,
    avatar: DataTypes.STRING,
    password: DataTypes.TEXT,
    resetPassword: DataTypes.TEXT,
    expirationDate: DataTypes.DATE,
    role: DataTypes.ENUM('user', 'admin', 'superAdmin'),
    googleID: DataTypes.INTEGER
  });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
