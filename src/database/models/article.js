import dotenv from 'dotenv';

dotenv.config();

export default (sequelize, DataTypes) => {
  const Article = sequelize.define(
    'Article',
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      content: DataTypes.TEXT,
      image: DataTypes.STRING,
      slug: DataTypes.STRING,
      published: { type: DataTypes.BOOLEAN, defaultValue: true },
      active: { type: DataTypes.BOOLEAN, defaultValue: true }
    },
    {}
  );
  Article.associate = models => {
    // associations can be defined here
    const { Ratings } = models;
    Article.hasMany(Ratings, {
      foriegnKey: 'articleId',
      as: 'ratings'
    });
  };
  return Article;
};
