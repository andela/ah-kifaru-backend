import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const Article = sequelize.define(
    'Article',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      body: DataTypes.TEXT,
      image: DataTypes.STRING,
      publishedDate: DataTypes.DATE,
      status: {
        type: DataTypes.ENUM('active', 'deactivated'),
        defaultValue: 'active'
      },
      authorId: DataTypes.INTEGER,
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      description: DataTypes.STRING,
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
        allowNull: false
      },
      deletedAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      paranoid: true
    }
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
    Article.hasMany(models.Rating, {
      as: 'articleRatings',
      foreignKey: 'articleId'
    });
    Article.belongsTo(models.User, {
      foreignKey: 'authorId',
      as: 'author'
    });
    Article.belongsToMany(models.Tags, {
      as: 'tags',
      through: 'ArticleTags',
      foreignKey: 'articleId'
    });
  };
  return Article;
};
