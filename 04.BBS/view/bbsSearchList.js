const tplt = require('./template');
const ut = require('../util');

module.exports.list = function (navBar, data) {
    let trs = '';
    for (let row of data) {
        let displayTime = ut.getDisplayTime(row.modTime);
        let title = (row.replyCount == 0) ? row.title :
            `${row.title}<span class="text-danger">[${row.replyCount}]</span>`;
        trs += `<tr class="d-flex">
                    <td class="col-1" style="text-align: center;">${row.bid}</td>
                    <td class="col-7"><a href="/bbs/bid/${row.bid}"><strong>${title}</strong></a></td>
                    <td class="col-1" style="text-align: center;">${row.uname}</td>
                    <td class="col-2" style="text-align: center;">${displayTime}</td>
                    <td class="col-1" style="text-align: center;">${row.viewCount}</td>
                </tr>
        `;
    }

	return `
		${tplt.header()}
        ${navBar}
<div class="container" style="margin-top: 90px;">  
    <div class="row">
        <div class="col-12">
            <h3>게시글 검색 결과</h3>
            <hr>
        </div>
        <div class="col-1"></div>
        <div class="col-10">
            <table class="table table-condensed table-hover">
                <tr class="table-secondary d-flex">
                    <td class="col-1" style="text-align: center;"><strong>번호</strong></td>
                    <td class="col-7" style="text-align: center;"><strong>제목</strong></td>
                    <td class="col-1" style="text-align: center;"><strong>글쓴이</strong></td>
                    <td class="col-2" style="text-align: center;"><strong>날짜/시간</strong></td>
                    <td class="col-1" style="text-align: center;"><strong>조회수</strong></td>
                </tr>
                ${trs}
            </table>
        </div>
        <div class="col-1"></div>
    </div>
</div>

		${tplt.footer()}
    `;
}