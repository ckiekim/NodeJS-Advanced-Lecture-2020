const tplt = require('./template');
const ut = require('../util');

module.exports.view = function (navBar, result, replies) {
    let content = result.content.replace(/\n/g, '<br>');
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

	return `
		${tplt.header()}
        ${navBar}
<div class="container" style="margin-top: 90px;">  
    <div class="row">
        <div class="col-1"></div>
        <div class="col-7">
            <h4>${result.title}</h4>
            <h6>글번호: ${result.bid} | ${result.modTime}</h6>
        </div>
        <div class="col-3" style="text-align: right;">
            <h4>${result.uname}</h4>
            <h6>조회 ${result.viewCount+1}&nbsp;&nbsp;댓글 ${result.replyCount}</h6>
        </div>
        <div class="col-1"></div>
        <div class="col-12"><hr></div>
        <div class="col-1"></div>
        <div class="col-10">
            <p>${content}</p>
        </div>
        <div class="col-1"></div>
        <div class="col-10"></div>
        <div class="col-2">
            <span style="font-size: 1.5em;">
                <a href="/bbs/update/${result.bid}"><i class="fas fa-edit"></i></a>&nbsp;
                <a href="/bbs/delete/${result.bid}"><i class="fas fa-trash-alt"></i></a>
            </span>
        </div>
        <div class="col-12"><hr></div>
        <div class="col-1"></div>
        <div class="col-10">
            ${cards}
            <form class="form-inline" action="/bbs/reply" method="post">
                <input type="hidden" name="bid" value="${result.bid}">
                <label for="content" class="ml-5 mt-3 mr-3">댓글</label>
                <textarea class="ml-3 mt-3 mr-3" id="content" name="content" rows="3" cols="80"></textarea>
                <button type="submit" class="btn btn-primary ml-3 mt-3 mr-5">등록</button>
            </form>
        </div>
        <div class="col-1"></div>
    </div>
</div>

		${tplt.footer()}
    `;
}