// Modules
const express = require("express");

// Routes
const apiUsersRouter = require("./apiUsers.route")
const apiPostsRouter = require("./apiPosts.route")
const apiModerationRouter = require("./apiModeration.route")

// Services
const returnMessageService = require("../services/returnmessage.service")

// Models
const ReturnMessage = require("../models/returnMessage.model")

// Work
const router = express.Router()

router.use("/users", apiUsersRouter);
router.use("/posts", apiPostsRouter);
router.use("/moderation", apiModerationRouter)

router.route("*")
.get(
    (req, res)=>{
        returnMessageService(
            new ReturnMessage(
                '-5',
                "Unknown Endpoint",
                404,
                'error'
            ),
            res
        )
    }
)

module.exports = router