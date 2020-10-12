const express = require('express');
const bodyParser = require('body-parser');
const dm = require('./db/db-module');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    dm.getAllLists(rows => {
        const view = require('./view/list');
        let html = view.mainForm(rows);
        res.send(html);
    }); 
});

app.get('/insert', (req, res) => {
    const view = require('./view/insert');
    let html = view.insertForm();
    res.send(html);
});

/* app.post('/insert', (req, res) => {
    let title = req.body.title;
    let lyrics = req.body.lyrics;
    let sql = `insert into song(title, lyrics) values(?, ?);`;
    let params = [title, lyrics];
    let conn = getConnection();
    conn.query(sql, params, function(error, fields) {
        if (error)
            console.log(error);
        res.redirect('/');
    });
    conn.end();
}); */

app.listen(3000, () => {
    console.log('Server Running at http://127.0.0.1:3000');
});