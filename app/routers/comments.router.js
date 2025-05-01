const commentsRouter = require("express").Router();
const { deleteCommentById, patchCommentVotes } = require("../controllers/comments.controller");

commentsRouter
    .route("/:comment_id")
    .delete(deleteCommentById)
    .patch(patchCommentVotes);

module.exports = commentsRouter