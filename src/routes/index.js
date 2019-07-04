import dotenv from 'dotenv';
import articlesController from '../controllers/articles';

dotenv.config();

module.exports = app => {
  app.get('/api', (req, res) =>
    res.status(200).send({
      message: 'Welcome to the Articles API!'
    })
  );

  app.post('/api/v1/articles', articlesController.create);
  app.get('/api/v1/articles', articlesController.list);
  app.get('/api/v1/articles/:articleId', articlesController.retrieve);
  app.put('/api/v1/articles/:articleId', articlesController.update);
  app.delete('/api/v1/articles/:articleId', articlesController.destroy);
};
