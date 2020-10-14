const fs = require('fs');
const mysql = require('mysql');
let info = fs.readFileSync('./mysql.json', 'utf8');
let config = JSON.parse(info);

module.exports = {
    getConnection:  function() {
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
    },
    // BBS DB
    getBbsList:     function(callback) {
        let conn = this.getConnection();
        let sql = `SELECT b.bid, b.uid, u.uname, b.title, b.content, b.modTime, b.viewCount
                    FROM bbs AS b
                    JOIN users AS u
                    ON b.uid=u.uid
                    WHERE b.isDeleted=0
                    ORDER BY b.bid DESC 
                    LIMIT 10;`;
        conn.query(sql, params, (error, fields) => {
            if (error)
                console.log(error);
            callback();
        });
        conn.end();
    },
    getBbsTotalCount:     function(callback) {
        let conn = this.getConnection();
        let sql = `SELECT count(*) FROM bbs where isDeleted=0;`;
        conn.query(sql, params, (error, fields) => {
            if (error)
                console.log(error);
            callback();
        });
        conn.end();
    },


    // 사용자 DB
    registerUser:     function(params, callback) {
        let conn = this.getConnection();
        let sql = `insert into users(uid, pwd, uname, tel, email) values(?,?,?,?,?);`;
        conn.query(sql, params, (error, fields) => {
            if (error)
                console.log(error);
            callback();
        });
        conn.end();
    }
}