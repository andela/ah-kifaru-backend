import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../index';

chai.use(chaiHttp);

describe('Test access based control functionality', () => {
  it('should return 401 when user is not an admin or super admin', done => {
    const newUser = {
      email: 'nkkbaby@gmail.com',
      role: 'user',
      id: 1
    };
    const userToken = jwt.sign(newUser, process.env.JWT_SECRET);
    chai
      .request(app)
      .get('/api/v1/users')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('status');
        expect(res.body.error).to.equal(
          'Unauthorized User, Please contact the administrator.'
        );
        done();
      });
  });

  it('should return 200 when user is an admin or super admin', done => {
    const adminUser = {
      email: 'nkky@gmail.com',
      role: 'admin',
      id: 2
    };
    const adminToken = jwt.sign(adminUser, process.env.JWT_SECRET);
    chai
      .request(app)
      .get('/api/v1/users')
      .set('authorization', adminToken)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('status');
        expect(res.body.message).to.equal('Welcome Administrator');
        done();
      });
  });

  it('should return 200 when user is a super admin', done => {
    const superAdminUser = {
      email: 'nkk@gmail.com',
      role: 'superAdmin',
      id: 2
    };
    const superAdminToken = jwt.sign(superAdminUser, process.env.JWT_SECRET);
    chai
      .request(app)
      .delete('/api/v1/users/1')
      .set('authorization', superAdminToken)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('status');
        expect(res.body.message).to.equal('Welcome Super Administrator');
        done();
      });
  });

  it('should return 401 when user is not a super admin', done => {
    const user = {
      email: 'kech3443@gmail.com',
      role: 'user',
      id: 2
    };
    const newUserToken = jwt.sign(user, process.env.JWT_SECRET);
    chai
      .request(app)
      .delete('/api/v1/users/2')
      .set('authorization', newUserToken)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('status');
        expect(res.body.error).to.equal(
          'Unauthorized User, Please contact the administrator.'
        );
        done();
      });
  });
});
