const articlesController = require('../controllers').articles;
// import todosController from '../controllers/todos';
// const todoItemsController = require('../controllers').todoItems;

module.exports = app => {
  app.get('/api', (req, res) =>
    res.status(200).send({
      message: 'Welcome to the Articles API!'
    })
  );

  app.post('/api/todos', articlesController.create);
  app.get('/api/todos', articlesController.list);
  // app.post('/api/todos/:todoId/items', todoItemsController.create);
};
