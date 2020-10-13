const mysql = require('mysql');
const fs = require('fs');
const crypto = require('crypto');
let info = fs.readFileSync('./mysql.json', 'utf8');
let config = JSON.parse(info);
let conn = mysql.createConnection({
    host:   config.host,
    user:   config.user,
    password:   config.password,
    database:   config.database,
    port:   config.port
});

function generateHash(something) {
    // SHA: Secure Hash Algorithm
    let shasum = crypto.createHash('sha256');   // sha256, sha512
    shasum.update(something);
    return shasum.digest('base64');  // hex, base64
}

// 사용자가 입력한 uid와 pwd를 각각 'admin', '1234'로 가정
let uid = 'admin';  // req.body.uid
let pwd = '1234';   // req.body.pwd
let pwdHash = generateHash(pwd);

let sql = `select * from users where uid like ?;`;
conn.query(sql, uid, function(error, results, fields) {
    if (error)
        console.log(error);
    let result = results[0];
    if (result.pwd === pwdHash) {
        console.log('Login 성공');
    } else {
        console.log('Login 실패: 패스워드가 다릅니다.');
    }
});

conn.end();