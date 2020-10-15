const express = require('express');
const ut = require('./util');
const dm = require('./db/db-module');
const alert = require('./view/alertMsg');
const tplt = require('./view/template');

const bRouter = express.Router();
bRouter.get('/list/:page', (req, res) => {
    let page = parseInt(req.params.page);
    let offset = (page - 1) * 10;
    dm.getBbsTotalCount(result => {
        let totalPage = Math.ceil(result.count / 10);
        dm.getBbsList(offset, rows => {
            let view = require('./view/bbsList');
            let navBar = tplt.navBar(req.session.uname?req.session.uname:'개발자');
            let html = view.list(navBar, rows, page, totalPage);
            res.send(html);
        })
    });
});

bRouter.post('/search', (req, res) => {
    let keyword = '%' + req.body.keyword + '%';
    console.log(keyword);
    dm.getSearchList(keyword, rows => {
        let view = require('./view/bbsSearchList');
        let navBar = tplt.navBar(req.session.uname?req.session.uname:'개발자');
        let html = view.list(navBar, rows);
        res.send(html);
    })
});

bRouter.get('/bid/:bid', (req, res) => {
    let bid = parseInt(req.params.bid);
    dm.getBbsData(bid, result => {
        dm.increaseViewCount(bid, () => {
            dm.getReplyData(bid, replies => {
                let view = require('./view/bbsView');
                let navBar = tplt.navBar(req.session.uname?req.session.uname:'개발자');
                let html = view.view(navBar, result, replies);
                res.send(html);
            });
        });
    });
});

bRouter.post('/reply', (req, res) => {
    let bid = parseInt(req.body.bid);
    let uid = req.session.uid;
    let content = req.body.content;
    console.log(bid, uid, content);
    res.redirect(`/bbs/bid/${bid}`)
});

module.exports = bRouter;