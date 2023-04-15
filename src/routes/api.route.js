// Modules
const express = require("express");

// Routes
const apiUsersRouter = require("./apiUsers.route")
const apiPostsRouter = require("./apiPosts.route")

// Work
const router = express.Router()

router.use("/users", apiUsersRouter);
router.use("/posts", apiPostsRouter);

module.exports = router