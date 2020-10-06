const express = require('express');
const bodyParser = require('body-parser');
const multipart = require('connect-multiparty');
const fs = require('fs');
const util = require('util');
const view = require('./view/index_image');
const template = require('./view/template_image');

const app = express();
app.use(express.static(__dirname + '/public/fileWebImage'));
app.use(multipart({uploadDir: __dirname+'/public/fileWebImage'}));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    fs.readdir('data', function(error, filelist) {
        let list = template.listGen(filelist);
        let content = template.HOME_CONTENTS;
        content = content.replace(/\n/g, '<br>');
        let control = template.buttonGen();
        let html = view.index('Web', list, content, control, true);
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
            let html = view.index(title, list, buffer, control, true);
            res.send(html);
        });
    });
});

app.get('/create', (req, res) => {
    fs.readdir('data', function(error, filelist) {
        let list = template.listGen(filelist);
        let content = template.createForm();
        let control = template.buttonGen();
        let html = view.index('글 생성', list, content, control, false);
        res.send(html);
    });
});

app.post('/create', (req, res) => {
    let subject = req.body.subject;
    let description = req.body.description;
    let filepath = 'data/' + subject + '.txt';
    fs.writeFile(filepath, description, error => {
        // 이미지 처리
        let imageName = subject + '.jpg';
        let uploadPath = req.files.image.path;
        let newFileName = __dirname + '/public/fileWebImage/' + imageName;
        fs.rename(uploadPath, newFileName, error => {
            res.redirect(`/id/${subject}`);
        });
    }); 
});

app.get('/delete/id/:id', (req, res) => {
    fs.readdir('data', function(error, filelist) {
        let list = template.listGen(filelist);
        let content = template.deleteForm(req.params.id);
        let control = template.buttonGen();
        let html = view.index('글 삭제', list, content, control, false);
        res.end(html);
    });
});

app.post('/delete', (req, res) => {
    let filepath = 'data/' + req.body.subject + '.txt';
    let imagepath = 'public/fileWebImage/' + req.body.subject + '.jpg';
    fs.unlink(filepath, error => {
        fs.unlink(imagepath, error => {
            res.redirect('/');
        });
    });
});

app.get('/update/id/:id', (req, res) => {
    fs.readdir('data', function(error, filelist) {
        let list = template.listGen(filelist);
        let title = req.params.id;
        let control = template.buttonGen();
        let filepath = 'data/' + title + '.txt';
        fs.readFile(filepath, 'utf8', (error, buffer) => {
            let content = template.updateForm(title, buffer);
            let html = view.index(`${title} 수정`, list, content, control);
            res.end(html);
        });
    });
});

app.post('/update', (req, res) => {
    let original = req.body.original;
    let subject = req.body.subject;
    let description = req.body.description;
    let filepath = 'data/' + original + '.txt';
    fs.writeFile(filepath, description, error => {
        if (original !== subject) {
            fs.renameSync(filepath, `data/${subject}.txt`);
        }
        res.redirect(`/id/${subject}`)
    });
});

app.get('*', (req, res) => {
    res.status(404).send('Path not found');
});

app.listen(3000, () => {
    util.log('Server Running at http://127.0.0.1:3000');
});