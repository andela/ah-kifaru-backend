// import chai, { expect } from 'chai';
// import chaiHttp from 'chai-http';
// import app from '../index';
// import BaseRepository from '../repository/base.repository';
// import {
//   createUser,
//   createArticle,
//   generateArticle,
//   generateUser,
//   createTag,
//   createArticleTag
// } from './utils/helpers';
// import db from '../database/models';
// import helper from '../helpers/utils';

// const SEARCH_API = '/api/v1/search';

// chai.use(chaiHttp);

// const server = () => chai.request(app);

// describe('GET api/v1/search', () => {
//   beforeEach(async () => {
//     await db.Article.destroy({ cascade: true, truncate: true });
//     await db.User.destroy({ cascade: true, truncate: true });
//     await db.Tags.destroy({ cascade: true, truncate: true });
//     await db.ArticleTags.destroy({ cascade: true, truncate: true });
//   });
//   it('should search for articles by author', async () => {
//     const user1 = await generateUser({ username: 'kechhy' });
//     const user2 = await generateUser({ username: 'onyimatics' });
//     const firstUser = await createUser(user1);
//     const secondUser = await createUser(user2);
//     const article1 = await generateArticle({ authorId: firstUser.id });
//     article1.title = 'mama';
//     article1.publishedDate = '2019-07-07';
//     const article2 = await generateArticle({ authorId: secondUser.id });
//     article2.title = 'papa';
//     article2.publishedDate = '2019-07-07';
//     const firstArticle = await createArticle(article1);
//     const secondArticle = await createArticle(article2);
//     const firstTag = await createTag({ name: 'bootcamp' });

//     await createArticleTag({
//       tagId: firstTag.id,
//       articleId: firstArticle.id
//     });
//     await createArticleTag({
//       tagId: firstTag.id,
//       articleId: secondArticle.id
//     });
//     const confirmAuthor1 = await BaseRepository.findItAll(db.User);
//     const confirmArticle = await BaseRepository.findItAll(db.Article);
//     const confirmTag = await BaseRepository.findItAll(db.Tags);
//     const confirmArticleTag = await BaseRepository.findItAll(db.ArticleTags);

//     expect(confirmAuthor1[0].username).to.equal(firstUser.username);
//     expect(confirmArticle.length).to.equal(2);
//     expect(confirmTag.length).to.equal(1);
//     expect(confirmArticleTag.length).to.equal(2);

//     const res = await server().get(
//       `${SEARCH_API}?search=${firstUser.username}`
//     );

//     expect(res.status).to.equal(200);
//     expect(res.body.data).to.be.an('array');
//     expect(res.body.data[0].username).to.equal(firstUser.username);
//     expect(res.body.data[0].title).to.equal(firstArticle.title);
//     expect(res.body.data[0].body).to.equal(firstArticle.body);
//     expect(res.body.data[0].description).to.equal(firstArticle.description);
//     expect(res.body.data.length).to.equal(1);
//     expect(res.body.data[0].user_score).to.equal(1);
//     expect(res.body.data[0].title_score).to.equal(0);
//     expect(res.body.data[0].tag_score).to.equal(0);
//   });

//   it('should search for articles by article title', async () => {
//     const user = await generateUser({ username: 'kechhy' });
//     const firstUser = await createUser(user);
//     const article1 = await generateArticle({ authorId: firstUser.id });
//     article1.title = 'mama';
//     article1.publishedDate = '2019-07-07';
//     const article2 = await generateArticle({ authorId: firstUser.id });
//     article2.title = 'papa';
//     article2.publishedDate = '2019-07-07';
//     const firstArticle = await createArticle(article1);
//     const secondArticle = await createArticle(article2);
//     const firstTag = await createTag({ name: 'bootcamp' });
//     await createArticleTag({
//       tagId: firstTag.id,
//       articleId: firstArticle.id
//     });
//     await createArticleTag({
//       tagId: firstTag.id,
//       articleId: secondArticle.id
//     });

//     const confirmAuthor = await BaseRepository.findItAll(db.User);
//     const confirmArticle = await BaseRepository.findItAll(db.Article);
//     const confirmTag = await BaseRepository.findItAll(db.Tags);
//     const confirmArticleTag = await BaseRepository.findItAll(db.ArticleTags);

//     expect(confirmAuthor[0].username).to.equal(firstUser.username);
//     expect(confirmArticle.length).to.equal(2);
//     expect(confirmTag.length).to.equal(1);
//     expect(confirmArticleTag.length).to.equal(2);

//     const res = await server().get(
//       `${SEARCH_API}?search=${firstArticle.title}`
//     );
//     expect(res.status).to.equal(200);
//     expect(res.body.data).to.be.an('array');
//     expect(res.body.data[0].username).to.equal(firstUser.username);
//     expect(res.body.data[0].title).to.equal(firstArticle.title);
//     expect(res.body.data[0].body).to.equal(firstArticle.body);
//     expect(res.body.data[0].description).to.equal(firstArticle.description);
//     expect(res.body.data.length).to.equal(1);
//     expect(res.body.data[0].user_score).to.equal(0);
//     expect(res.body.data[0].title_score).to.equal(1);
//     expect(res.body.data[0].tag_score).to.equal(0);
//   });

//   it('should search for articles by tag', async () => {
//     const user = await generateUser({ username: 'kechhy' });
//     const firstUser = await createUser(user);
//     const article1 = await generateArticle({ authorId: firstUser.id });
//     article1.title = 'mama';
//     article1.publishedDate = '2019-07-07';
//     const article2 = await generateArticle({ authorId: firstUser.id });
//     article2.title = 'papa';
//     article2.publishedDate = '2019-07-07';
//     const firstArticle = await createArticle(article1);
//     const secondArticle = await createArticle(article2);
//     const firstTag = await createTag({ name: 'bootcamp' });
//     const secondTag = await createTag({ name: 'andela' });
//     await createArticleTag({
//       tagId: firstTag.id,
//       articleId: firstArticle.id
//     });
//     await createArticleTag({
//       tagId: secondTag.id,
//       articleId: secondArticle.id
//     });

//     const confirmAuthor = await BaseRepository.findItAll(db.User);
//     const confirmArticle = await BaseRepository.findItAll(db.Article);
//     const confirmTag = await BaseRepository.findItAll(db.Tags);
//     const confirmArticleTag = await BaseRepository.findItAll(db.ArticleTags);

//     expect(confirmAuthor[0].username).to.equal(firstUser.username);
//     expect(confirmArticle.length).to.equal(2);
//     expect(confirmTag.length).to.equal(2);
//     expect(confirmArticleTag.length).to.equal(2);

//     const res = await server().get(`${SEARCH_API}?search=${firstTag.name}`);
//     expect(res.status).to.equal(200);
//     expect(res.body.data).to.be.an('array');
//     expect(res.body.data[0].username).to.equal(firstUser.username);
//     expect(res.body.data[0].title).to.equal(firstArticle.title);
//     expect(res.body.data[0].body).to.equal(firstArticle.body);
//     expect(res.body.data[0].description).to.equal(firstArticle.description);
//     expect(res.body.data.length).to.equal(1);
//     expect(res.body.data[0].user_score).to.equal(0);
//     expect(res.body.data[0].title_score).to.equal(0);
//     expect(res.body.data[0].tag_score).to.equal(1);
//   });
//   it('should fetch all articles on default search route', async () => {
//     const firstUser = await createUser();
//     await createArticle(await generateArticle({ authorId: firstUser.id }));
//     await createArticle(await generateArticle({ authorId: firstUser.id }));
//     await createArticle(await generateArticle({ authorId: firstUser.id }));
//     await createArticle(await generateArticle({ authorId: firstUser.id }));
//     await createArticle(await generateArticle({ authorId: firstUser.id }));

//     const numberOfArticles = await BaseRepository.findAndCountAll(db.Article);
//     expect(numberOfArticles.count).to.equal(5);
//     const res = await server().get(`${SEARCH_API}`);
//     expect(res.status).to.equal(200);
//     expect(res.body.data).to.be.an('array');
//     expect(res.body.data).to.have.lengthOf(5);
//   });
// });
