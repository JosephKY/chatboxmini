// Services
const postsService = require("../services/posts.service")
const arrReqService = require("../services/arrreq.service")

// Models
const ReturnMessage = require("../models/returnMessage.model");

// Modules
const geo = require("geoip-lite")

// Configs
const feedParamsConfig = require("../configs/feedParams.config")

// Work

async function feed(type, params={}){
    let reqParams = feedParamsConfig[type]
    if(!reqParams){
        return new ReturnMessage("1200", "Invalid feed type", 400, "error");
    }

    let reqCheck = arrReqService.req(params, reqParams)
    if(reqCheck !== true){
        return new ReturnMessage("1201", `Missing parameter: ${reqCheck}`, 400, "error");
    }

    if(params.max > 15){
        return new ReturnMessage("1202", "Parameter 'max' cannot exceed 15", 400, "error")
    }

    params.startingId = parseInt(params.startingId)
    let sId = params.startingId
    if(sId == undefined || isNaN(sId) || sId < 1){
        return new ReturnMessage("1203", "Invalid parameter startingId", 400, 'error');
    }

    
}

async function get(id, remoteAddress){
    let post = (await postsService.get(id))
    if(post.constructor != undefined && post.constructor.name == "ReturnMessage")return post;

    let ret = {}
    ret.id = post.id
    ret.created = post.created
    ret.userid = post.userid
    ret.content = post.content
    ret.restrictions = []

    let loc = geo.lookup(remoteAddress)
    post.restrictions.forEach(r=>{
        console.log(r)
        if((loc != undefined && loc != null && (r.countries.includes(loc.country) || r.regions.includes(loc.region))) || r.countries.includes("*")){
            ret.restrictions.push(Object.assign({}, r))
            if(r.hidecontent == true){
                ret.content = ""
            }    
        }
    })

    return new ReturnMessage("1104", ret, 200, 'postGet')
}

module.exports = {get,feed}