module.exports = (sequelize, DataTypes) => {
  const Follower = sequelize.define(
    'Follower',
    {
      followerId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },

      followeeId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
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
  Follower.associate = (/* models */) => {
    // associations can be defined here
  };
  return Follower;
};
