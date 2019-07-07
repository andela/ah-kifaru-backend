import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import { fake } from 'sinon';
import app from '../index';

chai.use(chaiHttp);
chai.should();

describe('Testing Rating of articles', () => {
  it('it should return a 400 status code if the request is bad', done => {
    chai
      .request(app)
      .patch('/api/v1/articles/:articleId/:rating')
      .send({})
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
  });
  it('it should return an relevant error message if the request is bad', done => {
    chai
      .request(app)
      .patch(`/api/v1/articles/:articles/:rating`)
      .send({
        rating: faker.random.number({ min: 1, max: 5 })
      })
      .end((error, response) => {
        response.body.message.should.be.a('string');
        done();
      });
  });
  it('it should return status 200 if the request was successful', async () => {
    const response = await chai
      .request(app)
      .patch(`/api/v1/articles/${1}/${4}`);
    expect(response.status).to.equal(200);
  });
  it('Should return message if the article to be rated was not found', async () => {
    const response = await chai
      .request(app)
      .patch(`/api/v1/articles/${4}/${3}`);
    expect(response.body.data).to.have.equal('Article does not exist');
  });
  it('Should return a status 500 if server error', done => {
    const response = fake.resolves(500);
    expect(response).to.equal(500);
    done();
  });
});
