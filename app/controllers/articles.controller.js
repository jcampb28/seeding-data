const { selectArticlesById, selectArticles, selectArticleComments } = require("../models/articles.model")

const getArticles = (req, res, next) => {
    selectArticles()
    .then((articles) => {
        res.status(200).send(articles)
    }).catch(next);
}

const getArticlesById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticlesById(article_id)
        .then((article) => {
            res.status(200).send(article)
        }).catch(next); 
}

const getArticleComments = (req, res, next) => {
    const {article_id} = req.params;
    selectArticleComments(article_id)
    .then((comments) => {
        res.status(200).send(comments)
    }).catch(next);
};

module.exports = { getArticlesById, getArticles, getArticleComments }