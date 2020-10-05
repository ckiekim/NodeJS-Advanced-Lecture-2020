const express = require('express');
const util = require('util');

const app = express();

app.get('/', function(req, res) {
    let agent = req.header('User-Agent');

    if (agent.toLowerCase().match(/chrome/)) {
        res.send(`크롬 브라우저입니다.`);
    } else {
        res.send(`크롬 브라우저가 아닙니다.`);
    }
});

app.get('*', (req, res) => {
    res.status(404).send('Path not found');
});
//app.post();

app.listen(3000, () => {
    util.log('Server Running at http://127.0.0.1:3000');
});