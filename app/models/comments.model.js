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

const updateCommentVotes = (incVotes, commentId) => {
    if (incVotes === undefined) {
        return Promise.reject({status: 400, msg: "Bad Request"});
    }
    else {
        return db.query(`
            UPDATE comments
            SET votes = votes + $1
            WHERE comment_id = $2
            RETURNING *`, [incVotes, commentId])
            .then((response) => {
                if (response.rows.length === 0) {
                    return Promise.reject({status: 404, msg: "No comment with specified ID found"})
                }
                return response.rows[0]
            });
    };
};

module.exports = {removeCommentById, updateCommentVotes};