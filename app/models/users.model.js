const db = require("../../db/connection");

const selectUsers = () => {
    return db.query(`SELECT * FROM users`)
    .then((response) => {
        return response.rows;
    });
};

const selectUsersByUsername = (username) => {
    return db.query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((response) => {
        if (response.rows.length === 0) {
            return Promise.reject({status: 404, msg: "No users with that username found"})
        }
        return response.rows[0]
    });
};

module.exports = {selectUsers, selectUsersByUsername};