module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define(
    'Article',
    {
      title: DataTypes.STRING,
      body: DataTypes.TEXT,
      image: DataTypes.STRING,
      published: DataTypes.BOOLEAN,
      authorId: DataTypes.INTEGER,
      slug: DataTypes.STRING,
      description: DataTypes.STRING,
      active: DataTypes.BOOLEAN
    },
    {}
  );
  Article.associate = models => {
    Article.belongsTo(models.User, {
      through: 'Articles',
      foreignKey: 'authorId'
    });
  };
  Article.associate = models => {
    Article.belongsToMany(models.User, {
      through: 'Bookmarks',
      foreignKey: 'articleId',
      as: 'bookmarks'
    });
  };
  return Article;
};
