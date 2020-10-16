const express = require('express');
const ut = require('./util');
const dm = require('./db/db-module');
const alert = require('./view/alertMsg');
const tplt = require('./view/template');

const bRouter = express.Router();
bRouter.get('/list/:page', (req, res) => {
    let page = parseInt(req.params.page);
    req.session.currentPage = page;
    let offset = (page - 1) * 10;
    dm.getBbsTotalCount(result => {
        let totalPage = Math.ceil(result.count / 10);
        let startPage = Math.floor((page-1)/10)*10 + 1;
        let endPage = Math.ceil(page/10)*10;
        endPage = (endPage > totalPage) ? totalPage : endPage;
        dm.getBbsList(offset, rows => {
            let view = require('./view/bbsList');
            let navBar = tplt.navBar(req.session.uname?req.session.uname:'개발자');
            let html = view.list(navBar, rows, page, startPage, endPage, totalPage);
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
    let isMine = (uid === req.body.uid) ? 1 : 0;
    let params = [bid, uid, content, isMine];
    dm.insertReply(params, () => {
        dm.increaseReplyCount(bid, () => {
            res.redirect(`/bbs/bid/${bid}`)
        });
    });
});

bRouter.get('/write', (req, res) => {
    let view = require('./view/bbsWrite');
    let navBar = tplt.navBar(req.session.uname?req.session.uname:'개발자');
    let html = view.write(navBar);
    res.send(html);
});

bRouter.post('/write', (req, res) => {
    let title = req.body.title;
    let content = req.body.content;
    let params = [req.session.uid, title, content];
    dm.insertBbs(params, () => {
        res.redirect('/bbs/list/1');
    });
});

bRouter.get('/update/:bid/uid/:uid', (req, res) => {
    let bid = req.params.bid;
    let uid = req.params.uid;
    if (uid !== req.session.uid) {
        let html = alert.alertMsg('수정 권한이 없습니다.', `/bbs/bid/${bid}`);
        res.send(html);
    } else {
        dm.getBbsData(bid, result => {
            let view = require('./view/bbsUpdate');
            let navBar = tplt.navBar(req.session.uname?req.session.uname:'개발자');
            let html = view.update(navBar, result);
            res.send(html);
        });
    }
});

bRouter.post('/update', (req, res) => {
    let bid = req.body.bid;
    let title = req.body.title;
    let content = req.body.content;
    let params = [title, content, bid];
    dm.updateBbs(params, () => {
        res.redirect(`/bbs/bid/${bid}`);
    });
});

bRouter.get('/delete/:bid/uid/:uid', (req, res) => {
    let bid = req.params.bid;
    let uid = req.params.uid;
    if (uid !== req.session.uid) {
        let html = alert.alertMsg('삭제 권한이 없습니다.', `/bbs/bid/${bid}`);
        res.send(html);
    } else {
        let view = require('./view/bbsDelete');
        let navBar = tplt.navBar(req.session.uname?req.session.uname:'개발자');
        let html = view.delete(navBar, bid);
        res.send(html);
    }
});

bRouter.get('/deleteConfirm/:bid', (req, res) => {
    let bid = req.params.bid;
    let page = parseInt(req.session.currentPage);
    dm.deleteBbs(bid, () => {
        res.redirect(`/bbs/list/${page}`);
    });
});

module.exports = bRouter;