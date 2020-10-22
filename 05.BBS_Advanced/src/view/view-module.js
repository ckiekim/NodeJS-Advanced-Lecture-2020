const ut = require('../util');

module.exports = {
    navBar:     function(uname) {
        return `
        <nav class="navbar navbar-expand-lg bg-dark navbar-dark fixed-top">
            <a class="navbar-brand" href="#">
                <img src="/img/hoseo.png" alt="호서직업능력개발원"
                    style="height: 40px; margin-left: 50px; margin-right: 100px;">
            </a>
            <ul class="nav mr-auto">
                <li class="nav-item nav-light">
                    <a class="nav-link" href="/"><i class="fas fa-home"></i>홈</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/bbs/write"><i class="far fa-edit"></i>글쓰기</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/user/dispatch"><i class="far fa-user"></i>사용자</a>
                </li>
                <li class="nav-item ml-5">
                    <a class="nav-link" href="/logout"><i class="fas fa-sign-out-alt"></i>로그아웃</a>
                </li>
            </ul>
            <nav class="navbar navbar-light mr-4">
                <form class="form-inline" action="/bbs/search" method="post">
                    <input class="form-control mr-sm-2" type="search" placeholder="검색" aria-label="Search" name="keyword">
                    <button class="btn btn-outline-light my-2 my-sm-0" type="submit"><i class="fas fa-search"></i></button>
                </form>
            </nav>
            <div class="navbar-text fixed-right mr-3">
                ${uname}님 반갑습니다.
            </div>
        </nav>
        `;
    },
    bbsList_trs:    function(data) {
        let trs = '';
        for (let row of data) {
            let displayTime = ut.getDisplayTime(row.modTime);
            let title = (row.replyCount == 0) ? row.title :
                `${row.title}<span class="text-danger">[${row.replyCount}]</span>`;
            trs += `<tr class="d-flex">
                        <td class="col-1" style="text-align: center;">${row.bid}</td>
                        <td class="col-6"><a href="/bbs/bid/${row.bid}"><strong>${title}</strong></a></td>
                        <td class="col-2" style="text-align: center;">${row.uname}</td>
                        <td class="col-2" style="text-align: center;">${displayTime}</td>
                        <td class="col-1" style="text-align: center;">${row.viewCount}</td>
                    </tr>
            `;
        }
        return trs;
    },
    bbsList_pages:  function(pageNo, startPage, endPage, totalPage) {
        let leftPage = (pageNo > 10) ? `/bbs/list/${Math.floor((pageNo-1)/10) * 10}` : '#';
        let pages = `<li class="page-item">
                        <a class="page-link active" href="${leftPage}" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span></a>
                    </li>`;
        for (let page = startPage; page <= endPage; page++) {
            if (page === pageNo)
                pages += `<li class="page-item active" aria-current="page">
                            <span class="page-link">
                                ${page}<span class="sr-only">(current)</span>
                            </span>
                        </li>`;
            else
                pages += `<li class="page-item"><a class="page-link" href="/bbs/list/${page}">${page}</a></li>`;
        }
        let rightPage = (endPage < totalPage) ? `/bbs/list/${Math.ceil(pageNo/10)*10 + 1}` : '#';
        pages += `<li class="page-item">
                    <a class="page-link" href="${rightPage}" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span></a>
                </li>`;
        return pages;
    },
    bbsView_cards:  function(replies) {
        let cards = '';
        for (let reply of replies) {
            cards += (reply.isMine == 0) ?
                    `<div class="card bg-light text-dark mt-1" style="margin-right: 45%;">` :
                    `<div class="card text-right mt-1" style="margin-left: 60%;">`;
            cards += `
                        <div class="card-body">
                            ${reply.uname}&nbsp;&nbsp;${reply.regTime}<br>
                            ${reply.content.replace(/\r/g, '<br>')}
                        </div>
                    </div>`;
        }
        return cards;
    },
    userList_trs:   function(data) {
        let trs = '';
        for (let row of data) {
            trs += `<tr>
                        <td style="text-align: center;"><a href="/user/uid/${row.uid}">${row.uid}</a></td>
                        <td style="text-align: center;"><a href="/user/uid/${row.uid}"><strong>${row.uname}</strong></a></td>
                        <td style="text-align: center;"><img src="${row.photo}" height="30"></td>
                        <td style="text-align: center;">${row.tel}</td>
                        <td style="text-align: center;">${row.email}</td>
                        <td style="text-align: center;">${row.regDate}</td>
                        <td style="text-align: center;">
                            <a href="/user/delete/${row.uid}"><i class="fas fa-trash-alt"></i></a></td>
                    </tr>
            `;
            /* trs += `<tr class="d-flex">
                        <td class="col-2" style="text-align: center;"><a href="/user/uid/${row.uid}">${row.uid}</a></td>
                        <td class="col-2" style="text-align: center;"><a href="/user/uid/${row.uid}"><strong>${row.uname}</strong></a></td>
                        <td class="col-2" style="text-align: center;">${row.tel}</td>
                        <td class="col-3" style="text-align: center;">${row.email}</td>
                        <td class="col-2" style="text-align: center;">${row.regDate}</td>
                        <td class="col-1" style="text-align: center;">
                            <a href="/user/delete/${row.uid}"><i class="fas fa-trash-alt"></i></a></td>
                    </tr>
            `; */
        }
        return trs;
    },
    userList_pages:     function(pageNo, totalPage) {
        let pages = `<li class="page-item disabled">
                    <a class="page-link active" href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span></a>
                </li>`;
        for (let page=1; page <= totalPage; page++) {
            if (page === pageNo)
                pages += `<li class="page-item active" aria-current="page">
                        <span class="page-link">
                            ${page}<span class="sr-only">(current)</span>
                        </span>
                    </li>`;
            else
                pages += `<li class="page-item"><a class="page-link" href="/user/list/${page}">${page}</a></li>`;
        }
        pages += `<li class="page-item">
                    <a class="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span></a>
                </li>`;
        return pages;
    }
}