import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../index';
import BaseRepository from '../repository/base.repository';

chai.use(chaiHttp);

describe('Test user login, signup and account verification', () => {
  let validToken;

  describe('POST /auth/signup', () => {
    it('it should create a user account', done => {
      const newUser = {
        email: 'timi.tejumola@andelahub.com',
        username: 'timiosh',
        password: 'password'
      };
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(newUser)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('status');
          expect(res.body.data)
            .to.have.property('status')
            .to.equal('unverified');
          done();
        });
    });

    it('it should throw an error when user with an unverified account wants to signup', done => {
      const newUser = {
        email: 'timi.tejumola@andelahub.com',
        username: 'timiosh',
        password: 'password'
      };
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(newUser)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('status');
          expect(res.body.message).to.equal(
            'This account is already registered. A verification link has been sent to your email. Check your email to continue.'
          );
          done();
        });
    });

    it('it should throw an error when user with an active account tries to signup', done => {
      const newUser = {
        email: 'jonsnow@got.com',
        username: 'timiosh',
        password: 'password'
      };
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(newUser)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('status');
          expect(res.body.message).to.equal(
            'User with this email address already exist'
          );
          done();
        });
    });
  });

  describe('POST /auth/login', () => {
    it('it should throw an error if email address is invalid', done => {
      const user = {
        email: 'sholabolagmail.com',
        password: 'password'
      };
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send(user)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('status');
          expect(res.body.message).to.equal('email must be a valid email');
          done();
        });
    });

    it('it should throw an error if password is not up to 8', done => {
      const user = {
        email: 'sholabola@gmail.com',
        password: 'pass'
      };
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send(user)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('status');
          expect(res.body.message).to.equal(
            'password length must be at least 8 characters long'
          );
          done();
        });
    });

    it('it should throw a wrong credential is passed', done => {
      const user = {
        email: 'sholabola@yahoo.com',
        password: 'password'
      };
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send(user)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('status');
          expect(res.body.message).to.equal('Invalid user credentials.');
          done();
        });
    });

    it('it should login the user into an account', done => {
      const user = {
        email: 'sholabola@gmail.com',
        password: 'password'
      };
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send(user)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('status');
          expect(res.body.data)
            .to.have.property('status')
            .to.equal('active');
          done();
        });
    });

    it('it should throw an error when an unverified user tries to login', done => {
      const newUser = {
        email: 'timi.tejumola@andelahub.com',
        password: 'password'
      };
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send(newUser)
        .end((err, res) => {
          if (!err) {
            validToken = res.body.data.token;
          }
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('status');
          expect(res.body.message).to.equal(
            'Account has not been activated. Kindly check your email address for a verification link.'
          );
          done();
        });
    });
  });

  describe('POST /auth/verify/:token', () => {
    it('it should throw an error if an invalid token is provided', done => {
      const invalidToken = 'jhfhje88e8';
      chai
        .request(app)
        .patch(`/api/v1/auth/verify/${invalidToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('status');
          expect(res.body.message).to.equal('Token is not valid');
          done();
        });
    });

    it('it should verify a user', done => {
      chai
        .request(app)
        .patch(`/api/v1/auth/verify/${validToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('status');
          expect(res.body.message).to.equal('Your account has been activated.');
          done();
        });
    });

    it('should return error if validation token is invalid', done => {
      const findAllStub = sinon.stub(BaseRepository, 'update');
      findAllStub.rejects();
      chai
        .request(app)
        .patch(`/api/v1/auth/verify/${validToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          findAllStub.restore();
          done();
        });
    });

    it('should return an error if database error occurs', done => {
      const findAllStub = sinon.stub(BaseRepository, 'findOneByField');
      findAllStub.rejects();
      chai
        .request(app)
        .patch(`/api/v1/auth/verify/${validToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(500);
          findAllStub.restore();
          done();
        });
    });
  });
});

describe('GET api/v1/users', () => {
  const superAdmin = {
    email: 'jonsnow@got.com',
    password: 'password'
  };

  let superAdminToken;
  before(done => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(superAdmin)
      .end((err, res) => {
        superAdminToken = res.body.data.token;
        done();
      });
  });
  it('should successfully get a list of all users', done => {
    const userUrl = '/api/v1/auth/users';
    chai
      .request(app)
      .get(userUrl)
      .set('Authorization', superAdminToken)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('should not activate a user with an invalid token', done => {
    const userUrl = '/api/v1/auth/users';
    const invalidToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImlhdCI6MTU1NTc3MDA1M30.6J7Lmugkww_bSoqKArodoQM4su96QtUrhxA500OxEpg';
    chai
      .request(app)
      .get(userUrl)
      .set('Authorization', invalidToken)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });
  it('should return error if database error occurs', done => {
    const findAllStub = sinon.stub(BaseRepository, 'findAndCountAll');
    findAllStub.rejects();
    const userUrl = '/api/v1/auth/users';
    chai
      .request(app)
      .get(userUrl)
      .set('Authorization', superAdminToken)
      .end((err, res) => {
        expect(res.status).to.equal(500);
        findAllStub.restore();
        done();
      });
  });
});
