// Configs
let reportsConfig = require("../configs/reports.config")

// Models
let returnMessage = require("../models/returnMessage.model")

// Services
let userService = require("../services/users.service")
let postService = require("../services/posts.service")
let jwtService = require("../services/jwt.service")
let moderationService = require("../services/moderation.service")

async function createReport(type, relation, rule, method, message, req){
    let reportTypes = reportsConfig.types;
    let rules = reportsConfig.rules
    let login = jwtService.isLoggedIn(req)

    if(!login){
        return new returnMessage("3006", "Login required", 400, 'error')
    }

    let userid = login.sub

    if(!(reportTypes.includes(type))){
        return new returnMessage("3003", "Invalid report type", 400, 'error')
    }

    let already = (await moderationService.userCreatedReportAlready(type, relation, userid))
    
    if(already.constructor != undefined && already.constructor.name == 'ReturnMessage'){
        return already;
    }

    if(already === true){
        return new returnMessage("3008", "Report already submitted for this item", 400, 'error')
    }

    let defrule = rules[rule]

    if(defrule == undefined){
        return new returnMessage("3004", "Rule does not exist", 400, 'error')
    }

    if(!(defrule.includes(method)) && method != "Other"){
        return new returnMessage("3005", "Rule violation method does not exist", 400, 'error')
    }

    if(message == undefined)message = "";
    message = String(message)
    if(message.length > 1028){
        return new returnMessage("3007", "Included message cannot be longer than 1028 characters", 400, 'error')
    }

    switch (type){
        case "user":
            let user = (await userService.get(relation));
            if(user.constructor != undefined && user.constructor.name == 'ReturnMessage')return user;
            break;
        case "post":
            let post = (await postService.get(relation));
            if(post.constructor != undefined && post.constructor.name == 'ReturnMessage')return post;
            break;
    }

    let create = (await moderationService.createReport(type, relation, rule, method, message, userid))
    if(create.constructor != undefined && create.constructor.name == 'ReturnMessage')return create;

    return new returnMessage("3009", { report: create }, 200, "createReport")

}

async function getReportsByCommon(start, end){
    start = parseInt(start)
    end = parseInt(end)

    if(isNaN(start) || isNaN(end) || end < start || start < 0 || end < 0){
        return new returnMessage("3302", "Invalid start or end parameter", 400, "error")
    }

    if(end - start > 50){
        return new returnMessage("3303", "Max capacity is 50 per request", 400, 'error')
    }

    return new returnMessage(
        "3304",
        (await moderationService.getReportsByCommon(start, end)),
        200,
        'reportsGetByCommon'
    )
}

module.exports = { createReport, getReportsByCommon }