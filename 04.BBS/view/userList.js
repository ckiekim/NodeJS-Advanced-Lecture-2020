const tplt = require('./template');
const ut = require('../util');

module.exports.list = function (navBar, data, pageNo, totalPage) {
    let trs = '';
    for (let row of data) {
        trs += `<tr class="d-flex">
                    <td class="col-2" style="text-align: center;">${row.uid}</td>
                    <td class="col-2" style="text-align: center;"><strong>${row.uname}</strong></td>
                    <td class="col-2" style="text-align: center;">${row.tel}</td>
                    <td class="col-3" style="text-align: center;">${row.email}</td>
                    <td class="col-2" style="text-align: center;">${row.regDate}</td>
                    <td class="col-1" style="text-align: center;">
                        <a href="/user/delete/${row.uid}"><i class="fas fa-trash-alt"></i></a></td>
                </tr>
        `;
    }
    // 페이지 지원
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
            pages += `<li class="page-item"><a class="page-link" href="/bbs/list/${page}">${page}</a></li>`;
    }
    pages += `<li class="page-item">
                <a class="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span></a>
            </li>`;

	return `
		${tplt.header()}
        ${navBar}
<div class="container" style="margin-top: 90px;">  
    <div class="row">
        <div class="col-12">
            <h3>사용자 목록</h3>
            <hr>
        </div>
        <div class="col-1"></div>
        <div class="col-10">
            <table class="table table-condensed table-hover">
                <tr class="table-secondary d-flex">
                    <td class="col-2" style="text-align: center;"><strong>아이디</strong></td>
                    <td class="col-2" style="text-align: center;"><strong>이름</strong></td>
                    <td class="col-2" style="text-align: center;"><strong>연락처</strong></td>
                    <td class="col-3" style="text-align: center;"><strong>이메일</strong></td>
                    <td class="col-2" style="text-align: center;"><strong>등록일</strong></td>
                    <td class="col-1" style="text-align: center;"><strong>액션</strong></td>
                </tr>
                ${trs}
            </table>
            <ul class="pagination justify-content-center">
                ${pages}
            </ul>
        </div>
        <div class="col-1"></div>
    </div>
</div>

		${tplt.footer()}
    `;
}