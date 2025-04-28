const express = require("express");
const app = express();
const { getApi } = require("./app/controllers/api.controller");
const { getTopics } = require("./app/controllers/topics.controller");
const { getArticlesById } = require("./app/controllers/articles.controller")
const { handlePSQLErrors, handleCustomErrors, catchAllErrors } = require("./app/controllers/error.controller")

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.all("/*splat", (req, res) => {
    res.status(404).send({ msg: "Not Found" })
});

app.use(handlePSQLErrors)

app.use(handleCustomErrors);

app.use(catchAllErrors)

module.exports = app;