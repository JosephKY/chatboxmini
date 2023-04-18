// Modules
const express = require("express");
const ReturnMessage = require("../models/returnMessage.model");
const geo = require("geoip-lite")
const bodyParser = require('body-parser')

// Services
const arrReq = require("../services/arrreq.service");
const returnMessageService = require("../services/returnmessage.service");
const restrictionsService = require("../services/restrictions.service")

// Controllers
const userController = require("../controllers/user.controller")

// Work
const router = express.Router()
const bodyparser = require('body-parser');
const urlencodedparser = bodyparser.urlencoded({extended:false})

router.post("/create", urlencodedparser, async (req, res)=>{
    let paramsReq = arrReq.req(req.body, ["username","password","email","dob"]);
    if(paramsReq != true){
        returnMessageService(new ReturnMessage("107", `Missing parameter: ${paramsReq}`, 400, "error"), res);
        return;
    }
    returnMessageService((await userController.create(req.body.username, req.body.password, req.body.email, req.body.dob, req, res)), res);
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

router.get("/usernameTaken", async (req, res) => {
    let paramsReq = arrReq.req(req.query, ["username"]);
    if(paramsReq != true){
        returnMessageService(new ReturnMessage("1600", `Missing parameter: ${paramsReq}`, 400, "error"), res);
        return;
    }
    returnMessageService((await userController.usernameTaken(req.query.username)), res);
})

router.get("/resetpassword", async(req, res)=>{
    let paramsReq = arrReq.req(req.query, ["usernameOrEmail"]);
    if(paramsReq != true){
        returnMessageService(new ReturnMessage("1703", `Missing parameter: ${paramsReq}`, 400, "error"), res);
        return;
    }
    returnMessageService((await userController.sendResetEmail(req.query.usernameOrEmail, req)), res)
})

router.get("/setpassword", async(req, res)=>{
    let paramsReq = arrReq.req(req.query, ["token", "newPassword"]);
    if(paramsReq != true){
        returnMessageService(new ReturnMessage("1715", `Missing parameter: ${paramsReq}`, 400, "error"), res);
        return;
    }
    returnMessageService((await userController.resetPassword(req.query.token, req.query.newPassword, req)), res)
})

router.get("/:id", async (req, res) =>{ 
    let ra = req.socket.remoteAddress
    //if(restrictionsService.isCapacity("userGet", ra, res))return
    returnMessageService((await userController.get(req.params.id, req)), res);    
    //restrictionsService.addInstance("userGet", ra)
})

module.exports = router