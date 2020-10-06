const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const util = require('util');
const view = require('./view/index');
const template = require('./view/template');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    fs.readdir('data', function(error, filelist) {
        let list = template.listGen(filelist);
        let content = template.HOME_CONTENTS;
        content = content.replace(/\n/g, '<br>');
        let control = template.buttonGen();
        let html = view.index('Web 기술', list, content, control);
        res.send(html);
    });
});

app.get('/id/:id', (req, res) => {
    fs.readdir('data', function(error, filelist) {
        let list = template.listGen(filelist);
        let title = req.params.id;
        let control = template.buttonGen(title);
        let filepath = 'data/' + title + '.txt';
        fs.readFile(filepath, 'utf8', (error, buffer) => {
            buffer = buffer.replace(/\n/g, '<br>');
            let html = view.index(title, list, buffer, control);
            res.send(html);
        });
    });
});

app.get('/create', (req, res) => {
    fs.readdir('data', function(error, filelist) {
        let list = template.listGen(filelist);
        let content = template.createForm();
        let control = template.buttonGen();
        let html = view.index('글 생성', list, content, control);
        res.send(html);
    });
});

app.post('/create', (req, res) => {
    let subject = req.body.subject;
    let description = req.body.description;
    //console.log(subject, description);
    let filepath = 'data/' + subject + '.txt';
    fs.writeFile(filepath, description, error => {
        let encoded = encodeURI(`/id/${subject}`);
        console.log(encoded);
        res.status(302).redirect(encoded)
    }); 
});

app.get('*', (req, res) => {
    res.status(404).send('Path not found');
});

app.listen(3000, () => {
    util.log('Server Running at http://127.0.0.1:3000');
});