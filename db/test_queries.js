const db = require("../connection");

db.query(`SELECT * FROM users`).then((result) => {
    console.log(result)
})