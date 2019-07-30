import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../index';
import BaseRepository from '../repository/base.repository';
import {
  createUser,
  createArticle,
  generateArticle,
  article,
  articleWithShortBody,
  articleWithShortDescription,
  articleWithShortImage,
  articleWithShortTitle,
  rateArticle
} from './utils/helpers';
import db from '../database/models';
import helper from '../helpers/utils';
import {
  articleSample,
  articleSample2,
  articleWithNoTitle
} from './mockdata/mock_article_data';

const ARTICLES_API = '/api/v1/articles';

chai.use(chaiHttp);

const server = () => chai.request(app);

describe('PATCH api/v1/articles/bookmark', () => {
  beforeEach(async () => {
    await db.Bookmark.destroy({ cascade: true, truncate: true });
    await db.Article.destroy({ cascade: true, truncate: true });
    await db.User.destroy({ cascade: true, truncate: true });
    await db.Article.destroy({ cascade: true, truncate: true });
  });
  it('should bookmark an article', async () => {
    const firstUser = await createUser();
    const secondUser = await createUser();
    const theArticle = await createArticle(
      await generateArticle({ authorId: secondUser.id })
    );
    const numberOfArticles = await BaseRepository.findAll(db.Article);
    const numberOfBookmarks = await BaseRepository.findAndCountAll(
      db.Bookmark,
      {
        userId: firstUser.id
      }
    );
    const token = helper.jwtSigner(firstUser);
    expect(numberOfArticles.length).to.equal(1);
    expect(numberOfBookmarks.count).to.equal(0);

    const res = await server()
      .patch(`${ARTICLES_API}/bookmark`)
      .set('token', token)
      .send({ articleId: theArticle.id });
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Article Bookmarked successfully');

    const allUserBookmarks = await BaseRepository.findAll(db.Bookmark, {
      userId: firstUser.id
    });
    expect(allUserBookmarks.length).to.equal(1);
    expect(allUserBookmarks[0].articleId).to.equal(theArticle.id);
  });

  it('should remove a bookmark', async () => {
    const firstUser = await createUser();
    const secondUser = await createUser();
    const theArticle = await createArticle(
      await generateArticle({ authorId: secondUser.id })
    );
    await BaseRepository.create(db.Bookmark, {
      userId: firstUser.id,
      articleId: theArticle.id
    });
    const numberOfBookmarks = await BaseRepository.findAll(db.Bookmark, {
      userId: firstUser.id
    });

    const token = helper.jwtSigner(firstUser);
    expect(numberOfBookmarks.length).to.equal(1);

    const res = await server()
      .patch(`${ARTICLES_API}/unbookmark`)
      .set('token', token)
      .send({ articleId: theArticle.id });
    expect(res.status).to.equal(200);

    const currentNumberOfBookmarks = await BaseRepository.findAll(db.Bookmark, {
      userId: firstUser.id
    });

    expect(currentNumberOfBookmarks.length).to.equal(0);
  });

  it('should return error if database error occurs on bookmark', async () => {
    const firstUser = await createUser();
    const secondUser = await createUser();
    const theArticle = await createArticle(
      await generateArticle({ authorId: secondUser.id })
    );
    const numberOfArticles = await BaseRepository.findAll(db.Article);
    const numberOfBookmarks = await BaseRepository.findAndCountAll(
      db.Bookmark,
      {
        userId: firstUser.id
      }
    );
    const token = helper.jwtSigner(firstUser);
    expect(numberOfArticles.length).to.equal(1);
    expect(numberOfBookmarks.count).to.equal(0);
    const findAllStub = sinon.stub(BaseRepository, 'findOrCreate');
    findAllStub.rejects();
    const res = await server()
      .patch(`${ARTICLES_API}/bookmark`)
      .set('token', token)
      .send({ articleId: theArticle.id });
    expect(res.status).to.equal(500);
    findAllStub.restore();
  });

  it('should return error if database error occurs on unbookmark', async () => {
    const firstUser = await createUser();
    const secondUser = await createUser();
    const theArticle = await createArticle(
      await generateArticle({ authorId: secondUser.id })
    );
    await BaseRepository.create(db.Bookmark, {
      userId: firstUser.id,
      articleId: theArticle.id
    });
    const numberOfBookmarks = await BaseRepository.findAll(db.Bookmark, {
      userId: firstUser.id
    });

    const token = helper.jwtSigner(firstUser);
    expect(numberOfBookmarks.length).to.equal(1);
    const findAllStub = sinon.stub(BaseRepository, 'remove');
    findAllStub.rejects();
    const res = await server()
      .patch(`${ARTICLES_API}/unbookmark`)
      .set('token', token)
      .send({ articleId: theArticle.id });
    expect(res.status).to.equal(500);
    findAllStub.restore();
  });
});

describe('GET api/v1/articles/bookmark', () => {
  beforeEach(async () => {
    await db.Bookmark.destroy({ cascade: true, truncate: true });
    await db.User.destroy({ cascade: true, truncate: true });
  });

  it('should get all bookmarks for a user', async () => {
    const firstUser = await createUser();
    const secondUser = await createUser();
    const theArticle = await createArticle(
      await generateArticle({ authorId: secondUser.id })
    );
    const numberOfBookmarks = await BaseRepository.findAndCountAll(
      db.Bookmark,
      {
        userId: firstUser.id
      }
    );
    expect(numberOfBookmarks.count).to.equal(0);
    await BaseRepository.create(db.Bookmark, {
      userId: firstUser.id,
      articleId: theArticle.id
    });
    const newNumberOfBookmarks = await BaseRepository.findAndCountAll(
      db.Bookmark,
      {
        userId: firstUser.id
      }
    );
    expect(newNumberOfBookmarks.count).to.equal(1);

    const token = helper.jwtSigner(firstUser);
    const page = 1;
    const limit = 1;

    const res = await server()
      .get(`${ARTICLES_API}/bookmarks?page=${page}&limit=${limit}`)
      .set('token', token);
    expect(res.status).to.equal(200);

    expect(res.body.data[0].articleId).to.equal(theArticle.id);
    expect(res.body.data[0]['article.title']).to.equal(theArticle.title);
    expect(res.body.data[0]['article.authorId']).to.equal(secondUser.id);

    expect(res.status).to.equal(200);
    expect(res.body.metadata.next).to.equal(null);
    expect(res.body.metadata.currentPage).to.equal(page);
    expect(res.body.metadata.totalItems).to.equal(newNumberOfBookmarks.count);
  });

  it('should get no bookmarks for the user', async () => {
    const firstUser = await createUser();

    const numberOfBookmarks = await BaseRepository.findAndCountAll(
      db.Bookmark,
      {
        userId: firstUser.id
      }
    );
    expect(numberOfBookmarks.count).to.equal(0);

    const token = helper.jwtSigner(firstUser);

    const res = await server()
      .get(`${ARTICLES_API}/bookmarks`)
      .set('token', token);
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      'You currently do not have any article in your bookmark'
    );

    const newNumberOfBookmarks = await BaseRepository.findAndCountAll(
      db.Bookmark,
      {
        userId: firstUser.id
      }
    );
    expect(newNumberOfBookmarks.count).to.equal(0);
  });

  it('should return error if database error occurs on bookmark', async () => {
    const firstUser = await createUser();

    const numberOfBookmarks = await BaseRepository.findAndCountAll(
      db.Bookmark,
      {
        userId: firstUser.id
      }
    );
    expect(numberOfBookmarks.count).to.equal(0);

    const token = helper.jwtSigner(firstUser);
    const findAllStub = sinon.stub(BaseRepository, 'findCountAndInclude');
    findAllStub.rejects();
    const res = await server()
      .get(`${ARTICLES_API}/bookmarks`)
      .set('token', token);
    expect(res.status).to.equal(500);
    findAllStub.restore();
  });
});

describe('GET api/v1/articles', () => {
  beforeEach(async () => {
    await db.Article.destroy({ cascade: true, truncate: true });
    await db.User.destroy({ cascade: true, truncate: true });
  });

  it('should get a list of all articles', async () => {
    const firstUser = await createUser();
    const secondUser = await createUser();
    const theArticle = await createArticle(
      await generateArticle({ authorId: secondUser.id })
    );

    const numberOfArticles = await BaseRepository.findAndCountAll(db.Article);
    const token = helper.jwtSigner(firstUser);
    expect(numberOfArticles.count).to.equal(1);

    const res = await server()
      .get(`${ARTICLES_API}`)
      .set('token', token);
    expect(res.status).to.equal(200);
    expect(res.body.data).to.be.an('array');
    expect(res.body.data).to.have.lengthOf(1);
    expect(res.body.data[0].id).to.equal(theArticle.id);
    expect(res.body.data[0].authorId).to.equal(secondUser.id);
    expect(res.body.data[0].title).to.equal(theArticle.title);
    expect(res.body.data[0].body).to.equal(theArticle.body);
    expect(res.body.data[0].image).to.equal(theArticle.image);
  });

  it('should list articles with pagaination', async () => {
    const firstUser = await createUser();
    await createArticle(await generateArticle({ authorId: firstUser.id }));
    await createArticle(await generateArticle({ authorId: firstUser.id }));
    await createArticle(await generateArticle({ authorId: firstUser.id }));
    await createArticle(await generateArticle({ authorId: firstUser.id }));
    await createArticle(await generateArticle({ authorId: firstUser.id }));

    const numberOfArticles = await BaseRepository.findAndCountAll(db.Article);
    const token = helper.jwtSigner(firstUser);
    const page = 2;
    const limit = 2;
    const res = await server()
      .get(`${ARTICLES_API}?page=${page}&limit=${limit}`)
      .set('token', token);
    expect(res.status).to.equal(200);
    expect(res.body.data).to.be.an('array');
    expect(res.body.metadata.prev).to.equal(`${ARTICLES_API}?page=1&limit=2`);
    expect(res.body.metadata.currentPage).to.equal(2);
    expect(res.body.metadata.next).to.equal(`${ARTICLES_API}?page=3&limit=2`);
    expect(res.body.metadata.totalPages).to.equal(3);
    expect(res.body.metadata.totalItems).to.equal(5);
  });

  it('should return error if database error occurs', done => {
    const findAllStub = sinon.stub(BaseRepository, 'findAndCountAll');
    findAllStub.rejects();
    const userUrl = '/api/v1/articles';
    chai
      .request(app)
      .get(userUrl)
      .end((err, res) => {
        expect(res.status).to.equal(500);
        findAllStub.restore();
        done();
      });
  });
});

describe('POST api/v1/articles/', () => {
  beforeEach(async () => {
    await db.Bookmark.destroy({ cascade: true, truncate: true });
    await db.User.destroy({ cascade: true, truncate: true });
    await db.Article.destroy({ cascade: true, truncate: true });
  });

  it('should throw a 401 status code when creating an article with invalid token', async () => {
    const invalidToken = 'sdsf89u023434n23knslfdasa.xzdfsdf';
    const token = invalidToken;

    const response = await server()
      .post(`${ARTICLES_API}`)
      .set('x-access-token', token)
      .send(articleSample);
    expect(response.status).to.equal(401);
    expect(response.body.message).to.equal('Token is not valid');
  });

  it('should throw a 400 when token is not provided', async () => {
    const response = await server()
      .post(`${ARTICLES_API}`)
      .send(articleSample);
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Invalid access token');
  });

  it('should successfully create an article with valid user input', async () => {
    const newUser = await createUser();
    const token = helper.jwtSigner(newUser);

    const response = await server()
      .post(`${ARTICLES_API}`)
      .set('x-access-token', token)
      .send(articleSample);
    expect(response.status).to.equal(201);
    expect(response.body.data.authorId).to.equal(newUser.id);
    expect(response.body.data.title).to.equal(articleSample.title);
    expect(response.body.data.body).to.equal(articleSample.body);
    expect(response.body.data.image).to.equal(articleSample.image);
    expect(response.body.data).to.have.property('slug');
    expect(response.body.data.slug).to.be.a('string');
    expect(response.body.data.status).to.equal('active');
    expect(response.body.data.publishedDate).to.equal(null);
  });

  it('should test that two articles with same title are not created with the same slug', async () => {
    const article1 = await BaseRepository.create(db.Article, articleSample);
    const article2 = await BaseRepository.create(db.Article, articleSample2);

    expect(article1.slug).to.not.equal(article2.slug);
  });

  it('should throw a 400 status code when creating an article with no title', async () => {
    const newUser = await createUser();
    const token = helper.jwtSigner(newUser);

    const response = await server()
      .post(`${ARTICLES_API}`)
      .set('x-access-token', token)
      .send(articleWithNoTitle);
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal(
      'Please provide a title for your article with minimum of 3 characters'
    );
  });

  it('should return error if database error occurs', async () => {
    const newUser = await createUser();
    const token = helper.jwtSigner(newUser);
    const findAllStub = await sinon.stub(BaseRepository, 'create');
    findAllStub.rejects(
      new Error(
        'Your request cannot be processed right now, Please try again later'
      )
    );
    const res = await chai
      .request(app)
      .post(`${ARTICLES_API}`)
      .set('x-access-token', token)
      .send(articleSample);
    expect(res.status).to.equal(500);
    expect(res.body.message).to.equal(
      'Your request cannot be processed right now, Please try again later'
    );
    findAllStub.restore();
  });
});

describe('GET /api/v1/articles/:articleId', () => {
  beforeEach(async () => {
    await db.Bookmark.destroy({ cascade: true, truncate: true });
    await db.User.destroy({ cascade: true, truncate: true });
    await db.Article.destroy({ cascade: true, truncate: true });
  });

  it('should successfully get a specific article', async () => {
    const firstUser = await createUser();
    const secondUser = await createUser();
    const thirdUser = await createUser();
    const fourthUser = await createUser();

    const firstArticle = await createArticle(
      await generateArticle({
        authorId: firstUser.id,
        publishedDate: new Date()
      })
    );

    await createArticle(await generateArticle({ authorId: firstUser.id }));

    await rateArticle({
      articleId: firstArticle.id,
      userId: secondUser.id,
      ratings: 5
    });

    await rateArticle({
      articleId: firstArticle.id,
      userId: thirdUser.id,
      ratings: 3
    });

    await rateArticle({
      articleId: firstArticle.id,
      userId: fourthUser.id,
      ratings: 3
    });

    const totalRatings = await BaseRepository.findAndCountAll(db.Rating, {
      where: { articleId: firstArticle.id }
    });

    const res = await server().get(`${ARTICLES_API}/${firstArticle.id}`);
    expect(res.status).to.equal(200);
    expect(res.body.data[0].id).to.equal(firstArticle.id);
    expect(res.body.data[0].title).to.equal(firstArticle.title);
    expect(res.body.data[0].description).to.equal(firstArticle.description);
    expect(Number(res.body.data[0].count_rating)).to.equal(totalRatings.count);
    expect(res.body.data[0].username).to.equal(firstUser.username);
    expect(res.body.data[0].image).to.equal(firstArticle.image);
    expect(res.body.data[0].body).to.equal(firstArticle.body);

    expect(
      Number(Number(`${res.body.data[0].avg_rating}`).toFixed(1))
    ).to.equal(
      Number(
        (
          totalRatings.rows.reduce((sum, current) => sum + current.ratings, 0) /
          totalRatings.count
        ).toFixed(1)
      )
    );
  });

  it('should throw a 404 status code when a specific article is not found', async () => {
    const nonExistentArticleId = 5;
    const response = await server().get(
      `${ARTICLES_API}/${nonExistentArticleId}`
    );
    expect(response.status).to.equal(404);
    expect(response.body.message).to.equal(
      'The requested article was not found'
    );
  });

  it('should return a 400 if article ID is invalid or not a non-zero positive an integer', async () => {
    const invalidArticleId = '--gr444eat';
    const response = await server().get(`${ARTICLES_API}/${invalidArticleId}`);
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal(
      'Invalid Article ID. Article ID must be a positive integer'
    );
  });

  it('should return an error if database error occurs', async () => {
    const firstUser = await createUser();
    const secondUser = await createUser();

    const firstArticle = await createArticle(
      await generateArticle({
        authorId: firstUser.id,
        publishedDate: new Date()
      })
    );

    await createArticle(await generateArticle({ authorId: firstUser.id }));

    await rateArticle({
      articleId: firstArticle.id,
      userId: secondUser.id,
      ratings: 5
    });

    const findAllStub = sinon.stub(BaseRepository, 'findAverage');
    findAllStub.rejects(new Error('Server Error'));

    const res = await server().get(`${ARTICLES_API}/${firstArticle.id}`);

    expect(res.status).to.equal(500);
    expect(res.body.message).to.equal('Server Error');

    findAllStub.restore();
  });
});

describe('DELETE /api/v1/articles/:articleId', () => {
  beforeEach(async () => {
    await db.Bookmark.destroy({ cascade: true, truncate: true });
    await db.User.destroy({ cascade: true, truncate: true });
    await db.Article.destroy({ cascade: true, truncate: true });
  });

  it('should throw a 401 status code when creating an article with invalid token', async () => {
    const invalidToken = 'sdsf89u023434n23knslfdasa.xzdfsdf';
    const token = invalidToken;

    const response = await server()
      .delete(`${ARTICLES_API}/:articleId`)
      .set('x-access-token', token)
      .send(articleSample);
    expect(response.status).to.equal(401);
    expect(response.body.message).to.equal('Token is not valid');
  });

  it('should throw a 400 status code when token is not provided', async () => {
    const response = await server()
      .delete(`${ARTICLES_API}/:articleId`)
      .send(articleSample);
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Invalid access token');
  });

  it('should successfully delete an article', async () => {
    const newUser = await createUser();
    const token = helper.jwtSigner(newUser);

    const article = await generateArticle({ authorId: newUser.id });
    const createdArticle = await createArticle(article);
    const initialArticles = await BaseRepository.findAndCountAll(db.Article);

    const response = await chai
      .request(app)
      .delete(`${ARTICLES_API}/${createdArticle.id}`)
      .set('x-access-token', token);
    expect(initialArticles.count).to.equal(1);
    expect(response.status).to.equal(200);
    expect(createdArticle.authorId).to.equal(newUser.id);
    expect(response.body.message).to.equal('Article successfully deleted');
    const finalArticles = await BaseRepository.findAndCountAll(db.Article);
    expect(finalArticles.count).to.equal(0);
  });

  it('should throw a 404 status code when a specific article is not found', async () => {
    const nonExistentArticleId = 5;
    const response = await server().get(
      `${ARTICLES_API}/${nonExistentArticleId}`
    );
    expect(response.status).to.equal(404);
    expect(response.body.message).to.equal(
      'The requested article was not found'
    );
  });

  it('should return a 400 status code if article IDis invalid or not a non-zero positive an integer', async () => {
    const invalidArticleId = '--gr444eat';

    const response = await server().get(`${ARTICLES_API}/${invalidArticleId}`);
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal(
      'Invalid Article ID. Article ID must be a positive integer'
    );
  });

  it('should return error if database error occurs', async () => {
    const newUser = await createUser();
    const token = helper.jwtSigner(newUser);
    const findAllStub = await sinon.stub(BaseRepository, 'findOneByField');
    findAllStub.rejects(
      new Error(
        'Your request cannot be processed right now, Please try again later'
      )
    );

    const validArticle = await BaseRepository.create(db.Article, articleSample);

    const response = await chai
      .request(app)
      .delete(`${ARTICLES_API}/${validArticle.id}`)
      .set('x-access-token', token)
      .send(articleSample);
    expect(response.status).to.equal(500);
    expect(response.body.message).to.equal(
      'Your request cannot be processed right now, Please try again later'
    );
    findAllStub.restore();
  });
});

describe('PUT /api/v1/articles/:articleId', () => {
  beforeEach(async () => {
    await db.Bookmark.destroy({ cascade: true, truncate: true });
    await db.User.destroy({ cascade: true, truncate: true });
    await db.Article.destroy({ cascade: true, truncate: true });
  });

  it('should throw a 401 status code when creating an article with invalid token', async () => {
    const invalidToken = 'sdsf89u023434n23knslfdasa.xzdfsdf';

    const response = await server()
      .put(`${ARTICLES_API}/:articleId`)
      .set('x-access-token', invalidToken)
      .send(articleSample);
    expect(response.status).to.equal(401);
    expect(response.body.message).to.equal('Token is not valid');
  });

  it('should throw a 400 status code when token is not provided', async () => {
    const response = await server()
      .put(`${ARTICLES_API}/:articleId`)
      .send(articleSample);
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Invalid access token');
  });

  it('should successfully update a specific article', async () => {
    const newUser = await createUser();
    const token = helper.jwtSigner(newUser);
    const newUpdateDate = new Date();
    const article = await generateArticle({ authorId: newUser.id });
    const createdArticle = await createArticle(article);

    const response = await chai
      .request(app)
      .put(`${ARTICLES_API}/${createdArticle.id}`)
      .set('x-access-token', token)
      .send({
        title: articleSample.title,
        description: articleSample.description,
        body: articleSample.body,
        image: articleSample.image,
        updatedAt: newUpdateDate
      });
    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Article successfully updated');
    expect(response.body.data.id).to.equal(createdArticle.id);
    expect(response.body.data.title).to.equal(articleSample.title);
    expect(response.body.data.description).to.equal(articleSample.description);
    expect(response.body.data.body).to.equal(articleSample.body);
    expect(response.body.data).to.have.property('image');
    expect(response.body.data).to.have.property('slug');
    expect(response.body.data.slug).to.equal(createdArticle.slug);
    expect(response.body.data.publishedDate).to.deep.equal(
      article.publishedDate
    );
    expect(response.body.data.authorId).to.equal(createdArticle.authorId);
    expect(response.body.data.updatedAt).to.not.equal(createdArticle.updatedAt);
  });

  it('should throw a 404 error when a specific article is not found', async () => {
    const newUser = await createUser();
    const token = helper.jwtSigner(newUser);
    const nonExistentArticleId = 5;

    const response = await chai
      .request(app)
      .put(`${ARTICLES_API}/${nonExistentArticleId}`)
      .set('x-access-token', token)
      .send({
        title: articleSample.title,
        description: articleSample.description,
        body: articleSample.body,
        image: articleSample.image
      });
    expect(response.status).to.equal(404);
    expect(response.body.message).to.equal(
      'The requested article was not found'
    );
  });

  it('should return a 400 if article ID is invalid or not a non-zero positive an integer', async () => {
    const newUser = await createUser();
    const token = helper.jwtSigner(newUser);

    const stringId = 'great';
    const response = await server()
      .put(`${ARTICLES_API}/${stringId}`)
      .set('x-access-token', token)
      .send({
        title: articleSample.title,
        description: articleSample.description,
        body: articleSample.body,
        image: articleSample.image
      });
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal(
      'Invalid Article ID. Article ID must be a positive integer'
    );
  });

  it('should return error if database error occurs', async () => {
    const newUser = await createUser();
    const token = helper.jwtSigner(newUser);
    const newUpdateDate = new Date();
    const article = await generateArticle({ authorId: newUser.id });
    const createdArticle = await createArticle(article);
    const findAllStub = sinon.stub(BaseRepository, 'update');
    findAllStub.rejects(
      new Error(
        'Your request cannot be processed right now, Please try again later'
      )
    );

    const response = await chai
      .request(app)
      .put(`${ARTICLES_API}/${createdArticle.id}`)
      .set('x-access-token', token)
      .send({
        title: articleSample.title,
        description: articleSample.description,
        body: articleSample.body,
        image: articleSample.image,
        updatedAt: newUpdateDate
      });
    expect(response.status).to.equal(500);
    expect(response.body.message).to.equal(
      'Your request cannot be processed right now, Please try again later'
    );
    findAllStub.restore();
  });
});

describe('PUT /api/v1/articles/publish?articleId', () => {
  beforeEach(async () => {
    await db.Article.destroy({ cascade: true, truncate: true });
    await db.User.destroy({ cascade: true, truncate: true });
    await db.Follower.destroy({ cascade: true, truncate: true });
    await db.Tags.destroy({ cascade: true, truncate: true });
    await db.ArticleTags.destroy({ cascade: true, truncate: true });
  });
  it('Returns 400 if the article Id is provided but is not a number', async () => {
    const firstUser = await createUser();
    const token = await helper.jwtSigner(firstUser);

    const response = await server()
      .put(`${ARTICLES_API}/publish?articleId=${'men'}`)
      .set('x-access-token', token)
      .send(article);
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal(
      'Invalid article id. Article id must be a non-zero positive integer'
    );
  });
  it('Returns 400 if the title provided is less than 3 characters', async () => {
    const firstUser = await createUser();
    const token = await helper.jwtSigner(firstUser);

    const response = await server()
      .put(`${ARTICLES_API}/publish`)
      .set('x-access-token', token)
      .send(articleWithShortTitle);
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Title is required');
  });
  it('Returns 400 if the body of the article provided is less than 3 characters', async () => {
    const firstUser = await createUser();
    const token = await helper.jwtSigner(firstUser);

    const response = await server()
      .put(`${ARTICLES_API}/publish`)
      .set('x-access-token', token)
      .send(articleWithShortBody);
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('A body is required. . .');
  });
  it('Returns 400 if the articles image provided not a valid url', async () => {
    const firstUser = await createUser();
    const token = await helper.jwtSigner(firstUser);

    const response = await server()
      .put(`${ARTICLES_API}/publish`)
      .set('x-access-token', token)
      .send(articleWithShortImage);
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Invalid image url');
  });
  it('Returns 400 if the articles description was not provided', async () => {
    const firstUser = await createUser();
    const token = await helper.jwtSigner(firstUser);

    const response = await server()
      .put(`${ARTICLES_API}/publish`)
      .set('x-access-token', token)
      .send(articleWithShortDescription);
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal(
      'Enter a brief description for the article'
    );
  });
  it('Returns 200 if article saved as draft has been published', async () => {
    const firstUser = await createUser();
    const token = await helper.jwtSigner(firstUser);
    const newArticle = await generateArticle({ authorId: firstUser.id });
    const createdArticle = await createArticle(newArticle);
    const tags = article.tag.split(' ');

    const response = await server()
      .put(`${ARTICLES_API}/publish?articleId=${createdArticle.id}`)
      .set('x-access-token', token)
      .send(article);
    const tagged = await BaseRepository.findAndCountAll(db.ArticleTags, {});
    expect(tagged.count).to.equal(tags.length);
    expect(response.status).to.equal(200);
    expect(response.body.data.title).to.equal(article.title);
    expect(response.body.data.body).to.equal(article.body);
    expect(response.body.data.authorId).to.equal(createdArticle.authorId);
    expect(response.body.data.description).to.equal(article.description);
  });
  it('Publishing an article multiple times fails silently', async () => {
    const firstUser = await createUser();
    const token = await helper.jwtSigner(firstUser);
    const newArticle = await generateArticle({ authorId: firstUser.id });
    newArticle.publishedDate = '2019-07-22T08:51:47.224Z';
    const createdArticle = await createArticle(newArticle);
    const tags = article.tag.split(' ');

    const response = await server()
      .put(`${ARTICLES_API}/publish?articleId=${createdArticle.id}`)
      .set('x-access-token', token)
      .send(article);
    const tagged = await BaseRepository.findAndCountAll(db.ArticleTags, {});
    expect(tagged.count).to.equal(tags.length);
    expect(response.status).to.equal(200);
    expect(response.body.data.publishedDate).to.equal(newArticle.publishedDate);
    expect(response.body.data.title).to.equal(article.title);
    expect(response.body.data.body).to.equal(article.body);
    expect(response.body.data.image).to.equal(article.image);
    expect(response.body.data.authorId).to.equal(createdArticle.authorId);
    expect(response.body.data.description).to.equal(article.description);
  });
  it('Returns 201 if the article was published immediately', async () => {
    const firstUser = await createUser();
    const token = await helper.jwtSigner(firstUser);
    const tags = article.tag.split(' ');
    const response = await server()
      .put(`${ARTICLES_API}/publish`)
      .set('x-access-token', token)
      .send(article);
    const tagged = await BaseRepository.findAndCountAll(db.ArticleTags, {});
    expect(tagged.count).to.equal(tags.length);
    expect(response.status).to.equal(201);
    expect(response.body.data.createdAt).to.not.equal(null);
    expect(response.body.data.updatedAt).to.not.equal(null);
    expect(response.body.data.publishedDate).to.not.equal(null);
    expect(response.body.data.title).to.equal(article.title);
    expect(response.body.data.body).to.equal(article.body);
    expect(response.body.data.image).to.equal(article.image);
    expect(response.body.data.authorId).to.equal(firstUser.id);
    expect(response.body.data.description).to.equal(article.description);
  });
  it('should return error if database error occurs', async () => {
    const newUser = await createUser();
    const token = helper.jwtSigner(newUser);
    const createStub = await sinon
      .stub(BaseRepository, 'create')
      .rejects(new Error('Server Error'));
    const response = await server()
      .put(`${ARTICLES_API}/publish`)
      .set('x-access-token', token)
      .send(article);
    expect(response.status).to.equal(500);
    expect(response.body.message).to.equal('Server Error');
    createStub.restore();
  });
});

describe('GET /api/v1/articles/popular', () => {
  beforeEach(async () => {
    await db.Rating.destroy({ cascade: true, truncate: true });
    await db.User.destroy({ cascade: true, truncate: true });
    await db.Article.destroy({ cascade: true, truncate: true });
  });
  it('should get article by ratings', async () => {
    const firstUser = await createUser();
    const secondUser = await createUser();
    const thirdUser = await createUser();
    const fourthUser = await createUser();
    const fifthUser = await createUser();

    const firstArticle = await createArticle(
      await generateArticle({ authorId: firstUser.id })
    );
    const secondArticle = await createArticle(
      await generateArticle({ authorId: firstUser.id })
    );
    await rateArticle({
      articleId: firstArticle.id,
      userId: secondUser.id,
      ratings: 5
    });
    await rateArticle({
      articleId: firstArticle.id,
      userId: thirdUser.id,
      ratings: 3
    });
    await rateArticle({
      articleId: firstArticle.id,
      userId: fourthUser.id,
      ratings: 4
    });
    await rateArticle({
      articleId: secondArticle.id,
      userId: fifthUser.id,
      ratings: 1
    });

    const page = 1;
    const limit = 3;

    const numberOfRatings = await BaseRepository.findAndCountAll(db.Rating, {
      where: { articleId: firstArticle.id }
    });

    const res = await server().get(
      `${ARTICLES_API}/popular?page=${page}&limit=${limit}`
    );
    expect(res.status).to.equal(200);
    expect(Number(`${res.body.data[0].count_rating}`)).to.equal(
      Number(`${numberOfRatings.count}`)
    );
    expect(
      Number(Number(`${res.body.data[0].avg_rating}`).toFixed(1))
    ).to.equal(
      Number(
        (
          numberOfRatings.rows.reduce(
            (sum, current) => sum + current.ratings,
            0
          ) / numberOfRatings.count
        ).toFixed(1)
      )
    );
    expect(res.body.data[1].id).to.equal(secondArticle.id);
    expect(res.body.data[1].title).to.equal(secondArticle.title);
    expect(res.body.data[1].username).to.equal(firstUser.username);
    expect(res.body.data[0].id).to.equal(firstArticle.id);
    expect(res.body.data[0].title).to.equal(firstArticle.title);
    expect(res.body.data[0].username).to.equal(firstUser.username);
  });

  it('should return appropriate message if there are no articles', async () => {
    const page = 1;
    const limit = 3;

    const res = await server().get(
      `${ARTICLES_API}/popular?page=${page}&limit=${limit}`
    );
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('There are no articles at the moment');
  });

  it('should return an error if database error occurs', async () => {
    const findAllStub = sinon.stub(BaseRepository, 'findByRatingsAndReviews');
    findAllStub.rejects(new Error('Server Error'));

    const page = 1;
    const limit = 1;
    const res = await server().get(
      `${ARTICLES_API}/popular?page=${page}&limit=${limit}`
    );

    expect(res.status).to.equal(500);
    expect(res.body.message).to.equal('Server Error');

    findAllStub.restore();
  });
});
