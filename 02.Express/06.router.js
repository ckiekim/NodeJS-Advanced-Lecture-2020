const express = require('express');
const util = require('util');

const app = express();
app.use(express.static(__dirname + '/public'));
let shoppingRouter = express.Router();
let customerRouter = express.Router();
app.use('/shopping', shoppingRouter);
app.use('/customer', customerRouter);

app.get('/', function(req, res) {
    res.send('<h1>Root Router</h1>');
});
shoppingRouter.get('/', function(req, res) {
    res.send('<h1>Shopping Router</h1>');
});
shoppingRouter.get('/index', function(req, res) {
    res.send('<h1>Shopping Router Index</h1>');
});
customerRouter.get('/', function(req, res) {
    res.send('<h1>Customer Router</h1>');
});
customerRouter.get('/index', function(req, res) {
    res.send('<h1>Customer Router Index</h1>');
});

app.get('*', (req, res) => {
    res.status(404).send('Path not found');
});
//app.post();

app.listen(3000, () => {
    util.log('Server Running at http://127.0.0.1:3000');
});