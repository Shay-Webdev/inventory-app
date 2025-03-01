const { Router } = require('express');
const indexRouter = Router();
const controller = require('../controllers/indexController');

indexRouter.get('/', controller.indexController);
indexRouter.get('/games', controller.gamesController);
indexRouter.get('/categories', controller.categoriesController);
indexRouter.get('/categories', controller.getCategoryController);

module.exports = indexRouter;
