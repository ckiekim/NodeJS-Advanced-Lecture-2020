module.exports = {
    header:     function() {
        return `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <title>My BBS</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css"> 
            <link rel="stylesheet" href="/fontawesome-free-5.15.1-web/css/all.min.css">
            <script src="/jquery/jquery.min.js"></script>
            <script src="/popper/popper.min.js"></script>
            <script src="/bootstrap/js/bootstrap.min.js"></script>
        </head>
        <body>
        `;
    },
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
                    <a class="nav-link" href="/logout">로그아웃</a>
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
    footer:     function() {
        return `
            <nav class="navbar navbar-expand-lg navbar-light bg-light justify-content-center fixed-bottom">
                <span class="navbar-text">
                    Copyright &copy; 2020 Hoseo Institute of Big Data
                </span>
            </nav>
        </body>
        </html>
        `;
    }
}