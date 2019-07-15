import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import BaseRepository from '../repository/base.repository';
import { createUser, createArticle, generateArticle } from './utils/helpers';
import db from '../database/models';
import helper from '../helpers/utils';

const ARTICLES_API = '/api/v1/articles';

chai.use(chaiHttp);

const server = () => chai.request(app);

describe('PATCH api/v1/articles/bookmark', () => {
  beforeEach(async () => {
    await db.Bookmark.destroy({ cascade: true, truncate: true });
    await db.User.destroy({ cascade: true, truncate: true });
  });

  it('should bookmark an article', async () => {
    const firstUser = await createUser();
    const secondUser = await createUser();
    const theArticle = await createArticle(
      await generateArticle({ authorId: secondUser.id })
    );
    const numberOfArticles = await BaseRepository.findAll(db.Article);
    const numberOfBookmarks = await BaseRepository.findAndCountAll(
      db.Bookmark,
      {
        userId: firstUser.id
      }
    );
    const token = helper.jwtSigner(firstUser);
    expect(numberOfArticles.length).to.equal(1);
    expect(numberOfBookmarks.count).to.equal(0);

    const res = await server()
      .patch(`${ARTICLES_API}/bookmark`)
      .set('token', token)
      .send({ articleId: theArticle.id });
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Article Bookmarked successfully');

    const allUserBookmarks = await BaseRepository.findAll(db.Bookmark, {
      userId: firstUser.id
    });
    expect(allUserBookmarks.length).to.equal(1);
    expect(allUserBookmarks[0].articleId).to.equal(theArticle.id);
  });

  it('should remove a bookmark', async () => {
    const firstUser = await createUser();
    const secondUser = await createUser();
    const theArticle = await createArticle(
      await generateArticle({ authorId: secondUser.id })
    );
    await BaseRepository.create(db.Bookmark, {
      userId: firstUser.id,
      articleId: theArticle.id
    });
    const numberOfBookmarks = await BaseRepository.findAll(db.Bookmark, {
      userId: firstUser.id
    });

    const token = helper.jwtSigner(firstUser);
    expect(numberOfBookmarks.length).to.equal(1);

    const res = await server()
      .patch(`${ARTICLES_API}/unbookmark`)
      .set('token', token)
      .send({ articleId: theArticle.id });
    expect(res.status).to.equal(200);

    const currentNumberOfBookmarks = await BaseRepository.findAll(db.Bookmark, {
      userId: firstUser.id
    });

    expect(currentNumberOfBookmarks.length).to.equal(0);
  });
});

describe('PATCH api/v1/articles/bookmark', () => {
  beforeEach(async () => {
    await db.Bookmark.destroy({ cascade: true, truncate: true });
    await db.User.destroy({ cascade: true, truncate: true });
  });

  it('should get all bookmarks for a user', async () => {
    const firstUser = await createUser();
    const secondUser = await createUser();
    const theArticle = await createArticle(
      await generateArticle({ authorId: secondUser.id })
    );
    const numberOfBookmarks = await BaseRepository.findAll(db.Bookmark, {
      userId: firstUser.id
    });
    expect(numberOfBookmarks.length).to.equal(0);
    await BaseRepository.create(db.Bookmark, {
      userId: firstUser.id,
      articleId: theArticle.id
    });
    const newNumberOfBookmarks = await BaseRepository.findAll(db.Bookmark, {
      userId: firstUser.id
    });
    expect(newNumberOfBookmarks.length).to.equal(1);

    const token = helper.jwtSigner(firstUser);

    const res = await server()
      .get(`${ARTICLES_API}/bookmark`)
      .set('token', token);
    expect(res.status).to.equal(200);

    expect(res.body.message[0].articleId).to.equal(theArticle.id);
    expect(res.body.message[0].secondUser).to.equal(theArticle.userId);
  });

  it('should get no bookmarks for the user', async () => {
    const firstUser = await createUser();

    const numberOfBookmarks = await BaseRepository.findAndCountAll(
      db.Bookmark,
      {
        userId: firstUser.id
      }
    );
    expect(numberOfBookmarks.count).to.equal(0);

    const token = helper.jwtSigner(firstUser);

    const res = await server()
      .patch(`${ARTICLES_API}/bookmark`)
      .set('token', token);
    expect(res.status).to.equal(400);

    const newNumberOfBookmarks = await BaseRepository.findAndCountAll(
      db.Bookmark,
      {
        userId: firstUser.id
      }
    );
    expect(newNumberOfBookmarks.count).to.equal(0);
  });
});
