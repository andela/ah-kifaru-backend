import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import { config } from 'dotenv';
import app from '../index';

import { articleTag } from '../helpers/tagArticle';
import BaseRepository from '../repository/base.repository';
import {
  getUser,
  createUser,
  createArticle,
  generateArticle
} from './utils/helpers';
import db from '../database/models';
import helper from '../helpers/utils';

const TAGS_API = '/api/v1/tags';

config();
chai.use(chaiHttp);

const server = () => chai.request(app);

describe('Unit test for article tag function', () => {
  beforeEach(async () => {
    await db.Article.destroy({ cascade: true, truncate: true });
    await db.User.destroy({ cascade: true, truncate: true });
    await db.Follower.destroy({ cascade: true, truncate: true });
    await db.Tags.destroy({ cascade: true, truncate: true });
    await db.ArticleTags.destroy({ cascade: true, truncate: true });
  });
  it('Returns an array of the tags id added to article with article id', async () => {
    const firstUser = await createUser();
    const newArticle = await generateArticle({ authorId: firstUser.id });
    const createdArticle = await createArticle(newArticle);
    const taggedArticle = await articleTag(
      'Angular etherium blockchain',
      createdArticle.id
    );
    const tagged = await BaseRepository.findAndCountAll(db.ArticleTags, {});
    expect(tagged.count).to.equal(taggedArticle.length);
  });
});

describe('PUT /api/v1/tags/create', () => {
  beforeEach(async () => {
    await db.Tags.destroy({ cascade: true, truncate: true });
    await db.User.destroy({ cascade: true, truncate: true });
  });
  it('Returns 400 and error message if token was not provided', async () => {
    const res = await server()
      .put(`${TAGS_API}/create`)
      .send({ tag: ['Vue', 'javaScript'] });
    expect(res.status).to.deep.equal(400);
    expect(res.body.message).to.deep.equal('Invalid access token');
  });
  it('Returns 401 and error message if token provided was not valid', async () => {
    const token = 'yeah.letsBreak.theServer';
    const res = await server()
      .put(`${TAGS_API}/create`)
      .set('x-access-token', token)
      .send({ tag: ['Vue', 'javaScript'] });
    expect(res.status).to.deep.equal(401);
    expect(res.body.message).to.deep.equal('Token is not valid');
  });
  it('Returns 400 and error message if the tag passed is not a string', async () => {
    const user = await createUser(await getUser());
    const token = await helper.jwtSigner(user);
    const res = await server()
      .put(`${TAGS_API}/create`)
      .set('x-access-token', token)
      .send({ tag: ['Vue', 'javaScript'] });
    expect(res.status).to.deep.equal(400);
    expect(res.body.message).to.deep.equal(
      'Tag must be provided and should contain only letters'
    );
  });
  it('Returns 201 if tag was created', async () => {
    const user = await createUser(await getUser());
    const token = await helper.jwtSigner(user);
    const res = await server()
      .put(`${TAGS_API}/create`)
      .set('x-access-token', token)
      .send({ tag: 'javaScript' });
    expect(res.status).to.deep.equal(201);
    expect(res.body.message).to.deep.equal('Tag has been created');
    expect(res.body.data.name).to.deep.equal('javaScript');
  });
  it('Returns 200 if tag to be created exists', async () => {
    const user = await createUser(await getUser());
    const token = await helper.jwtSigner(user);
    const createdTag = await BaseRepository.create(db.Tags, {
      name: 'javaScript'
    });
    const res = await server()
      .put(`${TAGS_API}/create`)
      .set('x-access-token', token)
      .send({ tag: 'javaScript' });
    expect(res.status).to.deep.equal(200);
    expect(res.body.data.id).to.deep.equal(createdTag.id);
    expect(res.body.message).to.deep.equal('Tag exists');
    expect(res.body.data.name).to.deep.equal(createdTag.name);
  });
  it('Returns 500 if server error occurs', async () => {
    const user = await createUser(await getUser());
    const token = await helper.jwtSigner(user);
    const findStub = await sinon
      .stub(BaseRepository, 'findOrCreate')
      .rejects(new Error('Server not found'));
    const res = await server()
      .put(`${TAGS_API}/create`)
      .set('x-access-token', token)
      .send({ tag: 'javaScript' });
    expect(res.status).to.deep.equal(500);
    expect(res.body.message).to.deep.equal('Server not found');
    findStub.restore();
  });
});

describe('DELETE /api/v1/tags/delete', () => {
  beforeEach(async () => {
    await db.Tags.destroy({ cascade: true, truncate: true });
    await db.User.destroy({ cascade: true, truncate: true });
  });
  it('Returns 400 and error message if token was not provided', async () => {
    const res = await server().delete(`${TAGS_API}/:id/delete`);
    expect(res.status).to.deep.equal(400);
    expect(res.body.message).to.deep.equal('Invalid access token');
  });
  it('Returns 401 and error message if token provided was not valid', async () => {
    const token = 'yeah.letsBreak.theServer';
    const res = await server()
      .delete(`${TAGS_API}/:id/delete`)
      .set('x-access-token', token);
    expect(res.status).to.deep.equal(401);
    expect(res.body.message).to.deep.equal('Token is not valid');
  });
  it('Returns 403 and error message if the user is not a superadmin', async () => {
    const user = await createUser(await getUser());
    const token = await helper.jwtSigner(user);
    const res = await server()
      .delete(`${TAGS_API}/${'men'}/delete`)
      .set('x-access-token', token);
    expect(res.status).to.deep.equal(403);
    expect(res.body.message).to.deep.equal(
      'Unauthorized User, Please contact the administrator.'
    );
  });
  it('Returns 400 and error message if the tag id is invalid', async () => {
    const userData = await getUser();
    userData.role = 'superadmin';
    const user = await createUser(userData);
    const token = await helper.jwtSigner(user);
    const res = await server()
      .delete(`${TAGS_API}/${'men'}/delete`)
      .set('x-access-token', token);
    expect(res.status).to.deep.equal(400);
    expect(res.body.message).to.deep.equal(
      'Invalid tag id. Tag id must be a non-zero positive integer'
    );
  });
  it('Returns 200 if tag to was deleted', async () => {
    const userData = await getUser();
    userData.role = 'superadmin';
    const user = await createUser(userData);
    const token = await helper.jwtSigner(user);
    const createdTag = await BaseRepository.create(db.Tags, {
      name: 'javaScript'
    });
    const res = await server()
      .delete(`${TAGS_API}/${createdTag.id}/delete`)
      .set('x-access-token', token);
    const deletedTag = await BaseRepository.findOneByField(db.Tags, {
      name: 'javaScript'
    });
    expect(deletedTag).to.deep.equal(null);
    expect(res.status).to.deep.equal(200);
    expect(res.body.message).to.deep.equal('Tag successfully deleted');
  });
  it('Returns 500 if server error occurs', async () => {
    const userData = await getUser();
    userData.role = 'superadmin';
    const user = await createUser(userData);
    const token = await helper.jwtSigner(user);
    const findStub = await sinon
      .stub(BaseRepository, 'remove')
      .rejects(new Error('Server not found'));
    const res = await server()
      .delete(`${TAGS_API}/${1}/delete`)
      .set('x-access-token', token);
    expect(res.status).to.deep.equal(500);
    expect(res.body.message).to.deep.equal('Server not found');
    findStub.restore();
  });
});

describe('GET api/v1/tags', () => {
  beforeEach(async () => {
    await db.Article.destroy({ cascade: true, truncate: true });
    await db.User.destroy({ cascade: true, truncate: true });
    await db.Tags.destroy({ cascade: true, truncate: true });
  });

  it('should get a list of all tags', async () => {
    const user = await createUser(await getUser());
    const token = await helper.jwtSigner(user);
    const createdTag = await BaseRepository.create(db.Tags, {
      name: 'javaScript'
    });
    const numberOfTags = await BaseRepository.findAndCountAll(db.Tags);
    expect(numberOfTags.count).to.equal(1);
    const response = await server()
      .get(`${TAGS_API}`)
      .set('x-access-token', token);
    expect(response.status).to.equal(200);
    expect(response.body.data).to.be.an('array');
    expect(response.body.data).to.have.lengthOf(1);
    expect(response.body.data[0].id).to.equal(createdTag.id);
  });

  it('should list tags with pagaination', async () => {
    const user = await createUser(await getUser());
    const token = await helper.jwtSigner(user);

    await BaseRepository.create(db.Tags, {
      name: 'javaScript'
    });
    await BaseRepository.create(db.Tags, {
      name: 'Vue'
    });
    await BaseRepository.create(db.Tags, {
      name: 'Babel'
    });
    await BaseRepository.create(db.Tags, {
      name: '`node`'
    });
    await BaseRepository.create(db.Tags, {
      name: 'postgresql'
    });

    const numberOfTags = await BaseRepository.findAndCountAll(db.Tags);
    expect(numberOfTags.count).to.equal(5);

    const page = 2;
    const limit = 2;
    const response = await server()
      .get(`${TAGS_API}?page=${page}&limit=${limit}`)
      .set('x-access-token', token);
    expect(response.status).to.equal(200);
    expect(response.body.data).to.be.an('array');
    expect(response.body.data[0]).to.not.equal(response.body.data[1]);
    expect(response.body.metadata.prev).to.equal(`${TAGS_API}?page=1&limit=2`);
    expect(response.body.metadata.currentPage).to.equal(2);
    expect(response.body.metadata.next).to.equal(`${TAGS_API}?page=3&limit=2`);
    expect(response.body.metadata.totalPages).to.equal(3);
    expect(response.body.metadata.totalItems).to.equal(5);
  });

  it('Returns 500 if server error occurs', async () => {
    const user = await createUser(await getUser());
    const token = await helper.jwtSigner(user);
    const findStub = await sinon
      .stub(BaseRepository, 'findAndCountAll')
      .rejects(new Error('Server not found'));
    const res = await server()
      .get(`${TAGS_API}`)
      .set('x-access-token', token);
    expect(res.status).to.deep.equal(500);
    expect(res.body.message).to.deep.equal('Server not found');
    findStub.restore();
  });
});
