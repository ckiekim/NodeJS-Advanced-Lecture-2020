const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dm = require('./db/userdb-module');
const am = require('./view/alertMsg');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.get('/', (req, res) => {
    console.log(req.cookies);
    if (req.cookies && req.cookies.isLoggedIn) {    // 로그인 된 상태
        dm.getAllLists(rows => {
            const view = require('./view/cookieList');
            let html = view.mainForm(rows);
            res.send(html);
        }); 
    } else {
        res.redirect('/login');
    }
});

app.get('/login', (req, res) => {
    const view = require('./view/userLogin');
    let html = view.loginForm();
    res.send(html);
});

app.post('/login', (req, res) => {
    let uid = req.body.uid;
    let pwd = req.body.pwd;
    let pwdHash = dm.generateHash(pwd);
    dm.getUserInfo(uid, result => {
        if (result === undefined) {
            let html = am.alertMsg(`Login 실패: uid ${uid}이/가 없습니다.`, '/login');
            res.send(html);
        } else {
            if (result.pwd === pwdHash) {
                res.cookie('isLoggedIn', 1);
                console.log('Login 성공');
                res.redirect('/');
            } else {
                let html = am.alertMsg('Login 실패: 패스워드가 다릅니다.', '/login');
                res.send(html);
            }
        }
    });
});

app.get('/logout', (req, res) => {
    res.clearCookie('isLoggedIn');
    res.redirect('/login');
});

app.listen(3000, () => {
    console.log('Server Running at http://127.0.0.1:3000');
});