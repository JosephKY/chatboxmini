// Services
let cacheService = require("./cache.service")
let dbService = require("./db.service")
let userService = require("./users.service")

// Models
let postModel = require("../models/post.model")
let postRestrictionModel = require("../models/postrestriction.model")
let ReturnMessage = require("../models/returnMessage.model")

// Work

async function get(postid){
    let cache = cacheService.getCache("post", postid)
    if(cache != false){
        return cache;
    }

    let db = await dbService.newdb()
    if (!db) {
        return new ReturnMessage("1100", "General Failure", 500, "error")
    }

    let sql = "SELECT * FROM posts WHERE id LIKE ?"
    let inserts = [postid];
    try {
        let res = (await db.execute(sql, inserts))
        res = res[0]
        if (res.length == 0) {
            return new ReturnMessage("1101", "Post does not exist", 400, "error")
        }

        let ret = res[0];
        let user = (await userService.get(ret.userid))
        if(user.constructor != undefined && user.constructor.name == "ReturnMessage"){
            return user;
        }

        let post = new postModel(ret.id, ret.created, ret.userid, ret.content, ret.deleted)

        cacheService.setCache("post", postid, post)

        sql = "SELECT * FROM postrestrictions WHERE postid LIKE ?";
        inserts = [postid]
        try {
            let res = (await db.execute(sql, inserts))
            res = res[0];
            if(res != undefined){
                res.forEach(row=>{
                    new postRestrictionModel(post, row.id, row.created, JSON.parse(row.countries), JSON.parse(row.regions), row.reason, row.hidecontent)
                })
            }
        }catch(err){
            return new ReturnMessage("1103", "General Failure", 500, 'error')
        }

        
        return post;

    } catch (err) {
        return new ReturnMessage("1102", "General Failure", 500, "error")
    }
}

async function create(userid, content){
    let db = await dbService.newdb()
    if (!db) {
        return new ReturnMessage("1300", "General Failure", 500, "error")
    }

    let c = Math.floor(Date.now()/1000)
    let sql = "INSERT INTO posts (created,userid, content) VALUES (?,?,?)";
    let inserts = [c, userid, content]

    try{
        let res = (await db.execute(sql, inserts));
        return res[0].insertId
    }catch(err){
        return new ReturnMessage("1301", "General Failure", 500, "error")
    }
}

function extractDomains(str) {
    const urlRegex = /(?<!\w)(https?:\/\/)?(www\.)?([\w-]+\.[\w-]+)(\.[\w-]+)*((?![\w.])|\b)/gi;
    const domains = [];
    let match;
  
    while ((match = urlRegex.exec(str)) !== null) {
      let domain = match[3] + (match[4] || '');
  
      if (match[2] === 'www.') {
        domain = domain.replace(/^www\./, '');
      }
  
      domains.push(domain);
    }
  
    return domains;
  }

async function deletePost(postid){

    let db = await dbService.newdb()
    if (!db) {
        return new ReturnMessage("1901", "General Failure", 500, "error")
    }

    let setDelete = 1
    let sql = "UPDATE posts SET deleted = ? WHERE id LIKE ?";
    let inserts = [setDelete, postid];
    try{
        (await db.execute(sql, inserts))
        cacheService.delCache("post", postid)
        return true
    } catch(err){
        return new ReturnMessage("1902", "General Failure", 500, "error")
    }
}

module.exports = {get,create,extractDomains,deletePost}