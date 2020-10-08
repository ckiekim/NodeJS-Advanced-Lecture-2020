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

let sql = `SELECT continent, COUNT(*) AS countCont,
    round(SUM(GNP)) AS sumCont, 
    round(AVG(GNP)) AS avgCont
    FROM country
    GROUP BY continent;`;
conn.query(sql, function(error, rows, fields) {
    if (error)
        console.log(error);
    for (let row of rows) {
        console.log(row.continent, row.countCont, row.sumCont, row.avgCont);
    }
});

conn.end();