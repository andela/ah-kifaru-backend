module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    avatar: DataTypes.STRING,
    bio: DataTypes.STRING,
    password: DataTypes.STRING,
    resetPasswordToken: DataTypes.STRING,
    expirationTime: DataTypes.DATE,
    role: {
      type: DataTypes.ENUM,
      values: ['USER', 'ADMIN', 'SUPERADMIN']
    },
    status: {
      type: DataTypes.ENUM,
      values: ['UNVERIFIED', 'ACTIVE', 'INACTIVE']
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
  });
  User.associate = models => {
    User.belongsToMany(models.User, {
      through: 'Followers',
      as: 'users',
      foreignKey: 'followerId'
    });
  };
  User.associate = models => {
    User.belongsToMany(models.User, {
      through: 'Followers',
      as: 'users',
      foreignKey: 'followeeId'
    });
  };
  return User;
};
