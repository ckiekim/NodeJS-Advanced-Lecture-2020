const template = require('./template');

module.exports.view = function(navBar, data) {
	return `
        ${template.header()}
        ${navBar}

<div class="container" style="margin-top: 90px;">  
    <div class="row">
        <div class="col-12">
            <h3>회원정보 상세조회</h3>
            <hr>
        </div>
        <div class="col-3"></div>
        <div class="col-6">
            <table class="table table-condensed">
                <tr>
                    <td>사용자 ID</td>
                    <td>${data.uid}</td>
                </tr>
                <tr>
                    <td>이름</td>
                    <td>${data.uname}</td>
                </tr>
                <tr>
                    <td>전화번호</td>
                    <td>${data.tel}</td>
                </tr>
                <tr>
                    <td>이메일</td>
                    <td>${data.email}</td>
                </tr>
                <tr>
                    <td colspan="2" style="text-align: center;">
                        <button class="btn btn-primary" onclick="location.href='/bbs/list/1'">확인</button>
                    </td>
                </tr>
            </table>
        </div>
        <div class="col-3"></div>
    </div>
</div>

		${template.footer()}
    `;
}