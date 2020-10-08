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

let sql = `SELECT country.Name AS country,
    city.Name as city,
    city.Population as population
    FROM country
    JOIN city ON country.code = city.CountryCode
    WHERE continent = 'Asia'
    ORDER BY population DESC
    LIMIT 10;`;
conn.query(sql, function(error, rows, fields) {
    if (error)
        console.log(error);
    for (let row of rows) {
        console.log(row.country, row.city, row.population);
    }
});

conn.end();