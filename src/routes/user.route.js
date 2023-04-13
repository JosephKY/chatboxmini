// Modules
const express = require("express");
const ReturnMessage = require("../models/returnMessage.model");

// Services
const userService = require("../services/user.service")
const arrReq = require("../services/arrreq.service");
const returnMessageService = require("../services/returnmessage.service")

// Work
const router = express.Router()

router.get("/create", async (req, res)=>{
    let paramsReq = arrReq.req(req.query, ["username","password","email"]);
    if(paramsReq != true){
        returnMessageService(new ReturnMessage("107", `Missing parameter: ${paramsReq}`, 400, "error"), res);
        return;
    }
    returnMessageService((await userService.create(req.query.username, req.query.password, req.query.email, req, res)), res);
    return;
})

router.get("/login", async (req, res)=>{
    let paramsReq = arrReq.req(req.query, ["password"]);
    if(paramsReq != true){
        returnMessageService(new ReturnMessage("406", `Missing parameter: ${paramsReq}`, 400, "error"), res);
        return;
    }
    returnMessageService((await userService.login(req.query.username, req.query.email, req.query.password, req, res)), res);
    return;
})

module.exports = router