module.exports.loginForm = function() {
    return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>사용자 관리</title>
    </head>
    <body>
        <h3>로그인</h3>
        <hr>
        <form action="/login" method="post">
            <table>
                <tr>
                    <td><label for="uid">사용자 ID</label></td>
                    <td><input type="text" name="uid" id="uid"></td>
                </tr>
                <tr>
                    <td><label for="pwd">패스워드</label></td>
                    <td><input type="password" name="pwd" id="pwd"></td>
                </tr>
                <tr>
                    <td colspan="2" style="text-align: center">
                        <input type="submit" value="로그인">
                    </td>
                </tr>
            </table>
        </form>
    </body>
    </html>
    `;
}