const mysql = require('mysql');
const fs = require('fs');
let info = fs.readFileSync('./mysql.json', 'utf8');
let connInfo = JSON.parse(info);
let conn = mysql.createConnection({
    host:   connInfo.host,
    user:   connInfo.user,
    password:   connInfo.password,
    database:   connInfo.database,
    port:   connInfo.port
});

conn.connect();

let sql = `SELECT g.name AS name,
    date_format(g.debut, '%Y-%m-%d') AS debutDate,
    s.title AS songTitle
    FROM girl_group AS g
    JOIN song AS s ON s.sid = g.hit_song_id
    WHERE debut BETWEEN '2009-01-01' AND '2009-12-31'
    ORDER BY debut;`;
conn.query(sql, function(error, rows, fields) {
    if (error)
        console.log(error);
    for (let row of rows) {
        console.log(row.name, row.debutDate, row.songTitle);
    }
});

conn.end();