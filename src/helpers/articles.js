import slug from 'slug';
import crypto from 'crypto';
import responseGenerator from './responseGenerator';
import BaseRepository from '../repository/base.repository';
import db from '../database/models';

const createArticle = async (
  res,
  { title, description, body, authorId, publishedDate, image }
) => {
  const date =
    publishedDate === null && publishedDate !== 'undefined'
      ? publishedDate
      : Date.now();
  try {
    const create = await BaseRepository.create(db.Article, {
      title,
      description,
      body,
      authorId,
      slug: slug(
        `${title}-${crypto.randomBytes(12).toString('base64')}`
      ).toLowerCase(),
      publishedDate: date,
      updatedAt: Date.now(),
      createdAt: Date.now(),
      image
    });
    return create;
  } catch (error) {
    return responseGenerator.sendError(res, 500, error.message);
  }
};
export default createArticle;
