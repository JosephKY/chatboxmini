// Configs
let reportConfig = require("../configs/reports.config")

// Models
let returnMessage = require("../models/returnMessage.model")

// Services
let dbService = require("../services/db.service")

// Work

async function createReport(type, rule, method, message, userid){
    let db = (await dbService.newdb())
    
}
