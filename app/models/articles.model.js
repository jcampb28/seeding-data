const db = require("../../db/connection");

const selectArticles = () => {
    return db.query(`        
        SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
        COUNT(comments.article_id) AS comment_count    
        FROM articles
        LEFT OUTER JOIN comments
        ON articles.article_id = comments.article_id
        GROUP BY articles.article_id      
        ORDER BY created_at DESC`)
        .then((result) => {         
            return result.rows;
        });
};

const selectArticlesById = (articleId) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({status: 404, msg: "No article with specified ID found"});
            };
            return result.rows[0];
        });
};

const selectArticleComments = (articleId) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then((result) => {        
        if (result.rows.length === 0) {
            return Promise.reject({status: 404, msg: "No article with specified ID found"});
        } else {
            return db.query(`
                SELECT * FROM comments
                WHERE article_id = $1
                ORDER BY created_at DESC`, [articleId])
                .then((result) => {                    
                    return result.rows;
                });
        };
    });    
};

const addCommentToArticle = (username, body, articleId) => {
    if (username === undefined || body === undefined) {
        return Promise.reject({status: 400, msg: "Bad Request"});
    } 
    if (username.length === 0) {
        return Promise.reject({status: 404, msg: "Username does not exist"});
    }
    if (body.length === 0) {
        return Promise.reject({status: 400, msg: "Bad Request"});    
    } 
    else {
        return db.query(`SELECT * FROM articles`)
        .then((result) => {    
            if (articleId > result.rows.length) {
                return Promise.reject({status: 404, msg: "No article with specified ID found"});
            } else {    
                return db.query(`
                    INSERT INTO comments (author, body, article_id) VALUES($1, $2, $3) RETURNING *`, [username, body, articleId])
                    .then((result) => {
                        return result.rows[0]
                    });                          
                };
            });
    };
};


module.exports = { selectArticlesById, selectArticles, selectArticleComments, addCommentToArticle }