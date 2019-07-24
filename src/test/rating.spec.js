import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import sign from '../helpers/utils';
import db from '../database/models';
import BaseRepository from '../repository/base.repository';
import {
  generateArticle,
  ratings,
  createUser,
  createArticle,
  rateArticle
} from './utils/helpers';

const ARTICLE_API = '/api/v1/articles';

const server = () => chai.request(app);

chai.use(chaiHttp);
chai.should();

const { User, Article, Rating } = db;

describe('PATCH, /api/v1/articles/:id/ratings', () => {
  beforeEach(async () => {
    await User.destroy({ truncate: true, cascade: true });
    await Rating.destroy({ truncate: true, cascade: true });
    await Article.destroy({ truncate: true, cascade: true });
  });

  it('Returns a 400 status code and an error message if the token was not set', done => {
    chai
      .request(app)
      .patch('/api/v1/articles/:articleId/ratings')
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('Invalid access token');
        done();
      });
  });

  it('Returns an error message if the article Id is not valid', async () => {
    const newUser = await createUser();
    const token = sign.jwtSigner(newUser);

    const response = await chai
      .request(app)
      .patch(`/api/v1/articles/${'foo'}/ratings`)
      .send(ratings)
      .set('x-access-token', token);
    expect(response.body.message).to.equal('articleId must be a number');
  });

  it('Returns an error message if the ratings passed is not a number', async () => {
    const newUser = await createUser();
    const token = sign.jwtSigner(newUser);

    const response = await chai
      .request(app)
      .patch(`/api/v1/articles/${1}/ratings`)
      .set('x-access-token', token)
      .send({ ratings: 'free' });
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal(
      'ratings must be a number between 1 and 5'
    );
  });

  it('Returns a 403 if an author tries ratings his/her article', async () => {
    const newUser = await createUser();
    const token = sign.jwtSigner(newUser);
    const article = await generateArticle({ authorId: newUser.id });
    const createdArticle = await createArticle(article);
    const initialRating = await BaseRepository.findRawAndCountAll(Rating, {});
    expect(newUser.id).to.equal(createdArticle.authorId);
    const response = await chai
      .request(app)
      .patch(`/api/v1/articles/${createdArticle.id}/ratings`)
      .set('x-access-token', token)
      .send(ratings);
    expect(response.status).to.equal(403);
    expect(response.body.message).to.equal('You cannot rate your article');
    const finalRating = await BaseRepository.findRawAndCountAll(Rating, {});
    expect(initialRating.count).to.equal(finalRating.count);
  });

  it('Should return status 200 if the request was successful', async () => {
    const newUser = await createUser();
    const token = sign.jwtSigner(newUser);
    const secondUser = await createUser();
    const article = await generateArticle({ authorId: secondUser.id });
    const createdArticle = await createArticle(article);
    expect(secondUser.id).to.equal(createdArticle.authorId);
    const response = await chai
      .request(app)
      .patch(`/api/v1/articles/${createdArticle.id}/ratings`)
      .set('x-access-token', token)
      .send(ratings);
    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Article Rated Successfully');

    const numberOfRatings = await BaseRepository.findAll(Rating, {});
    expect(numberOfRatings.length).to.equal(1);
  });

  it('Should return status 200 if an existing rating was updated successfully', async () => {
    const firstUser = await createUser();
    const token = sign.jwtSigner(firstUser);

    const secondUser = await createUser();
    const article = await generateArticle({ authorId: secondUser.id });

    const theCreatedArticle = await createArticle(article);
    expect(secondUser.id).to.equal(theCreatedArticle.authorId);
    await rateArticle({
      articleId: theCreatedArticle.id,
      userId: firstUser.id,
      ratings: 5
    });
    const response = await chai
      .request(app)
      .patch(`/api/v1/articles/${theCreatedArticle.id}/ratings`)
      .set('x-access-token', token)
      .send({ ratings: 3 });
    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Article Rated Successfully');

    const numberOfRatings = await BaseRepository.findAll(Rating, {});
    expect(numberOfRatings.length).to.equal(1);
  });

  it('Should return message if the article to be rated was not found', async () => {
    const newUser = await createUser();
    const token = sign.jwtSigner(newUser);
    const response = await chai
      .request(app)
      .patch(`/api/v1/articles/${1}/ratings`)
      .set('x-access-token', token)
      .send(ratings);
    expect(response.status).to.equal(404);
    expect(response.body.message).to.have.equal(
      'The requested article was not found'
    );
  });
});

describe('GET api/v1/article/:articleId/ratings', () => {
  beforeEach(async () => {
    await db.User.destroy({ cascade: true, truncate: true });
    await db.Article.destroy({ cascade: true, truncate: true });
    await db.Rating.destroy({ cascade: true, truncate: true });
  });

  it('should get article ratings', async () => {
    const firstUser = await createUser();
    const secondUser = await createUser();
    const thirdUser = await createUser();
    const fourthUser = await createUser();
    const fifthUser = await createUser();

    const article = await createArticle(
      await generateArticle({ authorId: firstUser.id })
    );
    await rateArticle({
      articleId: article.id,
      userId: secondUser.id,
      ratings: 5
    });
    await rateArticle({
      articleId: article.id,
      userId: thirdUser.id,
      ratings: 3
    });
    await rateArticle({
      articleId: article.id,
      userId: fourthUser.id,
      ratings: 4
    });
    await rateArticle({
      articleId: article.id,
      userId: fifthUser.id,
      ratings: 1
    });

    const numberOfRatings = await BaseRepository.findRawAndCountAll(db.Rating, {
      articleId: article.id
    });

    const res = await server().get(`${ARTICLE_API}/ratings/${article.id}`);
    expect(res.status).to.equal(200);
    expect(Number(`${res.body.data.totalNumberOfRatings}`)).to.equal(
      Number(`${numberOfRatings.count}`)
    );
    expect(Number(`${res.body.data.averageRating}`)).to.equal(
      Number(
        (
          numberOfRatings.rows.reduce(
            (sum, current) => sum + current.ratings,
            0
          ) / numberOfRatings.count
        ).toFixed(1)
      )
    );
    expect(res.body.data.articleId).to.equal(article.id);
  });

  it('should not get ratings if article has not been rated', async () => {
    const firstUser = await createUser();

    const article = await createArticle(
      await generateArticle({ authorId: firstUser.id })
    );

    const res = await server().get(`${ARTICLE_API}/ratings/${article.id}`);

    expect(res.status).to.equal(404);
    expect(res.body.message).to.equal('This article has not been rated yet');
  });

  it('should return 404 if article does not exist', async () => {
    const res = await server().get(`${ARTICLE_API}/ratings/9000000`);
    expect(res.status).to.equal(404);
    expect(res.body.message).to.equal('The requested article was not found');
  });
});
