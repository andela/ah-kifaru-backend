module.exports = (sequelize, DataTypes) => {
  const Tags = sequelize.define(
    'Tags',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true
        }
      }
    },
    {}
  );
  Tags.associate = models => {
    Tags.belongsToMany(models.Article, {
      through: 'ArticleTags',
      as: 'Articles',
      foreignKey: 'tagId'
    });
  };
  return Tags;
};
