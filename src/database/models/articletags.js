module.exports = (sequelize, DataTypes) => {
  const ArticleTags = sequelize.define(
    'ArticleTags',
    {
      articleId: DataTypes.INTEGER,
      tagId: DataTypes.INTEGER
    },
    {}
  );
  ArticleTags.associate = () => {};
  return ArticleTags;
};
