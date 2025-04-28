const { selectArticlesById, selectArticles } = require("../models/articles.model")

const getArticles = (req, res, next) => {
    selectArticles()
    .then((articles) => {
        console.log(articles)
        res.status(200).send(articles)
    }).catch(next)
}

const getArticlesById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticlesById(article_id)
        .then((article) => {
            res.status(200).send(article)
        }).catch(next) 
}

module.exports = { getArticlesById, getArticles }