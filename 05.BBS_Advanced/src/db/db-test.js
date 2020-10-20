const dm = require('./db-module');

/* dm.getBbsList(10)
    .then(rows => {
        for (let row of rows)
            console.log(row);
    })
    .catch(console.log); */

/* dm.getBbsList(5)
    .then(console.log)
    .catch(console.log); */

dm.getBbsTotalCount()
    .then(result => {console.log(result.count)})
    .then(() => dm.getUserInfo('admin'))
    .then(console.log)
    .then(dm.increaseViewCount(1004))
    .then(() => process.exit())

/* dm.getUserInfo('admin')
    .then(console.log); */