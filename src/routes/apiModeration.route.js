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

router.post("/reports/create", urlencodedparser, async (req, res)=>{
    res.send("Hello World")
})

module.exports = router