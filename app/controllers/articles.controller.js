const { selectArticlesById, selectArticles, selectArticleComments, addCommentToArticle, updateArticleVotes, addNewArticle, removeArticle } = require("../models/articles.model")

// GET

const getArticles = (req, res, next) => {    
    const validQueries = ["sort_by", "order", "topic", "limit", "p"]   
    for (const key in req.query) {
        if (!validQueries.includes(key)) {
            return Promise.reject({status: 400, msg: "Bad Request"})
        }
    }
    const {sort_by, order, topic, limit, p} = req.query
    selectArticles({sort_by, order, topic, limit, p})
    .then((articles) => {
        res.status(200).send({articles});
    }).catch(next);
};

const getArticlesById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticlesById(article_id)
        .then((article) => {
            res.status(200).send({article});
        }).catch(next); 
};

const getArticleComments = (req, res, next) => {
    const validQueries = ["limit", "p"]   
    for (const key in req.query) {
        if (!validQueries.includes(key)) {
            return Promise.reject({status: 400, msg: "Bad Request"})
        }
    }
    const {article_id} = req.params;
    const {limit, p} = req.query;
    selectArticleComments(article_id, {limit, p})
    .then((comments) => {
        res.status(200).send({comments});
    }).catch(next);
};

// POST

const postCommentToArticle = (req, res, next) => {  
    const {username, body} = req.body;
    const {article_id} = req.params;
    addCommentToArticle(username, body, article_id)
    .then((comment) => {
        res.status(201).send({comment});
    }).catch(next);
};

const postNewArticle = (req, res, next) => {
    if (req.body.article_img_url === undefined) {
        req.body.article_img_url = "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        const {author, title, body, topic, article_img_url} = req.body
        addNewArticle({author, title, body, topic, article_img_url})
        .then((article) => {
            res.status(201).send({article});
        }).catch(next); 
    } else {
        const {author, title, body, topic, article_img_url} = req.body;
        addNewArticle({author, title, body, topic, article_img_url})
        .then((article) => {
            res.status(201).send({article});
        }).catch(next);
    };
};

// PATCH

const patchArticleVotes = (req, res, next) => {
    const {inc_votes} = req.body;
    const {article_id} = req.params;
    updateArticleVotes(inc_votes, article_id)
    .then((article) => {
        res.status(200).send({article})
    }).catch(next)
};

// DELETE

const deleteArticle = (req, res, next) => {
    const {article_id} = req.params;
    removeArticle(article_id)
    .then(() => {
        res.status(204).send()
    }).catch(next);
};

module.exports = { getArticlesById, getArticles, getArticleComments, postCommentToArticle, patchArticleVotes, postNewArticle, deleteArticle }