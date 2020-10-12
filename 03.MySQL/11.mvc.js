const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const mysql = require('mysql');
const listView = require('./view/list');

let info = fs.readFileSync('./mysql.json', 'utf8');
let config = JSON.parse(info);

const app = express();
app.use(bodyParser.urlencoded({extended: false}));

function getConnection() {
    let conn = mysql.createConnection({
        host:   config.host,
        user:   config.user,
        password:   config.password,
        database:   config.database,
        port:   config.port
    });
    conn.connect(function(error) {
        if (error) 
            console.log('mysql connection error :' + err);
    });
    return conn;
}

app.get('/', (req, res) => { 
    let conn = getConnection();
    let sql = `SELECT * FROM song ORDER BY sid DESC LIMIT 5;`;
    conn.query(sql, (error, rows, fields) => {
        if (error)
            console.log(error);
        let html = listView.mainForm(rows);
        res.end(html);
    });
    conn.end();
});

app.get('/insert', (req, res) => {
    fs.readFile('10.song.html', 'utf8', (error, data) => {
        res.send(data);
    });
});

app.post('/insert', (req, res) => {
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
});

app.listen(3000, () => {
    console.log('Server Running at http://127.0.0.1:3000');
});