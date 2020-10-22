const crypto = require('crypto');
const moment = require('moment');
const alert = require('./view/alertMsg');

module.exports = {
    generateHash:   function(something) {
        // SHA: Secure Hash Algorithm
        let shasum = crypto.createHash('sha256');   // sha256, sha512
        shasum.update(something);
        return shasum.digest('base64');  // hex, base64
    },
    // DB에서 읽은 시간을 오늘이면 시간을 어제까지는 날짜를 반환
    getDisplayTime:     function(dt) {
        let today = moment().format('YYYY-MM-DD');
        let dbtime = moment(dt).format('YYYY-MM-DD HH:mm:ss');
        return (dbtime.indexOf(today) == 0) ?
        dbtime.substring(11) : dbtime.substring(0,10);
    },
    // 로그인 여부 및 적절한 권한을 갖고 있는지 확인
    isLoggedIn:     function(req, res, next) {
        if (!req.session.uid) {    
            res.redirect('/login');
        } else {
            next();
        }
    },
    hasRight:   function(req, res, next) {
        if (req.params.uid !== req.session.uid) {
            let html = alert.alertMsgHistory('권한이 없습니다.');
            res.send(html);
            //res.send('<script>window.history.go(-1)</script>');
        } else {
            next();
        }
    },
    isAdmin:    function(req, res, next) {
        if (req.session.uid !== 'admin') {
            let html = alert.alertMsgHistory('권한이 없습니다.');
            res.send(html);
        } else {
            next();
        }
    },
    isAdminOrOwner: function(req, res, next) {
        if (req.session.uid !== 'admin' && req.params.uid != req.session.uid) {
            let html = alert.alertMsgHistory('권한이 없습니다.');
            res.send(html);
        } else {
            next();
        }
    }
}