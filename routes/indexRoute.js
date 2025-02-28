const { Router } = require('express');
const indexRouter = Router();
const indexController = require('../controllers/indexController');

indexRouter.get('/', indexController.indexController);

module.exports = indexRouter;
