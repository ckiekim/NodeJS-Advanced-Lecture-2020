const express = require('express');
const bodyParser = require('body-parser');
//const multipart = require('connect-multiparty');
const multer = require('multer');
const fs = require('fs');
const util = require('util');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
//app.use(multipart({uploadDir: __dirname+'/public/upload'}));
var upload = multer({ dest: __dirname+'/public/upload'});

app.get('/', (req, res) => { 
    fs.readFile('10.fileform.html', 'utf8', (error, data) => {
        res.send(data);
    });
});

app.post('/', upload.single('userfile'), (req, res) => {
    let comment = req.body.comment;
    console.log(req.file);
    /* let filename = req.files.image.name;
    let filetype = req.files.image.type;
    let uploadPath = req.files.image.path;
    console.log(filename, filetype);
    console.log(uploadPath); */

    // 받은 파일이 이미지면 이름을 변경하고, 아니면 제거함.
/*     if (filetype.indexOf('image') >= 0) {
        let outputName = comment + filename;
        let newFileName = __dirname + '/pubilc/upload/' + outputName;
        for (let i=0; i<1000000; i++) ;
        fs.rename(uploadPath, newFileName, err => {
            if (err)
                console.log(err);
            res.redirect('/');
        });
    } else {

    } */
});

app.listen(3000, () => {
    util.log('Server Running at http://127.0.0.1:3000');
});