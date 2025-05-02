const { response } = require("../../api");
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
    if (queries.limit && Number(queries.limit) / 1 !== Number(queries.limit)) {
        return Promise.reject({status: 400, msg: "Bad Request"});
    }
    if (queries.p && Number(queries.p) / 1 !== Number(queries.p)) {
        return Promise.reject({status: 400, msg: "Bad Request"});
    }
    if (queries.topic) {
        return isTopicValid(queries.topic)
        .then(() => {            
            queryString += ` WHERE topic = $${++totalQueries} GROUP BY articles.article_id ORDER BY created_at DESC`;                
            queryValues.push(queries.topic); 
            return db.query(queryString, queryValues)
            .then((result) => {    
                return paginator(result.rows, queries.limit, queries.p)
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
        return paginator(result.rows, queries.limit, queries.p)
        });
};

const selectArticlesById = (articleId) => {
    return db.query(`
        SELECT articles.*,
        COUNT(comments.article_id)::INT AS comment_count
        FROM articles        
        LEFT OUTER JOIN comments
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id`, [articleId])
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

const addNewArticle = (article) => {
    for (const key in article) {
        if (article[key] === undefined) {
            return Promise.reject({status: 400, msg: "Bad Request"});
        };
    };

    return isTopicValid(article.topic)
    .then(() => {
        return isAuthorValid(article.author)
        .then(() => {
            return db.query(`
                INSERT INTO articles (author, title, body, topic, article_img_url)
                VALUES($1, $2, $3, $4, $5) RETURNING *`, [article.author, article.title, article.body, article.topic, article.article_img_url])
            .then((result) => {
                const {article_id} = result.rows[0];
                return db.query(`
                    SELECT articles.author, articles.title, articles.body, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
                    COUNT(comments.article_id)::INT AS comment_count    
                    FROM articles
                    LEFT OUTER JOIN comments            
                    ON articles.article_id = comments.article_id
                    WHERE articles.article_id = $1
                    GROUP BY articles.article_id`, [article_id])
                    .then((response) => {
                         return response.rows[0];
                    });
            });       
        })
    });
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
            return Promise.reject({status: 404, msg: "Topic category not found"});  
        };        
    });    
};

const isAuthorValid = (author) => {
    return db.query(`SELECT * FROM users WHERE username = $1`, [author])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({status: 404, msg: "User not found"});  
        };        
    }); 
};

const paginator = (array, limit, p) => {
        let lowerLimit = 0;
        let upperLimit = 10;    
        const articles = {
            total_count: array.length,
            articleArr: array.slice(lowerLimit, upperLimit),
        };
        if (limit) {
            if (p) {
                upperLimit = limit * p;
                lowerLimit = upperLimit - limit;
                articles.articleArr = array.slice(lowerLimit, upperLimit);
                return articles;
            } else {
                articles.articleArr = array.slice(0, limit);
                return articles;
            };
        };
        if (p) {
            upperLimit = upperLimit * p
            lowerLimit = upperLimit - 10
            articles.articleArr = array.slice(lowerLimit, upperLimit)
            return articles            
        };
        return articles;
};
module.exports = { selectArticlesById, selectArticles, selectArticleComments, addCommentToArticle, updateArticleVotes, addNewArticle }


// NEW TESTS ADDED ON LINES 219 and 162!!!!!!!!!!