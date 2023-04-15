// Modules
const express = require("express");

// Services
const returnMessageService = require("../services/returnmessage.service");

// Models
const ReturnMessage = require("../models/returnMessage.model"); 

// Controllers
const postsController = require("../controllers/posts.controller")

// Work
const router = express.Router()

router.get("/:id", async (req, res)=>{
    let p = (await postsController.get(req.params.id, req.socket.remoteAddress))
    console.log(p)
    returnMessageService(p, res);
})

router.get("/feed/:type", async (req, res)=>{
    returnMessageService(await postsController.feed(req.params.type, req.query), res)
})

module.exports = router