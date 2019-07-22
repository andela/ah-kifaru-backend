import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../index';
import BaseRepository from '../repository/base.repository';
import { createUser, createArticle, generateArticle } from './utils/helpers';
import db from '../database/models';
import helper from '../helpers/utils';

const SEARCH_API = '/api/v1/search';

chai.use(chaiHttp);

const server = () => chai.request(app);

describe('GET api/v1/search', () => {
  beforeEach(async () => {
    await db.Article.destroy({ cascade: true, truncate: true });
    await db.User.destroy({ cascade: true, truncate: true });
  });

  it('should search for articles by author', async () => {
    const firstUser = await createUser();
    await createArticle(await generateArticle({ authorId: firstUser.id }));

    const confirmAuthor = await BaseRepository.findItAll(db.User);
    expect(confirmAuthor[0].username).to.equal(firstUser.username);

    const token = helper.jwtSigner(firstUser);

    const res = await server()
      .get(`${SEARCH_API}/${firstUser.username}`)
      .set('token', token);
    expect(res.status).to.equal(200);
    expect(res.body.data).to.be.an('array');
    expect(res.body.data[0].id).to.equal(firstUser.id);
    expect(res.body.data[0].bio).to.equal(firstUser.bio);
    expect(res.body.data[0].email).to.equal(firstUser.email);
    expect(res.body.data[0].bio).to.equal(firstUser.bio);
    expect(res.body.data[0].avatar).to.equal(firstUser.avatar);
    expect(
      res.body.data[0].Articles.every(
        article => article.authorId === firstUser.id
      )
    );
    expect(res.body.data[0].Articles.length).to.equal(1);
  });

  it('should fetch articles that belong to similar authors', async () => {
    const theUser1 = {
      username: 'onyimatics',
      email: 'nkkybaby@gmail.com',
      avatar: 'seniordev.jpg',
      password: 'seniordev123',
      role: 'user',
      active: 'verified'
    };
    const theUser2 = {
      username: 'onyimatics',
      email: 'onyimatics@gmail.com',
      avatar: 'finegirl.jpg',
      password: 'finegirl123',
      role: 'user',
      active: 'verified'
    };
    const firstUser = await createUser(theUser1);
    const secondUser = await createUser(theUser2);
    await createArticle(await generateArticle({ authorId: firstUser.id }));
    await createArticle(await generateArticle({ authorId: firstUser.id }));
    await createArticle(await generateArticle({ authorId: firstUser.id }));
    await createArticle(await generateArticle({ authorId: secondUser.id }));
    await createArticle(await generateArticle({ authorId: secondUser.id }));

    const numberOfUsers = await BaseRepository.findItAll(db.User);
    expect(numberOfUsers[0].username).to.equal(firstUser.username);
    expect(numberOfUsers[1].username).to.equal(secondUser.username);

    const token = helper.jwtSigner(firstUser);

    const res = await server()
      .get(`${SEARCH_API}/${firstUser.username}`)
      .set('token', token);
    expect(res.status).to.equal(200);
    expect(res.body.data).to.be.an('array');
    expect(res.body.data[0].id).to.equal(firstUser.id);
    expect(res.body.data[0].bio).to.equal(firstUser.bio);
    expect(res.body.data[0].email).to.equal(firstUser.email);
    expect(res.body.data[0].bio).to.equal(firstUser.bio);
    expect(res.body.data[0].avatar).to.equal(firstUser.avatar);
    expect(
      res.body.data[0].Articles.every(
        article => article.authorId === firstUser.id
      )
    );
    expect(res.body.data[0].Articles.length).to.equal(3);
    expect(res.body.data[1].Articles.length).to.equal(2);
  });

  it('should return an error message if no author is found', async () => {
    const firstUser = await createUser();
    await createArticle(await generateArticle({ authorId: firstUser.id }));

    const confirmAuthor = await BaseRepository.findItAll(db.User);
    expect(confirmAuthor[0].username).to.equal(firstUser.username);

    const token = helper.jwtSigner(firstUser);

    const res = await server()
      .get(`${SEARCH_API}/gfhfcgd`)
      .set('token', token);
    expect(res.status).to.equal(404);
    expect(res.body.message).to.equal('No article or author found');
  });

  it('should return an error message if no article is found', async () => {
    const firstUser = await createUser();
    const confirmAuthor = await BaseRepository.findItAll(db.User);
    expect(confirmAuthor[0].username).to.equal(firstUser.username);

    const token = helper.jwtSigner(firstUser);

    const res = await server()
      .get(`${SEARCH_API}/${firstUser.username}`)
      .set('token', token);
    expect(res.status).to.equal(200);
    expect(res.body.data[0].Articles.length).to.equal(0);
  });

  it('should return error if database error occurs', async () => {
    const firstUser = await createUser();
    await createArticle(await generateArticle({ authorId: firstUser.id }));
    const findAllStub = sinon.stub(BaseRepository, 'findItAll');
    findAllStub.rejects();

    const token = helper.jwtSigner(firstUser);

    const res = await server()
      .get(`${SEARCH_API}/${firstUser.username}`)
      .set('token', token);
    expect(res.status).to.equal(200);
    findAllStub.restore();
  });
});
