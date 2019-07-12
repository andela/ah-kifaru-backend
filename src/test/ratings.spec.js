import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../index';

chai.use(chaiHttp);
chai.should();

const ratings = {
  ratings: faker.random.number({
    min: 1,
    max: 5
  })
};
describe('PATCH, /api/v1/articles/:articleId/:ratings', () => {
  it('it should return a 400 status code if the token was not set with relevant error message', done => {
    chai
      .request(app)
      .patch('/api/v1/articles/:id/ratings')
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          'Please assign a access token as header'
        );
        done();
      });
  });
  it('it should return an relevant error message if the article Id is not valid', done => {
    chai
      .request(app)
      .patch(`/api/v1/articles/${'foo'}/ratings`)
      .set('x-access-token', process.env.TEST_TOKEN)
      .end((error, response) => {
        response.body.message.should.be.a('string');
        expect(response.body.message).to.equal('id must be a number');
        done();
      });
  });
  it('it should return an relevant error message if the ratings passed is not a number', done => {
    chai
      .request(app)
      .patch(`/api/v1/articles/${3}/ratings`)
      .set('x-access-token', process.env.TEST_TOKEN)
      .send({ ratings: 'free' })
      .end((error, response) => {
        expect(response.body.status).to.equal('validation error');
        response.body.message.should.be.a('string');
        expect(response.body.message).to.equal('ratings must be a number');
        done();
      });
  });
  it('it should return status 200 if the request was successful', done => {
    chai
      .request(app)
      .patch(`/api/v1/articles/${1}/ratings`)
      .set('x-access-token', process.env.TEST_TOKEN)
      .send(ratings)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body.data.ratings).to.equal(ratings.ratings);
        expect(response.body.data.articleId).to.equal(1);
        done();
      });
  });
  it('Should return message if the article to be rated was not found', done => {
    chai
      .request(app)
      .patch(`/api/v1/articles/${10}/ratings`)
      .set('x-access-token', process.env.TEST_TOKEN)
      .send(ratings)
      .end((error, response) => {
        expect(response.body.message).to.have.equal('Article does not exist');
        done();
      });
  });
});
