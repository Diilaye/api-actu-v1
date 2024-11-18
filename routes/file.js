
const routes = new require('express').Router();

// Add routes
routes.get('/', require('../controllers/file-controller').all);
routes.get('/:id', require('../controllers/file-controller').one);
routes.post('/', require('../controllers/file-controller').store);
routes.delete('/:id', require('../controllers/file-controller').delete);

module.exports = routes;
