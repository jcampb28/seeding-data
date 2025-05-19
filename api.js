const apiRouter = require("./app/routers/api.router")
const express = require("express");
const app = express();
const { handlePSQLErrors, handleCustomErrors, catchAllErrors } = require("./app/controllers/error.controller");
const cors = require("cors");

app.use(express.json());
app.use(cors())

// API router

app.use("/api", apiRouter)

// Single error handling

app.all("/*splat", (req, res) => {
    res.status(404).send({ msg: "Not Found!" })
});

// Error controllers

app.use(handlePSQLErrors);

app.use(handleCustomErrors);

app.use(catchAllErrors);

module.exports = app;