import slug from 'slug';
import crypto from 'crypto';

export const articleSample = {
  publishedDate: new Date(),
  status: 'draft',
  title: 'Sermon',
  description: 'The word',
  body:
    'In the beginning was the word, the word was with us and the word was God',
  image: 'image1',
  tag: 'Learning Software Development',
  slug: slug(
    `${'Sermon'}-${crypto.randomBytes(12).toString('base64')}`
  ).toLowerCase(),
  authorId: 2
};

export const articleWithNoTitle = {
  ...articleSample,
  title: ''
};
export const articleWithNoDescription = {
  ...articleSample,
  description: ''
};
export const articleWithNoBody = {
  ...articleSample,
  body: ''
};
export const articleWithNoImage = {
  ...articleSample,
  image: ''
};
export const articleWithNoSlug = {
  ...articleSample,
  slug: ''
};

export const validArticleDetails = {
  title: 'Sermon',
  description: 'The word',
  body:
    'In the beginning was the word, the word was with us and the word was God',
  image: 'image1',
  slug: slug(
    `${'Sermon'}-${crypto.randomBytes(12).toString('base64')}`
  ).toLowerCase()
};
