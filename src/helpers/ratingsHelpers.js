import db from '../database/models/index';
import BaseRepository from '../repository/base.repository';

export const updateAverage = async articleId => {
  const averageRating = await BaseRepository.findAverage(
    articleId,
    db.Rating,
    'articleId',
    'ratings'
  );

  const succcessUpdate = await BaseRepository.update(
    db.Article,
    { avgRating: averageRating },
    { articleId }
  );

  return succcessUpdate;
};

export default updateAverage;
