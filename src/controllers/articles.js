const { Article } = require('../database/models');

module.exports = {
  create(req, res) {
    return Article.create({
      // title: req.body.title,
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      image: req.body.image,
      slug: req.body.slug
    })
      .then(article => res.status(201).send(article))
      .catch(error => res.status(400).send(error));
  },

  list(req, res) {
    return Article.findAll()
      .then(articles => res.status(200).send(articles))
      .catch(error => res.status(400).send(error));
  }
};
