const dm = require('./db-module');

dm.getBbsList(5)
    .then(rows => {
        for (let row of rows)
            console.log(row);
    })
    .catch(console.log);

/* dm.getBbsList(5)
    .then(console.log)
    .catch(console.log); */