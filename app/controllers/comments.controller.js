const { removeCommentById } = require("../models/comments.model");

// DELETE

const deleteCommentById = (req, res, next) => {
    console.log("comments controller")
    const {comment_id} = req.params;    
    removeCommentById(comment_id)
    .then((response) => {
        res.status(204).send({response: response})
    }).catch(next);
};

module.exports = {deleteCommentById};