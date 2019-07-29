import BaseRepository from '../repository/base.repository';
import db from '../database/models';

/**
 *
 *
 * @static
 * @param {*} tag - tag
 * @param {*} articleId - id of article
 * @returns {object} - - tagged article array
 */
const articleTag = async (tag, articleId) => {
  const tags = tag.split(' ');
  const addedTags = [];
  const articlesTagged = [];
  const createdTags = await Promise.all(
    tags.map(tagName =>
      BaseRepository.findOrCreate(db.Tags, { name: tagName }, { name: tagName })
    )
  );
  createdTags.forEach(tagData => addedTags.push(tagData[0].id));
  const taggedArticles = await Promise.all(
    addedTags.map(tagName =>
      BaseRepository.findOrCreate(
        db.ArticleTags,
        { articleId, tagId: tagName },
        { articleId, tagId: tagName }
      )
    )
  );
  taggedArticles.forEach(taggedArticle =>
    articlesTagged.push(taggedArticle[0].dataValues)
  );
  return articlesTagged;
};

export { articleTag };
