const db = require("../../db/connection");

const removeCommentById = (commentId) => {
    return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [commentId])
    .then((response) => {
        if (response.rows.length === 0) {
            return Promise.reject({status: 404, msg: "No comment with specified ID found"});
        } 
        else {
            return db.query(`DELETE FROM comments WHERE comment_id = $1`, [commentId])
            .then((response) => {
                return response.rows
            });
        };
    });
};

module.exports = {removeCommentById};