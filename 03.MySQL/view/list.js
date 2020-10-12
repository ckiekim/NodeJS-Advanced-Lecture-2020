module.exports.mainForm = function(rows) {
    let tableRow = '';
    for (let row of rows) {
        tableRow += `<tr>
                        <td>${row.sid}</td>
                        <td>${row.title}</td>
                        <td>${row.lyrics}</td>
                    </tr>`;
    }
    return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>노래 조회</title>
</head>
<body>
    <h3>노래 조회</h3>
    <hr>
    <table>
        <tr>
            <th>sid</th>
            <th>제목</th>
            <th>가사</th>
        </tr>
        ${tableRow}
    </table>
</body>
</html>
    `;
}
