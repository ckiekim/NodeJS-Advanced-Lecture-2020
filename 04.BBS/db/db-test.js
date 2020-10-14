const fs = require('fs');
const mysql = require('mysql');
let info = fs.readFileSync('./mysql.json', 'utf8');
let config = JSON.parse(info);

function getConnection() {
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
}

/* let sqlUsers = `
    create table if not exists users (
        uid varchar(20) not null primary key,
        pwd char(44) not null,
        uname varchar(20) not null,
        tel varchar(20),
        email varchar(40),
        regDate datetime default current_timestamp,
        isDeleted int default 0
    );
`;
let conn = getConnection();
conn.query(sqlUsers, function(error, fields) {
    if (error)
        console.log(error);
});
conn.end(); */

/* let sqlBbs = `
    create table if not exists bbs (
        bid int not null primary key auto_increment,
        uid varchar(20) not null,
        title varchar(100) not null,
        content varchar(1000),
        modTime datetime default current_timestamp,
        viewCount int default 0,
        isDeleted int default 0,
        foreign key(uid) references users(uid)
    ) auto_increment=1001;
`;
let conn = getConnection();
conn.query(sqlBbs, function(error, fields) {
    if (error)
        console.log(error);
});
conn.end(); */

let bbsArray = [
    ['eskim', '미스터 션샤인', `2018년 방영한, 구한말을 배경으로 하는 한국 드라마.`],
    ['eskim', '도깨비', `불멸의 삶을 끝내기 위해 인간 신부가 필요한 도깨비(공유)와 그와 함께 기묘한 동거를 시작한 기억상실증 저승사자(이동욱). 그런 그들 앞에 '도깨비 신부'라 주장하는 '죽었어야 할 운명'의 소녀 지은탁(김고은)이 나타나며 벌어지는 신비로운 낭만설화이다.`],
    ['eskim', '태양의 후예', `낯선 땅 극한의 환경 속에서 사랑과 성공을 꿈꾸는 젊은 군인과 의사들을 통해 삶의 가치를 담아낸 블록버스터급 휴먼 멜로 드라마`],
    ['eskim', '시크릿 가든', `싸가지 없는 부잣집 도련님과 스턴트맨으로 하루하루 간신히 살아가는 도시 빈민 아가씨의 연애라는 진부하기 짝이 없는 설정, 거기에 남녀의 영혼이 뒤바뀐다는 클리셰를 사용하였다.`],
    ['eskim', '파리의 연인', `"애기야 가자"
    "저 남자가 내 사람이다. 저 남자가 내 애인이다 왜 말을 못하냐고!"`]
];
let sqlInsert = `insert into bbs(uid, title, content) values(?,?,?);`;

let conn = getConnection();
for (let params of bbsArray) {
    conn.query(sqlInsert, params, function(error, fields) {
        if (error)
            console.log(error);
    });
}
conn.end();
