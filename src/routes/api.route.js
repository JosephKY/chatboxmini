// Modules
const express = require("express");

// Routes
const apiUsersRouter = require("./apiUsers.route")
const apiPostsRouter = require("./apiPosts.route")
const apiModerationRouter = require("./apiModeration.route")

// Work
const router = express.Router()

router.use("/users", apiUsersRouter);
router.use("/posts", apiPostsRouter);
router.use("/moderation", apiModerationRouter)

module.exports = router