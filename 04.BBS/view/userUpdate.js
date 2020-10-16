const template = require('./template');

module.exports.update = function(navBar, data) {
	return `
        ${template.header()}
        ${navBar}

<div class="container" style="margin-top: 90px;">  
    <div class="row">
        <div class="col-12">
            <h3>회원정보 수정</h3>
            <hr>
        </div>
        <div class="col-3"></div>
        <div class="col-6">
            <form action="/user/update" method="post">
                <input type="hidden" name="uid" value="${data.uid}">
                <input type="hidden" name="pwdHash" value="${data.pwd}">
                <table class="table table-borderless">
                    <tr>
                        <td><label for="uid">사용자 ID</label></td>
                        <td><span id="uid">${data.uid}</span></td>
                    </tr>
                    <tr>
                        <td><label for="pwd">패스워드</label></td>
                        <td><input type="password" name="pwd" id="pwd"></td>
                    </tr>
                    <tr>
                        <td><label for="pwd2">패스워드 확인</label></td>
                        <td><input type="password" name="pwd2" id="pwd2"></td>
                    </tr>
                    <tr>
                        <td><label for="uname">이름</label></td>
                        <td><input type="text" name="uname" id="uname" value="${data.uname}"></td>
                    </tr>
                    <tr>
                        <td><label for="tel">전화번호</label></td>
                        <td><input type="text" name="tel" id="tel" value="${data.tel}"></td>
                    </tr>
                    <tr>
                        <td><label for="email">이메일</label></td>
                        <td><input type="text" name="email" id="email" value="${data.email}"></td>
                    </tr>
                    <tr>
                        <td colspan="2" style="text-align: center;">
                            <input class="btn btn-primary" type="submit" value="수정">
                            <input class="btn btn-secondary" type="reset" value="리셋">
                        </td>
                    </tr>
                </table>
            </form>
        </div>
        <div class="col-3"></div>
    </div>
</div>

		${template.footer()}
    `;
}