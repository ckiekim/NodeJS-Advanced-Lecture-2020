const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const util = require('util');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));

// multer setting
const upload = multer({
    storage: multer.diskStorage({
        // set a localstorage destination
        destination: __dirname + '/public/upload/',
        // set a file name
        filename: (req, file, cb) => {
            //cb(null, file.originalname);
            cb(null, new Date().toISOString().substring(0,10) + '_' + file.originalname);
        }
    })
});

app.get('/', (req, res) => { 
    fs.readFile('10.fileform.html', 'utf8', (error, data) => {
        res.send(data);
    });
});

app.post('/', upload.single('image'), (req, res) => {
    let comment = req.body.comment;
    console.log(req.file);

    res.redirect('/');
});

app.listen(3000, () => {
    util.log('Server Running at http://127.0.0.1:3000');
});