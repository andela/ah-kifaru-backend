import chai from 'chai';
import dotenv from 'dotenv';
import chaiHttp from 'chai-http';
import app from '../index';
import generateToken from '../helpers/generateToken';
import helpers from '../helpers/helpers';

dotenv.config();
chai.use(chaiHttp);

const { should, expect } = chai;
should();

describe('TEST ALL ENDPOINT', () => {
  describe('Initial testing', () => {
    it('should return welcome to sims', done => {
      chai
        .request(app)
        .get('/')
        .end((err, res) => {
          res.body.should.be.an('object');
          res.body.message.should.eql('Welcome to the Kifaru backend page');
          done();
        });
    });
  });

  describe('TESTING HELPERS FUNCTION', () => {
    it('should validate password', () => {
      const value = helpers.validPassword('PassWord');
      expect(value.valid).to.equal(true);
    });
  });
});

describe('Password reset test', () => {
  it('should return success message', done => {
    chai
      .request(app)
      .post('/api/v1/auth/reset-password')
      .send({
        email: 'olorunwalawrence5@gmail.com'
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message');
        res.body.message.should.be.equal(
          'Password reset link has been sent to your email'
        );
        done();
      });
  });

  it('should return invalid credentials', done => {
    chai
      .request(app)
      .post('/api/v1/auth/reset-password')
      .send({
        email: '@gmail.com'
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property('message');
        res.body.message.should.be.equal('Invalid credentials supplied');
        done();
      });
  });

  it('should return invalid credentials', done => {
    const token = generateToken(600, {
      id: 1,
      updatedAt: '2019-09-06 14:34:18.664+01'
    });
    chai
      .request(app)
      .put(`/api/v1/auth/reset-password/${token}`)
      .send({
        password: 'johndoe'
      })
      .end((err, res) => {
        res.body.should.be.an('object');
        res.should.have.status(400);
        res.body.should.have.property('messages');
        done();
      });
  });

  describe('Password reset test', () => {
    it('should return invalid credentials', done => {
      const token = generateToken(600, {
        id: 1,
        updatedAt: '2019-09-06 14:34:18.664+01'
      });
      chai
        .request(app)
        .put(`/api/v1/auth/reset-password/${token}`)
        .send({
          password: 'johndoe'
        })
        .end((err, res) => {
          res.body.should.be.an('object');
          res.should.have.status(400);
          res.body.should.have.property('messages');
          done();
        });
    });
  });

  it('reset password properties incomplete', done => {
    const token = generateToken(600, {
      id: 1,
      updatedAt: '2019-09-06 14:34:18.664+01'
    });
    chai
      .request(app)
      .put(`/api/v1/auth/reset-password/${token}`)
      .send({})
      .end((err, res) => {
        res.body.should.be.an('object');
        res.should.have.status(400);
        res.body.should.have.property('messages');
        done();
      });
  });

  it('reset password properties incomplete', done => {
    const token = generateToken(600, {
      id: 1,
      updatedAt: '2019-07-06 14:34:18.664+01'
    });
    chai
      .request(app)
      .put(`/api/v1/auth/reset-password/${token}`)
      .send({
        password: 'adebncxsdds'
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('messages');

        done();
      });
  });
  it('should return password reset successful', done => {
    const token = generateToken(600, {
      id: 1,
      isVerified: true,
      updatedAt: '2019-07-01'
    });
    chai
      .request(app)
      .put(`/api/v1/auth/reset-password/${token}`)
      .send({
        password: 'Userboyboy'
      })
      .end((err, res) => {
        res.body.should.be.an('object');
        res.should.have.status(401);
        res.body.should.have.property('message');
        res.body.message.should.equal('Verification link not valid');
        done();
      });
  });
});
