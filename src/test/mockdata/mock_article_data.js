import slug from 'slug';
import crypto from 'crypto';

export const articleSample = {
  status: 'active',
  title: 'Sermon',
  description: 'The word',
  body:
    'In the beginning was the word, the word was with us and the word was God',
  image: 'image1',
  slug: slug(
    `${'Sermon'}-${crypto.randomBytes(12).toString('base64')}`
  ).toLowerCase()
};

export const articleSample2 = {
  status: 'active',
  title: 'Sermon',
  description: 'The word',
  body:
    'In the beginning was the word, the word was with us and the word was God',
  image: 'image1',
  slug: slug(
    `${'Sermon'}-${crypto.randomBytes(12).toString('base64')}`
  ).toLowerCase()
};

export const likeComment = {
  type: 'comment'
};

export const articleWithNoTitle = {
  ...articleSample,
  title: undefined
};
export const articleWithNoDescription = {
  ...articleSample,
  description: undefined
};
export const articleWithNoBody = {
  ...articleSample,
  body: undefined
};
export const articleWithNoImage = {
  ...articleSample,
  image: undefined
};
