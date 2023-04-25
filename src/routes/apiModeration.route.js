// Modules
const express = require("express");
const ReturnMessage = require("../models/returnMessage.model");
const geo = require("geoip-lite")
const bodyParser = require('body-parser')

// Services
const arrReq = require("../services/arrreq.service");
const returnMessageService = require("../services/returnmessage.service");
const restrictionsService = require("../services/restrictions.service")
const userService = require("../services/users.service")

// Controllers
const moderationController = require("../controllers/moderation.controller")

// Work
const router = express.Router()
const bodyparser = require('body-parser');
const urlencodedparser = bodyparser.urlencoded({extended:false})

router.post("/reports/create", urlencodedparser, async (req, res)=>{
    if((await userService.manageRestriction(req, res)) === true)return;
    let ret = arrReq.req(req.body, ["type", "rule", "method", "relation"]);
    if(ret !== true)returnMessageService(new ReturnMessage("3010", `Missing parameter: ${ret}`, 400, 'error'), res);
    returnMessageService((await moderationController.createReport(req.body.type, req.body.relation, req.body.rule, req.body.method, req.body.message, req)), res);
});

router.get("/reports/getByCommon", async (req, res)=> {
    if(userService.manageNonAdmin(req, res) === true)return;
    let ret = arrReq.req(req.query, ["start", "end"]);
    if(ret !== true)returnMessageService(new ReturnMessage("3305", `Missing parameter: ${ret}`, 400, 'error'), res);
    returnMessageService((await moderationController.getReportsByCommon(req.query.start, req.query.end)), res)
})

router.patch("/setEmailVerifiedManual", urlencodedparser, async (req, res) => {
    if(userService.manageNonAdmin(req, res) === true)return;
    let ret = arrReq.req(req.body, ["userid", "toggle"]);
    if(ret !== true)returnMessageService(new ReturnMessage("4003", `Missing parameter: ${ret}`, 400, 'error'), res);
    returnMessageService((await moderationController.setEmailVerifiedManual(req.body.userid, req.body.toggle)), res)
})

router.patch("/setVerified", urlencodedparser, async (req, res) => {
    if(userService.manageNonAdmin(req, res) === true)return;
    let ret = arrReq.req(req.body, ["userid", "toggle"]);
    if(ret !== true)returnMessageService(new ReturnMessage("4103", `Missing parameter: ${ret}`, 400, 'error'), res);
    returnMessageService((await moderationController.setVerified(req.body.userid, req.body.toggle)), res)
})

router.patch("/setSuspended", urlencodedparser, async (req, res) => {
    if(userService.manageNonAdmin(req, res) === true)return;
    let ret = arrReq.req(req.body, ["userid", "toggle"]);
    if(ret !== true)returnMessageService(new ReturnMessage("4203", `Missing parameter: ${ret}`, 400, 'error'), res);
    returnMessageService((await moderationController.setSuspended(req.body.userid, req.body.toggle)), res)
})

module.exports = router