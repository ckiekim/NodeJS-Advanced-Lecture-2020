const express = require('express');
const ejs = require('ejs');
const pm = require('path');     // path module
const ut = require('./util');
const dm = require('./db/db-module');
const vm = require('./view/view-module');
const alert = require('./view/alertMsg');

const uRouter = express.Router();
const path = pm.join(__dirname, 'view/template');
uRouter.get('/dispatch', ut.isLoggedIn, (req, res) => {
    if (req.session.uid === 'admin') {
        res.redirect('/user/list/1');
    } else {
        res.redirect(`/user/update/${req.session.uid}`);
    }
});

uRouter.get('/list/:page', ut.isLoggedIn, (req, res) => {
    if (req.session.uid !== 'admin') {
        let html = alert.alertMsg('조회 권한이 없습니다.', `/bbs/list/1`);
        res.send(html);
    } else {
        let page = parseInt(req.params.page);
        let offset = (page - 1) * 10;
        Promise.all([dm.getUserTotalCount(), dm.getUserList(offset)])
            .then(([result, rows]) => {
                let totalPage = Math.ceil(result.count / 10);
                let navBar = vm.navBar(req.session.uname?req.session.uname:'개발자');
                let trs = vm.userList_trs(rows);
                let pages = vm.userList_pages(page, totalPage);
                ejs.renderFile('./view/userList.ejs', {
                    path, navBar, trs, pages
                }, (error, html) => {
                    res.send(html);
                });
            })
            .catch(console.log);
    }
});

uRouter.get('/uid/:uid', ut.isLoggedIn, (req, res) => {
    let uid = req.params.uid;
    if (uid != req.session.uid) {
        let html = alert.alertMsg('조회 권한이 없습니다.', `/bbs/list/1`);
        res.send(html);
    } else {
        dm.getUserInfo(uid)
            .then(result => {
                let navBar = vm.navBar(req.session.uname?req.session.uname:'개발자');
                ejs.renderFile('./view/userView.ejs', {
                    path, navBar, result
                }, (error, html) => {
                    res.send(html);
                });
            })
            .catch(console.log);
    }
});

uRouter.get('/register', (req, res) => {
    ejs.renderFile('./view/userRegister.ejs', {path}, (error, html) => {
        res.send(html);
    });
});

uRouter.post('/register', (req, res) => {
    let uid = req.body.uid;
    let pwd = req.body.pwd;
    let pwd2 = req.body.pwd2;
    let uname = req.body.uname;
    let tel = req.body.tel;
    let email = req.body.email;
    if (pwd !== pwd2) {
        let html = alert.alertMsg('패스워드가 다릅니다.', '/user/register');
        res.send(html);
    } else {
        let pwdHash = ut.generateHash(pwd);
        let params = [uid, pwdHash, uname, tel, email];
        dm.registerUser(params)
            .then(() => { res.redirect('/login'); })
            .catch(console.log);
    }
});

uRouter.get('/update/:uid', ut.isLoggedIn, (req, res) => {
    let uid = req.params.uid;
    if (uid != req.session.uid) {
        let html = alert.alertMsg('수정 권한이 없습니다.', `/bbs/list/1`);
        res.send(html);
    } else {
        dm.getUserInfo(uid)
        .then(result => {
            let navBar = vm.navBar(req.session.uname?req.session.uname:'개발자');
            ejs.renderFile('./view/userUpdate.ejs', {
                path, navBar, result
            }, (error, html) => {
                res.send(html);
            });
        })
        .catch(console.log);
    }
});

uRouter.post('/update', ut.isLoggedIn, (req, res) => {
    let uid = req.body.uid;
    let pwdHash = req.body.pwdHash;
    let pwd = req.body.pwd;
    let pwd2 = req.body.pwd2;
    let uname = req.body.uname;
    let tel = req.body.tel;
    let email = req.body.email;
    if (pwd && pwd !== pwd2) {
        let html = alert.alertMsg('패스워드가 다릅니다.', `/user/update/${uid}`);
        res.send(html);
    } else {
        if (pwd)
            pwdHash = ut.generateHash(pwd);
        let params = [pwdHash, uname, tel, email, uid];
        dm.updateUser(params)
            .then(() => { res.redirect(`/user/uid/${uid}`); })
            .catch(console.log);
    }
});

uRouter.get('/delete/:uid', ut.isLoggedIn, (req, res) => {
    let uid = req.params.uid;
    if (req.session.uid !== 'admin') {
        let html = alert.alertMsg('삭제 권한이 없습니다.', `/bbs/list/1`);
        res.send(html);
    } else {
        let navBar = vm.navBar(req.session.uname?req.session.uname:'개발자');
        ejs.renderFile('./view/userDelete.ejs', {
            path, navBar, uid
        }, (error, html) => {
            res.send(html);
        });
    }
});

uRouter.get('/deleteConfirm/:uid', ut.isLoggedIn, (req, res) => {
    let uid = req.params.uid;
    dm.deleteUser(uid)
        .then(() => { res.redirect('/user/list/1'); })
        .catch(console.log);
});

module.exports = uRouter;