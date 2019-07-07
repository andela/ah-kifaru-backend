import chai from 'chai';
import chaiHttp from 'chai-http';
import 'chai/register-should';
import 'chai/register-expect';
import sinon from 'sinon';
import rewire from 'rewire';
import slug from 'slug';

import app from '../index';
import models from '../database/models';
import { articleSample } from '../database/mockdata/articledata';

const { User, Article } = models;

// configure chai to use expect
chai.use(chaiHttp);
const { expect } = chai;

const articleEndpoint = '/api/v1/articles';
const specificArticleEndpoint = '/api/v1/articles/:articleId';

describe('Articles', () => {
  describe('CREATE ARTICLE', () => {
    before(() => {});

    it('should create article successfully, with valid user input', done => {
      chai
        .request(app)
        .post(articleEndpoint)
        .send(articleSample)
        .end((error, response) => {
          expect(response.status).to.equal(201);
          done();
        });
    });
  });

  describe('GET ALL ARTICLES', () => {
    before(() => {});

    it('should fetch all successfully created articles', done => {
      chai
        .request(app)
        .get(articleEndpoint)
        .end((error, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.data).to.be.an('array');
          done();
        });
    });
  });

  describe('GET A SPECIFIC ARTICLE', () => {
    before(() => {});

    it('should successfully a specific', done => {
      chai
        .request(app)
        .get(specificArticleEndpoint)
        .end((error, response) => {
          expect(response.status).to.equal(200);
          done();
        });
    });

    it('should throw a 404 erroror when article is not found', done => {
      chai
        .request(app)
        .get(specificArticleEndpoint)
        .end((error, response) => {
          expect(response.status).to.equal(404);
          expect(response.body.data.message).to.eql('Article Not Found');
          done();
        });
    });
  });

  describe('UPDATE AN ARTICLES', () => {
    before(() => {});

    it('should successfully update a specific article', done => {
      chai
        .request(app)
        .put(specificArticleEndpoint)
        .end((error, response) => {
          expect(response.status).to.equal(200);
          done();
        });
    });
  });
  describe('DELETE AN ARTICLES', () => {
    before(() => {});

    it('should successfully delete an article', done => {
      chai
        .request(app)
        .delete(specificArticleEndpoint)
        .end((error, response) => {
          expect(response.status).to.equal(204);
          expect(response.body.message).to.deeply.equal(
            'Article successfully deleted'
          );
          done();
        });
    });
  });
});
