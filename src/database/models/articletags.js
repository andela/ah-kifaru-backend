module.exports = (sequelize, DataTypes) => {
  const ArticleTags = sequelize.define(
    'ArticleTags',
    {
      articleId: DataTypes.INTEGER,
      tagId: DataTypes.INTEGER
    },
    {}
  );
  ArticleTags.associate = models => {
    ArticleTags.belongsTo(models.Tags, {
      foreignKey: 'tagId',
      as: 'tag',
      onDelete: 'CASCADE'
    });
  };
  ArticleTags.associate = models => {
    ArticleTags.belongsTo(models.Article, {
      foreignKey: 'articleId',
      as: 'article'
    });
  };
  return ArticleTags;
};
