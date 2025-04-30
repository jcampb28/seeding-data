const db = require("../../db/connection");

// GET

const selectArticles = (queries) => {
    let queryString = `
        SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
        COUNT(comments.article_id)::INT AS comment_count    
        FROM articles
        LEFT OUTER JOIN comments
        ON articles.article_id = comments.article_id`
    let totalQueries = 0;
    const queryValues = [];
    const validOrder = ["ASC", "DESC"];
    const validQueries = ["author", "title", "article_id", "topic", "created_at", "votes", "article_img_url", "comment_count"];
    
    if (queries.sort_by && !validQueries.includes(queries.sort_by)) {
        return Promise.reject({status: 400, msg: "Bad Request"});
    };  
    if (queries.order && !validOrder.includes(queries.order.toUpperCase())) {
        return Promise.reject({status: 400, msg: "Bad Request"});
    };  
    if (queries.topic) {
        return isTopicValid(queries.topic)
        .then((result) => {            
            queryString += ` WHERE topic = $${++totalQueries} GROUP BY articles.article_id ORDER BY created_at DESC`;                
            queryValues.push(queries.topic); 
            return db.query(queryString, queryValues)
            .then((result) => {        
                return result.rows;
            });        
        });
    };
    queryString += ` GROUP BY articles.article_id`

    if (!queries.sort_by && !queries.order && !queries.topic) {
        queryString += ` ORDER BY created_at DESC`;
    };
    if (queries.sort_by && validQueries.includes(queries.sort_by)) {
        if (queries.sort_by === "comment_count") {
            queryString += ` ORDER BY comment_count`;
        } else {
            queryString += ` ORDER BY articles.${queries.sort_by}`;
            if (!queries.order) {
                queryString += ` DESC`;
            };
        };
    };
    if (queries.order && validOrder.includes(queries.order.toUpperCase())) {
        if (!queries.sort_by) {
            queryString += ` ORDER BY created_at ${queries.order.toUpperCase()}`
        } else {
            queryString += ` ${queries.order.toUpperCase()}`;
        };
    };  
      
    return db.query(queryString, queryValues)
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

// POST

const addCommentToArticle = (username, body, articleId) => {
    if (username === undefined || body === undefined) {
        return Promise.reject({status: 400, msg: "Bad Request"});
    };
    if (username.length === 0) {
        return Promise.reject({status: 404, msg: "Username does not exist"});
    };
    if (body.length === 0) {
        return Promise.reject({status: 400, msg: "Bad Request"});    
    }
    else {
        return db.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
        .then((result) => {    
            if (result.rows.length === 0) {
                return Promise.reject({status: 404, msg: "No article with specified ID found"});
            } else {    
                return db.query(`
                    INSERT INTO comments (author, body, article_id) VALUES($1, $2, $3) RETURNING *`, [username, body, articleId])
                    .then((result) => {
                        return result.rows[0];
                    });                          
                };
            });
    };
};

// PATCH

const updateArticleVotes = (incVotes, articleID) => {
    if (incVotes === undefined) {
        return Promise.reject({status: 400, msg: "Bad Request"});
    }
    else {
        return db.query(`
            UPDATE articles
            SET votes = votes + $1
            WHERE article_id = $2
            RETURNING *`, [incVotes, articleID])
            .then((result) => {     
                if (result.rows.length === 0) {
                    return Promise.reject({status: 404, msg: "No article with specified ID found"});
                }       
                return result.rows[0];
            });  
    };
};

// UTILITY

const isTopicValid = (topic) => {
    return db.query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({status: 404, msg: "No topic found"});  
        };        
    });    
};

module.exports = { selectArticlesById, selectArticles, selectArticleComments, addCommentToArticle, updateArticleVotes }