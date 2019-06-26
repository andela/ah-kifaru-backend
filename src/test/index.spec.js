import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);

describe('Testing home endpoint', () => {
  it('It should return status of 200 on successful page load', done => {
    const appUrl = '/';
    chai
      .request(app)
      .get(appUrl)
      .end((error, response) => {
        expect(response.body).to.be.a('object');
        expect(response.status).to.equal(200);
        done();
      });
  });
  it('It should return a message on successful page load', done => {
    const appUrl = '/';
    chai
      .request(app)
      .get(appUrl)
      .end((error, response) => {
        expect(response.body).to.be.a('object');
        expect(response.body.message).to.equal(
          'Welcome to the Kifaru backend page'
        );
        done();
      });
  });
});
