import chai from 'chai';
import nock from 'nock';
import app from '../index';

const { expect } = chai;
const API_VERSION = '/api/v1';

describe('SOCIAL LOGIN', () => {
  it('should hit the facebook URL for social login', async () => {
    nock('https://www.facebook.com/')
      .filteringPath(() => '/auth/facebook')
      .get('/auth/facebook')
      .reply(200, { message: 'hit the route' });

    const res = await chai.request(app).get(`${API_VERSION}/auth/facebook`);
    expect(res.body.message).to.include('hit the route');
    expect(res.status).to.eql(200);
  });

  it('should call the facebook call back', async () => {
    nock('https://www.facebook.com/')
      .filteringPath(() => '/auth/facebook/callback')
      .get('/auth/facebook/callback')
      .reply(200, { message: 'hit the route' });

    const res = await chai
      .request(app)
      .get(`${API_VERSION}/auth/facebook/callback`);
    expect(res.body.message).to.include('hit the route');
    expect(res.status).to.eql(200);
  });

  it('should hit the google URL for social login', async () => {
    nock('https://accounts.google.com/')
      .filteringPath(() => `/auth/google`)
      .get('/auth/google')
      .reply(200, { message: 'hit the route' });

    const res = await chai.request(app).get(`${API_VERSION}/auth/google`);
    expect(res.body.message).to.include('hit the route');
    expect(res.status).to.eql(200);
  });

  it('should call the google call back', async () => {
    nock('https://accounts.google.com/')
      .filteringPath(() => '/auth/google/callback')
      .get('/auth/google/callback')
      .reply(200, { message: 'hit the route' });

    const res = await chai
      .request(app)
      .get(`${API_VERSION}/auth/google/redirect`);
    expect(res.body.message).to.include('hit the route');
    expect(res.status).to.eql(200);
  });

  it('should hit the github URL for social login', async () => {
    nock('https://api.github.com/')
      .get('/auth/twitter')
      .reply(200, 'hit the route');

    const res = await chai.request(app).get(`${API_VERSION}/auth/github`);
    expect(res.body).to.an('object');
  });

  it('should call the github call back', async () => {
    nock('https://www.github.com/')
      .get('/auth/github/callback')
      .reply(200, { message: 'hit the route' });

    const res = await chai
      .request(app)
      .get(`${API_VERSION}/auth/github/callback`);
    expect(res.body).to.an('object');
  });
});
