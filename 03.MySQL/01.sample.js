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

let sql = 'select * from city where population > 9000000';
conn.query(sql, function(error, rows, fields) {
    if (error)
        console.log(error);
    for (let row of rows) {
        console.log(row.ID, row.Name, row.CountryCode, row.District, row.Population);
    }
});

conn.end();