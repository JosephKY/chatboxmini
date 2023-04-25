// Configs
let reportConfig = require("../configs/reports.config")

// Models
let returnMessage = require("../models/returnMessage.model")
let reportModel = require("../models/report.model")

// Services
let dbService = require("../services/db.service")
const cacheService = require("./cache.service")
const userService = require("../services/users.service")

// Work

async function userCreatedReportAlready(type, relation, userid){
    let db = (await dbService.newdb())

    if(!db){
        return new returnMessage("3200", "General Failure", 500, 'error');
    }

    let sql = "SELECT * FROM reports WHERE type LIKE ? AND relation LIKE ? AND userid LIKE ?"
    let inserts = [type, relation, userid]

    try {
        let res = (await db.execute(sql, inserts))
        if(res[0].length > 0)return true;
        return false;
    } catch(err){
        console.log(err)
        return new returnMessage("3201", "General Failure", 500, 'error');
    }
}

async function createReport(type, relation, rule, method, message, userid){
    let db = (await dbService.newdb())

    if(!db){
        return new returnMessage("3000", "General Failure", 500, 'error');
    }

    let created = Math.floor(Date.now() / 1000);
    let sql = "INSERT INTO reports (created, type, relation, rule, method, message, userid) VALUES (?,?,?,?,?,?,?)";
    let inserts = [created, type, relation, rule, method, message, userid]

    console.log(inserts)

    try {
        let insert = (await db.execute(sql, inserts));
        let report = new reportModel(insert[0].insertId, created, type, relation, rule, method, message, userid, 0);
        cacheService.setCache("report", insert[0].insertId, report)
        return report;
    } catch(err){
        console.log(err);
        return new returnMessage("3002", "General Failure", 500, 'error');
    }
}

async function getReport(id){
    let cache = cacheService.getCache("report", id);
    if(cache != false){
        return cache;
    }

    let db = (await dbService.newdb())

    if(!db){
        return new returnMessage("3100", "General Failure", 500, 'error');
    }

    let sql = "SELECT * FROM reports WHERE id LIKE ?";
    let inserts = [id];

    try {
        let res = (await db.execute(sql, inserts))
        res = res[0]
        if(res.length == 0)return false;
        res = res[0]
        let report = new reportModel(res.id, res.created, res.type, res.relation, res.rule, res.method, res.message, res.userid, res.status);
        cacheService.setCache("report", res.id, report)
        return report;
    } catch (err){
        console.log(err)
        return new returnMessage("3101", "General Failure", 500, 'error');
    }
}

async function getReportsByCommon(start, end){
    let db = (await dbService.newdb())

    if(!db){
        return new returnMessage("3300", "General Failure", 500, 'error');
    }

    let sql = `
    SELECT * 
    FROM reports 
    JOIN ( SELECT relation, COUNT(*) 
    AS count_occurrences 
    FROM reports 
    GROUP BY relation ) 
    AS counts 
    ON reports.relation = counts.relation 
    ORDER BY counts.count_occurrences DESC 
    LIMIT ${start},${end}
    `;
    try {
        let res = (await db.execute(sql))
        let ret = []
        res = res[0]
        res.forEach(data=>{
            let report = new reportModel(data.id, data.created, data.type, data.relation, data.rule, data.method, data.message, data.userid, data.status)
            ret.push(report)
        })
        return ret;
    } catch (err) {
        console.log(err)
        return new returnMessage("3301", "General Failure", 500, 'error')
    }
}





module.exports = { createReport, getReport, userCreatedReportAlready, getReportsByCommon }
