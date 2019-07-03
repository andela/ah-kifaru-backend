module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2]
      }
    },
    description: DataTypes.STRING,
    body: DataTypes.TEXT,
    image: DataTypes.STRING,
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    publishedDate: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    status: {
      type: DataTypes.ENUM('draft', 'active', 'deactivated'),
      defaultValue: 'draft'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date()
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date()
    }
  });

  Article.associate = models => {
    Article.belongsTo(models.User, {
      through: 'Articles',
      foreignKey: 'id',
      as: 'authorId'
    });
    Article.belongsToMany(models.User, {
      through: 'Bookmarks',
      foreignKey: 'articleId',
      as: 'bookmarks'
    });
    Article.hasMany(models.Rating, {
      as: 'articleRatings',
      foreignKey: 'articleId'
    });
  };
  return Article;
};
