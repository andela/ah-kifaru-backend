import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../index';
import BaseRepository from '../repository/base.repository';
import { createUser } from './utils/helpers';
import db from '../database/models';
import helper from '../helpers/utils';

const USER_API = '/api/v1/users';

chai.use(chaiHttp);

const server = () => chai.request(app);

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
  it('should successfully get a list of all users', done => {
    const userUrl = '/api/v1/auth/users';
    chai
      .request(app)
      .get(userUrl)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data).to.have.lengthOf(4);
        done();
      });
  });
});

it('should return error if database error occurs', done => {
  const findAllStub = sinon.stub(BaseRepository, 'findAndCountAll');
  findAllStub.rejects();
  const userUrl = '/api/v1/auth/users';
  chai
    .request(app)
    .get(userUrl)
    .end((err, res) => {
      expect(res.status).to.equal(500);
      findAllStub.restore();
      done();
    });
});

describe('PATCH api/v1/users/follow', () => {
  beforeEach(async () => {
    await db.User.destroy({ cascade: true, truncate: true });
  });

  it('should follow another user', async () => {
    const firstUser = await createUser();
    const secondUser = await createUser();
    await createUser();
    const token = helper.jwtSigner(firstUser);

    const currentNumberOfFollowing = await BaseRepository.findAll(db.Follower, {
      followerId: firstUser.id
    });
    expect(currentNumberOfFollowing.length).to.equal(0);

    const res = await server()
      .patch(`${USER_API}/follow`)
      .set('token', token)
      .send({ followeeId: secondUser.id });
    expect(res.status).to.equal(200);

    const newNumberOfFollowing = await BaseRepository.findAll(db.Follower, {
      followerId: firstUser.id
    });
    expect(newNumberOfFollowing.length).to.equal(1);
    expect(newNumberOfFollowing[0].followerId).to.equal(firstUser.id);
    expect(newNumberOfFollowing[0].followeeId).to.equal(secondUser.id);
  });

  it('should not follow the same user twice', async () => {
    const firstUser = await createUser();
    const secondUser = await createUser();
    await createUser();
    const token = helper.jwtSigner(firstUser);

    const currentNumberOfFollowing = await BaseRepository.findAll(db.Follower, {
      followerId: firstUser.id
    });
    expect(currentNumberOfFollowing.length).to.equal(0);

    await server()
      .patch(`${USER_API}/follow`)
      .set('token', token)
      .send({ followeeId: secondUser.id });

    const newNumberOfFollowing = await BaseRepository.findAll(db.Follower, {
      followerId: firstUser.id
    });
    expect(newNumberOfFollowing.length).to.equal(1);
    expect(newNumberOfFollowing[0].followerId).to.equal(firstUser.id);
    expect(newNumberOfFollowing[0].followeeId).to.equal(secondUser.id);

    const res = await server()
      .patch(`${USER_API}/follow`)
      .set('token', token)
      .send({ followeeId: secondUser.id });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal(
      `You were already following the user with id = ${secondUser.id}`
    );

    const latestNumberOfFollowing = await BaseRepository.findAll(db.Follower, {
      followerId: firstUser.id
    });
    expect(latestNumberOfFollowing.length).to.equal(1);
    expect(newNumberOfFollowing[0].followerId).to.equal(firstUser.id);
    expect(newNumberOfFollowing[0].followeeId).to.equal(secondUser.id);
  });

  it('should throw validation error if the followeeId is not a number', async () => {
    const firstUser = await createUser();
    await createUser();
    const token = helper.jwtSigner(firstUser);

    const numberOfFollowing = await BaseRepository.findAll(db.Follower, {
      followerId: firstUser.id
    });
    expect(numberOfFollowing.length).to.equal(0);

    const res = await server()
      .patch(`${USER_API}/follow`)
      .set('token', token)
      .send({ followeeId: '' });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('followeeId must be a number');

    const newNumberOfFollowing = await BaseRepository.findAll(db.Follower, {
      followerId: firstUser.id
    });
    expect(newNumberOfFollowing.length).to.equal(0);
  });

  it('should not follow a non-existing user', async () => {
    const firstUser = await createUser();
    await createUser();
    const token = helper.jwtSigner(firstUser);
    const numberOfFollowing = await BaseRepository.findAll(db.Follower, {
      followerId: firstUser.id
    });
    expect(numberOfFollowing.length).to.equal(0);

    const res = await server()
      .patch(`${USER_API}/follow`)
      .set('token', token)
      .send({ followeeId: 8053032 });
    expect(res.status).to.equal(400);

    const newNumberOfFollowing = await BaseRepository.findAll(db.Follower, {
      followerId: firstUser.id
    });
    expect(newNumberOfFollowing.length).to.equal(0);
  });
});

describe('PATCH /api/v1/unfollow', () => {
  beforeEach(async () => {
    await db.User.destroy({ cascade: true, truncate: true });
  });

  it('should unfollow a user', async () => {
    const firstUser = await createUser();
    const secondUser = await createUser();
    const token = helper.jwtSigner(firstUser);

    await server()
      .patch(`${USER_API}/follow`)
      .set('token', token)
      .send({ followeeId: secondUser.id });

    const numberOfFollowing = await BaseRepository.findAll(db.Follower, {
      followerId: firstUser.id
    });
    expect(numberOfFollowing.length).to.equal(1);
    expect(numberOfFollowing[0].followeeId).to.equal(secondUser.id);
    expect(numberOfFollowing[0].followerId).to.equal(firstUser.id);

    const res = await server()
      .patch(`${USER_API}/unfollow`)
      .set('token', token)
      .send({ followeeId: secondUser.id });
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal(
      `You have succesfully unfollowed user with id =${secondUser.id}`
    );

    const currentNumberOfFollowing = await BaseRepository.findAll(db.Follower, {
      followerId: firstUser.id
    });
    expect(currentNumberOfFollowing.length).to.equal(0);
  });

  it('should not unfollow itself', async () => {
    const firstUser = await createUser();

    const token = helper.jwtSigner(firstUser);

    const numberOfFollowing = await BaseRepository.findAll(db.Follower, {
      followerId: firstUser.id
    });
    expect(numberOfFollowing.length).to.equal(0);

    const res = await server()
      .patch(`${USER_API}/unfollow`)
      .set('token', token)
      .send({ followeeId: firstUser.id });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal(`You cannot follow or unfollow yourself`);

    const currentNumberOfFollowing = await BaseRepository.findAll(db.Follower, {
      followerId: firstUser.id
    });
    expect(currentNumberOfFollowing.length).to.equal(0);
  });

  it('should not unfollow a user it was not following', async () => {
    const firstUser = await createUser();
    const secondUser = await createUser();

    const token = helper.jwtSigner(firstUser);

    const numberOfFollowing = await BaseRepository.findAll(db.Follower, {
      followerId: firstUser.id
    });
    expect(numberOfFollowing.length).to.equal(0);

    const res = await server()
      .patch(`${USER_API}/unfollow`)
      .set('token', token)
      .send({ followeeId: secondUser.id });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal(`You were not following this user`);

    const currentNumberOfFollowing = await BaseRepository.findAll(db.Follower, {
      followerId: firstUser.id
    });
    expect(currentNumberOfFollowing.length).to.equal(0);
  });
});
