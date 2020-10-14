const express = require('express');

const uRouter = express.Router();
uRouter.get('/register', (req, res) => {
    const view = require('./view/userRegister');
    let html = view.register();
    res.send(html);
});

uRouter.post('/register', (req, res) => {
    let uid = req.body.uid;
    let pwd = req.body.pwd;
    let pwd2 = req.body.pwd2;
    let uname = req.body.uname;
    res.send(`<h1>uid: ${uid}, pwd: ${pwd}, pwd2: ${pwd2}, uname: ${uname}</h1>`);
});

module.exports = uRouter;