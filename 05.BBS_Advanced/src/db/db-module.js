const fs = require('fs');
const mysql = require('mysql2/promise');
let info = fs.readFileSync('./db/mysql.json', 'utf8');
let config = JSON.parse(info);
const connectionPool = mysql.createPool(config);

module.exports = {
    // BBS DB
    getBbsList:     async function(offset) {
        try {
            let conn = await connectionPool.getConnection(async conn => conn);
            let sql = `SELECT b.bid, b.uid, u.uname, b.title, b.content, 
                        b.modTime, b.viewCount, b.replyCount
                        FROM bbs AS b
                        JOIN users AS u
                        ON b.uid=u.uid
                        WHERE b.isDeleted=0
                        ORDER BY b.bid DESC 
                        LIMIT 10 offset ?;`;
            let [rows] = await conn.query(sql, offset);     // [offset]도 가능
            conn.release();
            return rows;
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    getBbsTotalCount:     async function() {
        try {
            let conn = await connectionPool.getConnection(async conn => conn);
            let sql = `SELECT count(*) as count FROM bbs where isDeleted=0;`;
            let [results] = await conn.query(sql);
            conn.release();
            return results[0];
        } catch (error) {
            console.log(error);
            return false;
        } 
    },
    getSearchList:     async function(keyword) {
        try {
            let conn = await connectionPool.getConnection(async conn => conn);
            let sql = `SELECT b.bid, b.uid, u.uname, b.title, b.content, 
                        b.modTime, b.viewCount, b.replyCount
                        FROM bbs AS b
                        JOIN users AS u
                        ON b.uid=u.uid
                        WHERE b.isDeleted=0 and b.title like ?
                        ORDER BY b.bid DESC;`;
            let [rows] = await conn.query(sql, keyword);     
            conn.release();
            return(rows); 
        } catch (error) {
            console.log(error);
            return false;
        } 
    },
    getBbsData:     async function(bid) {
        try {
            let conn = await connectionPool.getConnection(async conn => conn);
            let sql = `SELECT b.bid, b.uid, u.uname, b.title, b.content, 
                        DATE_FORMAT(b.modTime, '%Y-%m-%d %T') as modTime, 
                        b.viewCount, b.replyCount
                        FROM bbs AS b
                        JOIN users AS u
                        ON b.uid=u.uid
                        WHERE b.bid=?;`;
            let [results] = await conn.query(sql, bid);     
            conn.release();
            return results[0]; 
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    getReplyData:     async function(bid) {
        try {
            let conn = await connectionPool.getConnection(async conn => conn);
            let sql = `SELECT r.rid, r.bid, r.uid, u.uname, r.content, r.isMine,
                        DATE_FORMAT(r.regTime, '%Y-%m-%d %T') as regTime
                        FROM reply AS r
                        JOIN users AS u
                        ON r.uid = u.uid
                        WHERE r.bid=?;`;
            let [rows] = await conn.query(sql, bid);     
            conn.release();
            return rows; 
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    increaseViewCount:  async function(bid, inc) {
        try {
            if (inc == 0)
                return;
            let conn = await connectionPool.getConnection(async conn => conn);
            let sql = `update bbs set viewCount=viewCount+1 where bid=?;`;
            let [rows] = await conn.query(sql, bid);     
            conn.release();
            return; 
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    increaseReplyCount:  async function(bid) {
        try {
            let conn = await connectionPool.getConnection(async conn => conn);
            let sql = `update bbs set replyCount=replyCount+1 where bid=?;`;
            let [rows] = await conn.query(sql, bid);     
            conn.release();
            return; 
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    insertReply:  async function(params) {
        try {
            let conn = await connectionPool.getConnection(async conn => conn);
            let sql = `insert into reply(bid, uid, content, isMine) values(?,?,?,?);`;
            let [rows] = await conn.query(sql, params);     
            conn.release();
            return; 
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    insertBbs:  async function(params) {
        try {
            let conn = await connectionPool.getConnection(async conn => conn);
            let sql = `insert into bbs(uid, title, content) values(?,?,?);`;
            let [rows] = await conn.query(sql, params);     
            conn.release();
            return; 
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    updateBbs:  async function(params) {
        try {
            let conn = await connectionPool.getConnection(async conn => conn);
            let sql = `update bbs set title=?, content=?, modTime=now() where bid=?;`;
            let [rows] = await conn.query(sql, params);     
            conn.release();
            return; 
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    deleteBbs:  async function(bid) {
        try {
            let conn = await connectionPool.getConnection(async conn => conn);
            let sql = `update bbs set isDeleted=1 where bid=?;`;
            let [rows] = await conn.query(sql, bid);     
            conn.release();
            return; 
        } catch (error) {
            console.log(error);
            return false;
        }
    },

    // 사용자 DB
    registerUser:     async function(params) {
        try {
            let conn = await connectionPool.getConnection(async conn => conn);
            let sql = `insert into users(uid, pwd, uname, tel, email, photo) values(?,?,?,?,?,?);`;
            let [rows] = await conn.query(sql, params);     
            conn.release();
            return; 
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    getUserInfo:    async function(uid) {
        try {
            let conn = await connectionPool.getConnection(async conn => conn);
            let sql = `select * from users where uid like ? and isDeleted=0;`;
            let [results] = await conn.query(sql, uid);     // [uid]도 가능
            conn.release();
            return(results[0]);     // 주의할 것
        } catch (error) {
            console.log(error);
            return false;
        } 
    },
    getUserTotalCount:      async function() {
        try {
            let conn = await connectionPool.getConnection(async conn => conn);
            let sql = `select count(*) as count from users where isDeleted=0;`;
            let [results] = await conn.query(sql);
            conn.release();
            return(results[0]);     // 주의할 것
        } catch (error) {
            console.log(error);
            return false;
        } 
    },
    getUserList:      async function(offset) {
        try {
            let conn = await connectionPool.getConnection(async conn => conn);
            let sql = `SELECT uid, uname, photo, tel, email,
                        DATE_FORMAT(regDate, '%Y-%m-%d') AS regDate
                        FROM users
                        WHERE isDeleted=0
                        ORDER BY uname
                        LIMIT 10 OFFSET ?;`;
            let [rows] = await conn.query(sql, offset);
            conn.release();
            return(rows);     // 주의할 것
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    updateUser:     async function(params, photo, uid) {
        try {
            let conn = await connectionPool.getConnection(async conn => conn);
            let sql;
            if (photo) {
                sql = `update users set pwd=?, uname=?, tel=?, email=?, photo=? where uid=?;`;
                params.push(photo); 
                params.push(uid);
            } else {
                sql = `update users set pwd=?, uname=?, tel=?, email=? where uid=?;`;
                params.push(uid);
            }
            let [rows] = await conn.query(sql, params);     
            conn.release();
            return; 
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    deleteUser:     async function(uid) {
        try {
            let conn = await connectionPool.getConnection(async conn => conn);
            let sql = `update users set isDeleted=1 where uid=?;`;
            let [rows] = await conn.query(sql, uid);     
            conn.release();
            return; 
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}