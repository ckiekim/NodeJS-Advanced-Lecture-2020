const express = require('express');
const ejs = require('ejs');
const pm = require('path');     // path module
const multer = require('multer');
const ut = require('./util');
const dm = require('./db/db-module');
const vm = require('./view/view-module');
const alert = require('./view/alertMsg');

const uRouter = express.Router();
const path = pm.join(__dirname, 'view/template');
// multer setting
const upload = multer({
    storage: multer.diskStorage({
        // set a localstorage destination
        destination: __dirname + '/../public/upload/',
        // set a file name
        filename: (req, file, cb) => {
            cb(null, new Date().toISOString().replace(/[-:\.A-Z]/g, '') + '_' + file.originalname);
        }
    })
});

uRouter.get('/dispatch', ut.isLoggedIn, (req, res) => {
    if (req.session.uid === 'admin') {
        res.redirect('/user/list/1');
    } else {
        res.redirect(`/user/update/${req.session.uid}`);
    }
});

uRouter.get('/list/:page', ut.isLoggedIn, ut.isAdmin, (req, res) => {
    if (req.params.page === 'null') {   // 없는 사진 처리
        res.status(200).send();
    } else {
        let page = parseInt(req.params.page);
        let offset = (page - 1) * 10;
        //console.log(`offset = ${offset}`);
        Promise.all([dm.getUserTotalCount(), dm.getUserList(offset)])
            .then(([result, rows]) => {
                let totalPage = Math.ceil(result.count / 10);
                let navBar = vm.navBar(req.session.uname);
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

uRouter.get('/uid/:uid', ut.isLoggedIn, ut.isAdminOrOwner, (req, res) => {
    dm.getUserInfo(req.params.uid)
        .then(result => {
            let navBar = vm.navBar(req.session.uname);
            ejs.renderFile('./view/userView.ejs', {
                path, navBar, result
            }, (error, html) => {
                res.send(html);
            });
        })
        .catch(console.log);
});

uRouter.get('/register', (req, res) => {
    ejs.renderFile('./view/userRegister.ejs', {path}, (error, html) => {
        res.send(html);
    });
});

uRouter.post('/register', upload.single('photo'), (req, res) => {
    let uid = req.body.uid;
    let pwd = req.body.pwd;
    let pwd2 = req.body.pwd2;
    let uname = req.body.uname;
    let tel = req.body.tel;
    let email = req.body.email;
    let photo = req.file ? `/upload/${req.file.filename}` : '/upload/blank.png';
    //console.log(photo);
    if (pwd !== pwd2) {
        let html = alert.alertMsg('패스워드가 다릅니다.', '/user/register');
        res.send(html);
    } else {
        let pwdHash = ut.generateHash(pwd);
        let params = [uid, pwdHash, uname, tel, email, photo];
        dm.registerUser(params)
            .then(() => { res.redirect('/login'); })
            .catch(console.log);
    }
});

uRouter.get('/update/:uid', ut.isLoggedIn, ut.hasRight, (req, res) => {
    dm.getUserInfo(req.params.uid)
    .then(result => {
        let navBar = vm.navBar(req.session.uname?req.session.uname:'개발자');
        ejs.renderFile('./view/userUpdate.ejs', {
            path, navBar, result
        }, (error, html) => {
            res.send(html);
        });
    })
    .catch(console.log);
});

uRouter.post('/update', ut.isLoggedIn, upload.single('photo'), (req, res) => {
    let uid = req.body.uid;
    let pwdHash = req.body.pwdHash;
    let pwd = req.body.pwd;
    let pwd2 = req.body.pwd2;
    let uname = req.body.uname;
    let tel = req.body.tel;
    let email = req.body.email;
    let photo = req.file ? '/upload/' + req.file.filename : null;
    if (pwd && pwd !== pwd2) {
        let html = alert.alertMsg('패스워드가 다릅니다.', `/user/update/${uid}`);
        res.send(html);
    } else {
        if (pwd)
            pwdHash = ut.generateHash(pwd);
        let params = [pwdHash, uname, tel, email];
        dm.updateUser(params, photo, uid)
            .then(() => { res.redirect(`/user/uid/${uid}`); })
            .catch(console.log);
    }
});

uRouter.get('/delete/:uid', ut.isLoggedIn, ut.isAdmin, (req, res) => {
    let uid = req.params.uid;
    let navBar = vm.navBar(req.session.uname);
    ejs.renderFile('./view/userDelete.ejs', {
        path, navBar, uid
    }, (error, html) => {
        res.send(html);
    });
});

uRouter.get('/deleteConfirm/:uid', ut.isLoggedIn, (req, res) => {
    dm.deleteUser(req.params.uid)
        .then(() => { res.redirect('/user/list/1'); })
        .catch(console.log);
});

module.exports = uRouter;