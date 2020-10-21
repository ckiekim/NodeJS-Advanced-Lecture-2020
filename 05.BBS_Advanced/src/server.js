const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const favicon = require('express-favicon');
const fs = require('fs');
const util = require('util');
const morgan = require('morgan');
const dm = require('./db/db-module');
const bRouter = require('./bbsRouter');
const uRouter = require('./userRouter');
const ut = require('./util');

const app = express();
app.use('/bootstrap', express.static(__dirname + '/../node_modules/bootstrap/dist'));
app.use('/jquery', express.static(__dirname + '/../node_modules/jquery/dist'));
app.use('/popper', express.static(__dirname + '/../node_modules/@popperjs/core/dist/umd'));
app.use('/ckeditor', express.static(__dirname + '/../node_modules/ckeditor4'));
app.use(express.static(__dirname + '/../public'));
app.use(favicon(__dirname + '/../public/favicon.ico'));
app.use(bodyParser.urlencoded({extended: false})); 
app.use(cookieParser('1q2w3e4r5t6y'));
app.use(session({
    secret: '1q2w3e4r5t6y',     // keyboard cat
    resave: false,
    saveUninitialized: true,
    store: new FileStore({logFn: function(){}, path: '../sessions'})
}));
//app.use(morgan('combined'));
app.use('/bbs', bRouter);
app.use('/user', uRouter);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/view');

app.get('/', ut.isLoggedIn, (req, res) => {
    res.redirect('/bbs/list/1');
});

app.get('/login', (req, res) => {
    fs.readFile(__dirname+'/view/login.html', 'utf8', (error, html) => {
        res.send(html);
    });
});

app.post('/login', (req, res) => {
    let uid = req.body.uid;
    let pwd = req.body.pwd;
    let pwdHash = ut.generateHash(pwd);
    dm.getUserInfo(uid)
    .then(result => {
        if (result === undefined) {
            let html = am.alertMsg(`Login 실패: uid ${uid}이/가 없습니다.`, '/login');
            res.send(html);
        } else {
            if (result.pwd === pwdHash) {
                req.session.uid = uid;
                req.session.uname = result.uname;
                util.log(`${result.uname}(${uid}) is logged in.`);
                req.session.save(function() {
                    res.redirect('/');
                });
            } else {
                let html = am.alertMsg('Login 실패: 패스워드가 다릅니다.', '/login');
                res.send(html);
            }
        }
    });
});

app.get('/logout', ut.isLoggedIn, (req, res) => {
    util.log(`${req.session.uname}(${req.session.uid}) is logged out.`);
    req.session.destroy();
    res.redirect('/login');
});

app.listen(3000, () => {
    console.log('MyBBS Server running at http://127.0.0.1:3000');
});