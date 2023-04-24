// Modules
const express = require("express");

// Services
const returnMessageService = require("../services/returnmessage.service");
const arrReqService = require("../services/arrreq.service")
const restrictionsService = require("../services/restrictions.service")

// Models
const ReturnMessage = require("../models/returnMessage.model"); 

// Controllers
const postsController = require("../controllers/posts.controller")

// Work
const router = express.Router()
const bodyparser = require('body-parser');
const urlencodedparser = bodyparser.urlencoded({extended:false})

router.post("/create", urlencodedparser, async (req, res)=>{
    let arrreq = arrReqService.req(req.body, ["content"])
    if(arrreq !== true){
        returnMessageService(new ReturnMessage("1306", `Missing parameter: ${arrreq}`, 400, 'error'), res)
        return
    }
    returnMessageService((await postsController.create(req.body.content, req)), res)
})

router.get("/feed/:type", async (req, res)=>{
    returnMessageService(await postsController.feed(req.params.type, req, req.query), res)
})

router.get("/delete/:id", async(req, res)=>{
    returnMessageService(await postsController.deletePost(req.params.id, req), res)
})

router.get("/:id", async (req, res)=>{
    let p = (await postsController.get(req.params.id, req))
    returnMessageService(p, res);
})


module.exports = router