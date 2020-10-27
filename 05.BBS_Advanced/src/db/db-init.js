const fs = require('fs');
const mysql = require('mysql2/promise');
let info = fs.readFileSync('./db/mysql.json', 'utf8');
let config = JSON.parse(info);
const connectionPool = mysql.createPool(config);

async function exeQuery(sql) {
    try {
        let conn = await connectionPool.getConnection(async conn => conn);
        let [rows] = await conn.query(sql);
        conn.release();
        return rows;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function exeQueryWithParams(sql, params) {
    try {
        let conn = await connectionPool.getConnection(async conn => conn);
        let [rows] = await conn.query(sql, params);
        conn.release();
        return rows;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const sqlUsers = `
    create table if not exists users (
        uid varchar(20) not null primary key,
        pwd char(44) not null,
        uname varchar(20) not null,
        tel varchar(20),
        email varchar(40),
        regDate datetime default current_timestamp,
        isDeleted int default 0,
        photo varchar(80)
    );
`;
const sqlBbs = `
    create table if not exists bbs (
        bid int not null primary key auto_increment,
        uid varchar(20) not null,
        title varchar(100) not null,
        content varchar(1000),
        modTime datetime default current_timestamp,
        viewCount int default 0,
        isDeleted int default 0,
        replyCount int default 0,
        foreign key(uid) references users(uid)
    ) auto_increment=1001;
`;
const replyBbs = `
    create table if not exists reply (
        rid int not null primary key auto_increment,
        bid int not null,
        uid varchar(20) not null,
        content varchar(100),
        regTime datetime default current_timestamp,
        isMine int default 0,
        foreign key(bid) references bbs(bid),
        foreign key(uid) references users(uid)
    );
`;
const users = [
    ['admin', 'A6xnQhbz4Vx2HuGl4lXwZ5U2I8iziLRFnhP5eNfIRvQ=', '관리자', '010-2345-6789', 'admin@hoseo.com', '/upload/blank.png'],
    ['eskim', 'A6xnQhbz4Vx2HuGl4lXwZ5U2I8iziLRFnhP5eNfIRvQ=', '김은숙', '010-9876-5432', 'eskim@hoseo.com', '/upload/blank.png'],
    ['wjlee', 'A6xnQhbz4Vx2HuGl4lXwZ5U2I8iziLRFnhP5eNfIRvQ=', '이우정', '010-3456-7890', 'wjlee@hoseo.com', '/upload/blank.png'],
    ['djy', 'A6xnQhbz4Vx2HuGl4lXwZ5U2I8iziLRFnhP5eNfIRvQ=', '대조영', '010-2323-7878', 'djy@korea.com', '/upload/blank.png'],
    ['gdhong', 'A6xnQhbz4Vx2HuGl4lXwZ5U2I8iziLRFnhP5eNfIRvQ=', '홍길동', '010-9898-4567', 'gdhong@korea.com', '/upload/blank.png']
];
const sqlRegister = `insert into users(uid, pwd, uname, tel, email, photo) values(?,?,?,?,?,?);`;
const bbsArray = [
    ['eskim', '미스터 션샤인', `2018년 방영한, 구한말을 배경으로 하는 한국 드라마.`],
    ['eskim', '도깨비', `불멸의 삶을 끝내기 위해 인간 신부가 필요한 도깨비(공유)와 그와 함께 기묘한 동거를 시작한 기억상실증 저승사자(이동욱). 그런 그들 앞에 '도깨비 신부'라 주장하는 '죽었어야 할 운명'의 소녀 지은탁(김고은)이 나타나며 벌어지는 신비로운 낭만설화이다.`],
    ['eskim', '태양의 후예', `낯선 땅 극한의 환경 속에서 사랑과 성공을 꿈꾸는 젊은 군인과 의사들을 통해 삶의 가치를 담아낸 블록버스터급 휴먼 멜로 드라마`],
    ['eskim', '시크릿 가든', `싸가지 없는 부잣집 도련님과 스턴트맨으로 하루하루 간신히 살아가는 도시 빈민 아가씨의 연애라는 진부하기 짝이 없는 설정, 거기에 남녀의 영혼이 뒤바뀐다는 클리셰를 사용하였다.`],
    ['eskim', '파리의 연인', `"애기야 가자"
    "저 남자가 내 사람이다. 저 남자가 내 애인이다 왜 말을 못하냐고!"`],
    ['wjlee', '슬기로운 의사생활', `누군가는 태어나고 누군가는 삶을 끝내는, 인생의 축소판이라 불리는 병원에서 평범한 듯 특별한 하루하루를 살아가는 사람들과 눈빛만 봐도 알 수 있는 20년지기 친구들의 케미스토리를 담은 드라마. 99학번 의대 동기 다섯 명을 중심으로 펼쳐지는 병원에서의 이야기를 그린다.`]
];
const sqlInsert = `insert into bbs(uid, title, content) values(?,?,?);`;
const replyArray = [
    [1005, 'djy', '좋습니다. 매우 훌륭한 작품입니다.'],
    [1005, 'gdhong', '매우매우 훌륭합니다.'],
    [1006, 'eskim', '너무 좋은 작품입니다. 잘 보았어요.']
];
const sqlInsertReply = `insert into reply(bid, uid, content) values(?,?,?);`;
const bbsReply = [
    [1, 1, 1006], [2, 2, 1005]
];
const replyUpdate = `update bbs set viewCount=?, replyCount=? where bid=?;`;

exeQuery(sqlUsers)
.then(() => {
    for (let params of users) {
        exeQueryWithParams(sqlRegister, params)
        .then(() => console.log('Insert users'))
        .catch(console.log);
    }   
})
.then(() => exeQuery(sqlBbs))
.then(() => {
    for (let params of bbsArray) {
        exeQueryWithParams(sqlInsert, params)
        .then(() => console.log('Insert bbs'))
        .catch(console.log);
    }
})
.then(() => exeQuery(replyBbs))
.then(() => {
    for (let params of replyArray) {
        exeQueryWithParams(sqlInsertReply, params)
        .then(() => console.log('Insert reply'))
        .catch(console.log);
    }
})
.then(() => {
    for (let params of bbsReply) {
        exeQueryWithParams(replyUpdate, params)
        .then(() => console.log('Update replyCount'))
        .catch(console.log);
    }
})
.catch(console.log);

