const express = require("express");
const app = express();
const {PORT = 9090} = process.env;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
})