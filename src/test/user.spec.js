import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import db from '../database/models';
import { getUser } from './utils/helpers';

const users = '/api/v1/users';

chai.use(chaiHttp);

describe('Users functionality', async () => {
  const user = await createUser(getUser());

  // need the access token here

  it('should be able existing users', done => {
    chai
      .request(app)
      .get(`${users}/follow/1`)
      .end((req, res) => {
        expect(res.status).to.equal(200);

        done();
      });
  });
});
