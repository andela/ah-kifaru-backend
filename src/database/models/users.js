import bcrypt from 'bcrypt';

const users = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    firstname: {
      type: DataTypes.STRING
    },
    lastname: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bio: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.STRING
    },
    premium: {
      type: DataTypes.BOOLEAN
    },
    isVerified: {
      type: DataTypes.BOOLEAN
    },
    interests: {
      type: DataTypes.ARRAY(DataTypes.TEXT)
    },
    roleId: {
      type: DataTypes.INTEGER,
      defaultValue: 2
    }
  });

  Users.associate = models => {};

  Users.checkPassword = (password, user) => bcrypt.compareSync(password, user);
  return Users;
};

export default users;
