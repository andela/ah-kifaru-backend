module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define(
    'Article',
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      content: DataTypes.TEXT,
      image: DataTypes.STRING,
      slug: DataTypes.STRING,
      published: DataTypes.BOOLEAN
    },
    {}
  );
  Article.associate = function(models) {
    // associations can be defined here
  };
  return Article;
};
