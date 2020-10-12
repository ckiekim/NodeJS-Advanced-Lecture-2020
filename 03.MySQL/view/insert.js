module.exports.insertForm = function() {
    return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Song Form</title>
    </head>
    <body>
        <h3>Login Page</h3>
        <hr>
        <form action="/insert" method="post">
            <table>
                <tr>
                    <td><label for="title">노래 제목</label></td>
                    <td><input type="text" name="title" id="title"></td>
                </tr>
                <tr>
                    <td><label for="lyrics">가사</label></td>
                    <td><input type="text" name="lyrics" id="lyrics"></td>
                </tr>
                <tr>
                    <td colspan="2"><input type="submit" value="제출"></td>
                </tr>
            </table>
        </form>
    </body>
    </html>
    `;
}