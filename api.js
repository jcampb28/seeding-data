const express = require("express");
const app = express();
const { getApi } = require("./app/controllers/api.controller");
const { getTopics } = require("./app/controllers/topics.controller");
const { handleCustomError, catchAllErrors } = require("./app/controllers/error.controller")

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.all("/*splat", (req, res) => {    
    res.status(404).send({msg: "Not Found"})
});

app.use(handleCustomError);

app.use(catchAllErrors)

module.exports = app;