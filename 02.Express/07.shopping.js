const express = require('express');

const shoppingRouter = express.Router();
shoppingRouter.get('/', function(req, res) {
    res.send('<h1>Shopping Router</h1>');
});
shoppingRouter.get('/index', function(req, res) {
    res.send('<h1>Shopping Router Index</h1>');
});
module.exports = shoppingRouter;