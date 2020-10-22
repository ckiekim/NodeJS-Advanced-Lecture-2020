const express = require('express');
const ejs = require('ejs');
const pm = require('path');     // path module
const multer = require('multer');
const ut = require('./util');
const dm = require('./db/db-module');
const vm = require('./view/view-module');
const alert = require('./view/alertMsg');

const bRouter = express.Router();
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

bRouter.get('/list/:page', ut.isLoggedIn, (req, res) => {
    let page = parseInt(req.params.page);
    req.session.currentPage = page;
    let offset = (page - 1) * 10;
    Promise.all([dm.getBbsTotalCount(), dm.getBbsList(offset)])
        .then(([result, rows]) => {
            let totalPage = Math.ceil(result.count / 10);
            let startPage = Math.floor((page - 1) / 10) * 10 + 1;
            let endPage = Math.ceil(page / 10) * 10;
            endPage = (endPage > totalPage) ? totalPage : endPage;
            let navBar = vm.navBar(req.session.uname);
            let trs = vm.bbsList_trs(rows);
            let pages = vm.bbsList_pages(page, startPage, endPage, totalPage);
            ejs.renderFile('./view/bbsList.ejs', {
                //path: path, navBar: navBar, trs: trs, pages: pages
                path, navBar, trs, pages
            }, (error, html) => {
                res.send(html);
            });
        })
        .catch(console.log);
});

bRouter.post('/search', ut.isLoggedIn, (req, res) => {
    let keyword = '%' + req.body.keyword + '%';
    dm.getSearchList(keyword)
        .then(rows => {
            let navBar = vm.navBar(req.session.uname);
            let trs = vm.bbsList_trs(rows);
            let search = req.body.keyword;
            ejs.renderFile('./view/bbsSearchList.ejs', {
                path, navBar, trs, search
            }, (error, html) => {
                res.send(html);
            });
        })
        .catch(console.log);
});

bRouter.get('/bid/:bid', ut.isLoggedIn, (req, res) => {
    let bid = parseInt(req.params.bid);
    Promise.all([dm.getBbsData(bid), dm.getReplyData(bid), dm.increaseViewCount(bid)])
        .then(([result, replies]) => {
            let navBar = vm.navBar(req.session.uname);
            let cards = vm.bbsView_cards(replies);
            ejs.renderFile('./view/bbsView.ejs', {
                path, navBar, result, cards
            }, (error, html) => {
                res.send(html);
            });
        })
        .catch(console.log);
});

bRouter.post('/reply', ut.isLoggedIn, (req, res) => {
    let bid = parseInt(req.body.bid);
    let uid = req.session.uid;
    let content = req.body.content;
    let isMine = (uid === req.body.uid) ? 1 : 0;
    let params = [bid, uid, content, isMine];
    Promise.all([dm.insertReply(params), dm.increaseReplyCount(bid)])
        .then(() => { res.redirect(`/bbs/bid/${bid}`); })
        .catch(console.log);
});

bRouter.get('/write', ut.isLoggedIn, (req, res) => {
    let navBar = vm.navBar(req.session.uname);
    ejs.renderFile('./view/bbsWrite.ejs', {
        path, navBar
    }, (error, html) => {
        res.send(html);
    });
});

bRouter.post('/write', ut.isLoggedIn, (req, res) => {
    let title = req.body.title;
    let content = req.body.content;
    let params = [req.session.uid, title, content];
    dm.insertBbs(params)
        .then(() => { res.redirect('/bbs/list/1'); })
        .catch(console.log);
});

bRouter.get('/update/:bid/uid/:uid', ut.isLoggedIn, ut.hasRight, (req, res) => {
    let bid = req.params.bid;
    dm.getBbsData(bid)
        .then(result => {
            let navBar = vm.navBar(req.session.uname);
            ejs.renderFile('./view/bbsUpdate.ejs', {
                path, navBar, result
            }, (error, html) => {
                res.send(html);
            });
        })
        .catch(console.log);
});

bRouter.post('/update', ut.isLoggedIn, (req, res) => {
    let bid = req.body.bid;
    let title = req.body.title;
    let content = req.body.content;
    let params = [title, content, bid];
    dm.updateBbs(params)
        .then(() => { res.redirect(`/bbs/bid/${bid}`); })
        .catch(console.log);
});

bRouter.get('/delete/:bid/uid/:uid', ut.isLoggedIn, ut.hasRight, (req, res) => {
    let bid = req.params.bid;
    let navBar = vm.navBar(req.session.uname);
    ejs.renderFile('./view/bbsDelete.ejs', {
        path, navBar, bid
    }, (error, html) => {
        res.send(html);
    });
});

bRouter.get('/deleteConfirm/:bid', ut.isLoggedIn, (req, res) => {
    let bid = req.params.bid;
    let page = parseInt(req.session.currentPage);
    dm.deleteBbs(bid)
    .then(() => { res.redirect(`/bbs/list/${page}`); })
    .catch(console.log);
});

bRouter.post('/uploadImage', ut.isLoggedIn, upload.single('upload'), (req, res) => {
    //console.log(req.file);
    let fileUrl = '/upload/' + req.file.filename;
    let jsonResponse = {
        uploaded: 1,
        fileName: req.file.filename,
        url: fileUrl
    };
    res.send(JSON.stringify(jsonResponse));
});

module.exports = bRouter;