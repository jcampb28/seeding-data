const articlesRouter = require("express").Router();
const { getArticlesById, getArticles, getArticleComments, postCommentToArticle, patchArticleVotes, postNewArticle } = require("../controllers/articles.controller");

articlesRouter
    .route("/")
    .get(getArticles)
    .post(postNewArticle);

articlesRouter
    .route("/:article_id")
    .get(getArticlesById)
    .patch(patchArticleVotes);

articlesRouter
    .route("/:article_id/comments")
    .get(getArticleComments)
    .post(postCommentToArticle)

module.exports = articlesRouter;