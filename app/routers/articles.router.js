const articlesRouter = require("express").Router();
const { getArticlesById, getArticles, getArticleComments, postCommentToArticle, patchArticleVotes, postNewArticle, deleteArticle } = require("../controllers/articles.controller");

articlesRouter
    .route("/")
    .get(getArticles)
    .post(postNewArticle);

articlesRouter
    .route("/:article_id")
    .get(getArticlesById)
    .patch(patchArticleVotes)
    .delete(deleteArticle);

articlesRouter
    .route("/:article_id/comments")
    .get(getArticleComments)
    .post(postCommentToArticle)

module.exports = articlesRouter;