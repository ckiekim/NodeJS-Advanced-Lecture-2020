module.exports.updateForm = function(result) {
    return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>사용자 관리</title>
    </head>
    <body>
        <h3>패스워드 변경</h3>
        <hr>
        <form action="/update" method="post">
            <input type="hidden" name="uid" value="${result.uid}">
            <table>
                <tr>
                    <td><label for="pwd">패스워드</label></td>
                    <td><input type="password" name="pwd" id="pwd"></td>
                </tr>
                <tr>
                    <td><label for="pwd2">패스워드 확인</label></td>
                    <td><input type="password" name="pwd2" id="pwd2"></td>
                </tr>
                <tr>
                    <td colspan="2"><input type="submit" value="변경"></td>
                </tr>
            </table>
        </form>
    </body>
    </html>
    `;
}