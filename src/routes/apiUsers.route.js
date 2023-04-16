// Modules
const express = require("express");
const ReturnMessage = require("../models/returnMessage.model");
const geo = require("geoip-lite")

// Services
const arrReq = require("../services/arrreq.service");
const returnMessageService = require("../services/returnmessage.service");
const restrictionsService = require("../services/restrictions.service")

// Controllers
const userController = require("../controllers/user.controller")

// Work
const router = express.Router()

router.post("/create", async (req, res)=>{
    let paramsReq = arrReq.req(req.query, ["username","password","email","dob"]);
    if(paramsReq != true){
        returnMessageService(new ReturnMessage("107", `Missing parameter: ${paramsReq}`, 400, "error"), res);
        return;
    }
    returnMessageService((await userController.create(req.query.username, req.query.password, req.query.email, req.query.dob, req, res)), res);
    return;
})

router.get("/login", async (req, res)=>{
    let paramsReq = arrReq.req(req.query, ["usernameOrEmail", "password"]);
    if(paramsReq != true){
        returnMessageService(new ReturnMessage("405", `Missing parameter: ${paramsReq}`, 400, "error"), res);
        return;
    }
    returnMessageService((await userController.login(req.query.usernameOrEmail, req.query.password, req, res)), res);
    return;
})

router.get("/verify", async (req, res)=>{
    let token = req.query.token;
    if(!token){
        if(restrictionsService.isCapacity("sendVerificationEmail", req.socket.remoteAddress, res))return
        returnMessageService((await userController.sendVerificationEmail(req)), res);
        restrictionsService.addInstance("sendVerificationEmail", req.socket.remoteAddress)
        return;
    }
    returnMessageService((await userController.verifyEmail(token, req)), res);
})

router.get("/me", async (req, res)=>{
    returnMessageService((await userController.me(req)), res);
})

router.get("/:id", async (req, res) =>{ 
    let ra = req.socket.remoteAddress
    //if(restrictionsService.isCapacity("userGet", ra, res))return
    returnMessageService((await userController.get(req.params.id, req)), res);    
    //restrictionsService.addInstance("userGet", ra)
})

module.exports = router