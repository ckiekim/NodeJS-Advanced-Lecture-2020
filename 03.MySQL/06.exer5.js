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

let sql = `SELECT city.Name AS name,
    city.Population AS population,
    cl.Language AS language
    FROM city
    JOIN countrylanguage AS cl
    ON city.CountryCode = cl.CountryCode
    WHERE cl.IsOfficial = 'T'
    GROUP BY city.Name
    ORDER BY city.Population DESC
    LIMIT 10;`;
conn.query(sql, function(error, rows, fields) {
    if (error)
        console.log(error);
    for (let row of rows) {
        console.log(row.name, row.population, row.language);
    }
});

conn.end();