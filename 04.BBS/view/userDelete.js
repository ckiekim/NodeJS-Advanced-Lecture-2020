const tplt = require('./template');

module.exports.delete = function (navBar, uid) {
	return `
		${tplt.header()}
        ${navBar}
<div class="container" style="margin-top: 90px;">  
    <div class="row">
        <div class="col-12">
            <h3>회원정보 삭제</h3>
            <hr>
        </div>
        <div class="col-3"></div>
        <div class="col-6">
            <div class="card border-warning mt-3">
                <div class="card-body">
                    <h5 class="card-title">삭제하시겠습니까?</h5>
                    <p class="card-text text-center">
                        <button class="btn btn-primary" onclick="location.href='/user/deleteConfirm/${uid}'">삭제</button>
                        <button class="btn btn-secondary" onclick="location.href='/user/list/${uid}'">취소</button>
                    </p>
                </div>
            </div>
        </div>
        <div class="col-3"></div>
    </div>
</div>

		${tplt.footer()}
    `;
}