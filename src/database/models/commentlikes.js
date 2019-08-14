const commentLike = (sequelize, DataTypes) => {
  const CommentLike = sequelize.define(
    'CommentLike',
    {
      commentId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      liked: {
        type: DataTypes.BOOLEAN,
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
    {
      freezeTableName: true
    }
  );

  CommentLike.associate = models => {
    CommentLike.belongsTo(models.Comments, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE',
      as: 'likes'
    });

    CommentLike.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return CommentLike;
};

export default commentLike;
