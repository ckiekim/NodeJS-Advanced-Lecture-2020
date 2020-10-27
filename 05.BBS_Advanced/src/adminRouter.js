const express = require('express');
const ejs = require('ejs');
const pm = require('path');     // path module
const ut = require('./util');
const dm = require('./db/db-module');
const vm = require('./view/view-module');

const aRouter = express.Router();
const path = pm.join(__dirname, 'view/template');

aRouter.get('/viewChart', ut.isAdmin, (req, res) => {
    dm.getViewList()
    .then(rows => {
        let navBar = vm.navBar(req.session.uname);
        let cd = vm.adminViewChart_data(rows);
        ejs.renderFile('./view/adminViewChart.ejs', {
            path, navBar, 
            labels:cd.labels, data: cd.data, tooltips: cd.tooltips
        }, (error, html) => {
            res.send(html);
        });
    })
    .catch(console.log);
});

module.exports = aRouter;