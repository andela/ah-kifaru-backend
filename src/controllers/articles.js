import { Article } from '../database/models';
import dotenv from 'dotenv';

dotenv.config();

export default {
  create(req, res) {
    const { title, description, content, image, slug } = req.body;
    return Article.create({
      ...req.body
    })
      .then(article =>
        res.status(201).send({
          status: 201,
          data: article
        })
      )
      .catch(error => res.status(400).send(error));
  },

  list(req, res) {
    return Article.findAll()
      .then(articles =>
        res.status(200).send({
          status: 200,
          data: articles
        })
      )
      .catch(error => res.status(400).send(error));
  },

  retrieve(req, res) {
    return Article.findByPk(req.params.articleId, {})
      .then(article => {
        if (!article) {
          return res.status(404).send({
            message: 'Article Not Found'
          });
        }
        return res.status(200).send({
          status: 200,
          data: article
        });
      })
      .catch(error => res.status(400).send(error));
  },

  update(req, res) {
    return Article.findByPk(req.params.articleId, {})
      .then(article => {
        if (!article) {
          return res.status(404).send({
            message: 'Article Not Found'
          });
        }
        return article
          .update({
            title: req.body.title || article.title,
            description: req.body.description || article.description,
            content: req.body.content || article.content,
            image: req.body.image || article.image,
            slug: req.body.slug || article.slug
          })
          .then(() =>
            res.status(200).send({
              status: 200,
              message: 'Article successfully updated',
              data: article
            })
          )
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },

  destroy(req, res) {
    return Article.findByPk(req.params.articleId)
      .then(article => {
        if (!article) {
          return res.status(404).send({
            message: 'Article Not Found'
          });
        }
        return article
          .destroy()
          .then(() => {
            res.status(204).send({
              status: 204,
              message: 'Article successfully deleted'
            });
          })
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  }
};
