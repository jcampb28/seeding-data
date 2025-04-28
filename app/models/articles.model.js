const db = require("../../db/connection");

const selectArticlesById = (articleId) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({status: 404, msg: "No article with specified ID found"})
            }
            return result.rows[0];
        });
};

module.exports = { selectArticlesById }