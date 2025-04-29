const { selectArticlesById, selectArticles, selectArticleComments, addCommentToArticle } = require("../models/articles.model")

const getArticles = (req, res, next) => {
    selectArticles()
    .then((articles) => {
        res.status(200).send({articles: articles});
    }).catch(next);
}

const getArticlesById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticlesById(article_id)
        .then((article) => {
            res.status(200).send({article: article});
        }).catch(next); 
}

const getArticleComments = (req, res, next) => {
    const {article_id} = req.params;
    selectArticleComments(article_id)
    .then((comments) => {
        res.status(200).send({comments: comments});
    }).catch(next);
};

const postCommentToArticle = (req, res, next) => {    
    const {username, body} = req.body;
    const {article_id} = req.params;
    addCommentToArticle(username, body, article_id)
    .then((comment) => {
        res.status(201).send({comment: comment});
    }).catch(next);
};

module.exports = { getArticlesById, getArticles, getArticleComments, postCommentToArticle }