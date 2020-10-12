const mysql = require('mysql');
const fs = require('fs');
let info = fs.readFileSync('./mysql.json', 'utf8');
let config = JSON.parse(info);
let conn = mysql.createConnection({
    host:   config.host,
    user:   config.user,
    password:   config.password,
    database:   config.database,
    port:   config.port
});

conn.connect();

let sql = `insert into song(title, lyrics) values(?, ?);`;
let params = ['눈누난나', '그래서 난 눈누난나 눈누누난나 (ya ya)'];
conn.query(sql, params, function(error, fields) {
    if (error)
        console.log(error);
    let sql = 'SELECT * FROM song ORDER BY sid DESC LIMIT 3';
    conn.query(sql, function(error, rows, fields) {
        if (error)
            console.log(error);
        for (let row of rows) {
            console.log(row.sid, row.title, row.lyrics);           
        }
    });
    conn.end();
});
