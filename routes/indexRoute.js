const { Router } = require('express');
const indexRouter = Router();
const controller = require('../controllers/indexController');
const gamesController = require('../controllers/gamesController');

indexRouter.get('/', controller.indexController);
indexRouter.get('/games', controller.gamesController);
indexRouter.get('/categories', controller.categoriesController);
indexRouter.get('/categories', controller.getCategoryController);
indexRouter.get('/games', controller.searchGamesController);
indexRouter.post('/games/add', gamesController.addGameController);
indexRouter.get('/games/add', gamesController.getAddGameController);
indexRouter.get('/games/:id', controller.getGameDetailController);
indexRouter.get('/games/:id/edit', gamesController.getEditPage);
indexRouter.post(
  '/games/:id/update',
  gamesController.updateGameAndGenresController
);

module.exports = indexRouter;
