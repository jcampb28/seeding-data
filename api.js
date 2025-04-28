const express = require("express");
const app = express();
const { getApi } = require("./app/controllers/api.controller");
const { getTopics } = require("./app/controllers/topics.controller");
const { getArticlesById, getArticles, getArticleComments, postCommentToArticle } = require("./app/controllers/articles.controller")
const { handlePSQLErrors, handleCustomErrors, catchAllErrors } = require("./app/controllers/error.controller")

app.use(express.json());

// GET requests

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles/:article_id/comments", getArticleComments)

// POST requests

app.post("/api/articles/:article_id/comments", postCommentToArticle)

// Error handling

app.all("/*splat", (req, res) => {
    res.status(404).send({ msg: "Not Found" })
});

app.use(handlePSQLErrors)

app.use(handleCustomErrors);

app.use(catchAllErrors)

module.exports = app;