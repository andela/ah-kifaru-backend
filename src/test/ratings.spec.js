import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../index';

chai.use(chaiHttp);
chai.should();

describe('Testing Rating of articles', () => {
  it('it should return a 400 status code if the request is bad', done => {
    chai
      .request(app)
      .post('/api/v1/ratings/:articleId')
      .send({})
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
  });
  it('it should return an relevant error message if the request is bad', done => {
    chai
      .request(app)
      .post(`/api/v1/ratings/:articles`)
      .send({
        rating: faker.random.number({ min: 1, max: 5 })
      })
      .end((error, response) => {
        response.body.message.should.be.a('string');
        done();
      });
  });
  it('it should return status 200 if the request was successful', done => {
    chai
      .request(app)
      .post(`/api/v1/ratings/${1}`)
      .send({
        rating: faker.random.number({ min: 1, max: 5 })
      })
      .end((error, response) => {
        expect(response.body).to.equal(200);
        done();
      });
  });
});
