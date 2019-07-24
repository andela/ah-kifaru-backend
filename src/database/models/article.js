import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const Article = sequelize.define(
    'Article',
    {
      title: DataTypes.STRING,
      body: DataTypes.TEXT,
      image: DataTypes.STRING,
      published: DataTypes.BOOLEAN,
      publisheddate: {
        type: DataTypes.DATE,
        field: 'published_date',
        defaultValue: new Date()
      },
      status: {
        type: DataTypes.ENUM('draft', 'active', 'deactivated'),
        defaultValue: 'draft'
      },
      authorId: DataTypes.INTEGER,
      slug: DataTypes.STRING,
      description: DataTypes.STRING
    },
    {}
  );

  Article.associate = models => {
    Article.belongsTo(models.User, {
      through: 'Articles',
      foreignKey: 'authorId'
    });

    Article.belongsToMany(models.User, {
      through: 'Bookmarks',
      foreignKey: 'articleId',
      as: 'bookmarks'
    });
  };

  Article.associate = models => {
    Article.hasMany(models.Rating, {
      as: 'articleRatings',
      foreignKey: 'articleId'
    });

    Article.belongsToMany(models.Rating, {
      through: 'Ratings',
      foreignKey: 'articleId',
      as: 'ratings'
    });
  };

  return Article;
};
