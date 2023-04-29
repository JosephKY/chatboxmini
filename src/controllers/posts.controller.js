// Services
const postsService = require("../services/posts.service")
const arrReqService = require("../services/arrreq.service")
const dbService = require("../services/db.service")
const jwtService = require("../services/jwt.service")
const userService = require("../services/users.service")
const moderationService = require("../services/moderation.service")

// Models
const ReturnMessage = require("../models/returnMessage.model");
const PostRestriction = require("../models/postrestriction.model")

// Modules
const geo = require("geoip-lite")
const htmlED = require("html-encoder-decoder")

// Configs
const feedParamsConfig = require("../configs/feedParams.config")
const postConfig = require("../configs/post.config")


// Work

async function create(content, req) {
    let login = jwtService.isLoggedIn(req)
    if (!login) {
        return new ReturnMessage("1302", "Must be logged in to create post", 400, "error")
    }

    content = String(content)

    if (!content.trim()) {
        return new ReturnMessage("1303", "Content cannot be empty", 400, "error")
    }

    if (content.length > postConfig.maxChars) {
        return new ReturnMessage("1303", `Content cannot be more than ${postConfig.maxChars} characters`, 400, "error")
    }

    let domains = postsService.extractDomains(content)
    let bd = postConfig.bannedDomains
    for (domain of domains) {
        if (bd.includes(domain)) {
            return new ReturnMessage("1304", "Content includes blacklisted domain", 400, 'error')
        }
    }

    let creation = (await postsService.create(login.sub, htmlED.encode(content)))

    if (creation.constructor.name == 'ReturnMessage') return creation;

    let checking = content.toLowerCase()
    function autorestrict() {
        for (let hate of postConfig.autorestrict.hateful) {
            let forms = bypassFilter(hate)

            for (let form of forms) {
                if (checking.includes(form)) {
                    return moderationService.createPostRestriction(creation, '["*"]', "[]", "Post may content hateful or offensive content", 0);
                }
            }
        }
    }

    autorestrict()

    return new ReturnMessage("1305", { id: creation }, 200, 'postCreate')
}

function bypassFilter(str) {
    const variations = [];

    variations.push(str);

    const lettersToNumbers = {
        'a': '4',
        'e': '3',
        'i': '1',
        'o': '0',
        's': '5',
        't': '7'
    };
    let numStr = '';
    for (let i = 0; i < str.length; i++) {
        const char = str[i].toLowerCase();
        if (lettersToNumbers[char]) {
            numStr += lettersToNumbers[char];
        } else {
            numStr += char;
        }
    }
    variations.push(numStr);

    const separators = [' ', '-', '/', '_', '.'];
    const separatedVariations = [str];
    for (let i = 0; i < separators.length; i++) {
        const separator = separators[i];
        let newVariations = [];
        for (let j = 0; j < separatedVariations.length; j++) {
            const separatedStr = separatedVariations[j];
            const parts = separatedStr.split(separator);
            for (let k = 0; k < parts.length; k++) {
                const part = parts[k];
                if (part) {
                    const newStr = parts.slice(0, k).join(separator) + separator + part.split('').join(separator) + separator + parts.slice(k + 1).join(separator);
                    newVariations.push(newStr);
                }
            }
        }
        separatedVariations.push(...newVariations);
    }
    variations.push(...separatedVariations);

    const reversedStr = str.split('').reverse().join('');
    variations.push(reversedStr);

    return variations;
}



async function feed(type, req, params = {}) {
    let reqParams = feedParamsConfig[type]
    if (!reqParams) {
        return new ReturnMessage("1200", "Invalid feed type", 400, "error");
    }

    let reqCheck = arrReqService.req(params, reqParams)
    if (reqCheck !== true) {
        return new ReturnMessage("1201", `Missing parameter: ${reqCheck}`, 400, "error");
    }

    if (type == "all") {

        let max = params.max
        if (max > 15) {
            return new ReturnMessage("1202", "Parameter 'max' cannot exceed 15", 400, "error")
        }

        let db = (await dbService.newdb())
        if (!db) {
            return new ReturnMessage("1204", "General Failure", 500, "error")
        }

        if (params.startingId != undefined) {
            params.startingId = parseInt(params.startingId)
            let sId = params.startingId
            if (sId == undefined || isNaN(sId) || sId < 0) {
                return new ReturnMessage("1203", "Invalid parameter startingId", 400, 'error');
            }

            let sql = "SELECT id FROM posts WHERE id < ? ORDER BY id DESC LIMIT ?";
            let inserts = [sId, max];

            try {
                let final = []
                let res = (await db.execute(sql, inserts));
                res = res[0]
                for (row of res) {
                    let ret = (await get(row.id, req))
                    final.push(ret.data)
                }

                return new ReturnMessage("1206", final, 200, 'feedGet')
            } catch (err) {
                return new ReturnMessage("1205", "General Failure", 500, "error")
            }
        } else {
            let sql = "SELECT id FROM posts ORDER BY id DESC LIMIT ?";
            let inserts = [max];

            try {
                let final = []
                let res = (await db.execute(sql, inserts));
                res = res[0]
                for (row of res) {
                    let ret = (await get(row.id, req))
                    final.push(ret.data)
                }

                return new ReturnMessage("1213", final, 200, 'feedGet')
            } catch (err) {
                return new ReturnMessage("1214", "General Failure", 500, "error")
            }
        }


    }

    if (type == "user") {
        let max = params.max
        if (max > 15) {
            return new ReturnMessage("1207", "Parameter 'max' cannot exceed 15", 400, "error")
        }

        params.userid = parseInt(params.userid)
        let userid = params.userid
        if (userid == undefined || isNaN(userid) || userid < 1) {
            return new ReturnMessage("1212", "Invalid parameter userid", 400, 'error');
        }

        if (params.startingId != undefined) {

            params.startingId = parseInt(params.startingId)
            let sId = params.startingId
            if (sId == undefined || isNaN(sId) || sId < 0) {
                return new ReturnMessage("1208", "Invalid parameter startingId", 400, 'error');
            }

            let sql = "SELECT id FROM posts WHERE id < ? AND userid LIKE ? ORDER BY id DESC LIMIT ?";
            let inserts = [sId, params.userid, max];

            let db = (await dbService.newdb())
            if (!db) {
                return new ReturnMessage("1209", "General Failure", 500, "error")
            }

            try {
                let final = []
                let res = (await db.execute(sql, inserts));
                res = res[0]
                for (row of res) {
                    let ret = (await get(row.id, req))
                    final.push(ret.data)
                }

                return new ReturnMessage("1211", final, 200, 'feedGet')
            } catch (err) {
                return new ReturnMessage("1210", "General Failure", 500, "error")
            }
        } else {
            let sql = "SELECT id FROM posts WHERE userid LIKE ? ORDER BY id DESC LIMIT ?";
            let inserts = [params.userid, max];

            let db = (await dbService.newdb())
            if (!db) {
                return new ReturnMessage("1215", "General Failure", 500, "error")
            }

            try {
                let final = []
                let res = (await db.execute(sql, inserts));
                res = res[0]
                for (row of res) {
                    let ret = (await get(row.id, req))
                    final.push(ret.data)
                }

                return new ReturnMessage("1217", final, 200, 'feedGet')
            } catch (err) {
                return new ReturnMessage("1216", "General Failure", 500, "error")
            }
        }
    }
}

async function restrict(post, req) {
    let user = (await userService.get(post.userid));
    if (user.constructor.name == 'ReturnMessage') return user;

    let login = jwtService.isLoggedIn(req)
    let isAdmin = false;
    if (login != false && userService.admin(login.sub)) {
        isAdmin = true;
    }

    if (user.suspended == 1) {
        new PostRestriction(post, 0, 0, ['*'], [], 'The account that created this post is suspended.', true)
    }

    let db = await dbService.newdb()
    if (!db) {
        return new ReturnMessage("1100", "General Failure", 500, "error")
    }

    sql = "SELECT * FROM postrestrictions WHERE postid LIKE ?";
    inserts = [post.id]
    try {
        let res = (await db.execute(sql, inserts))
        res = res[0];
        if (res != undefined) {
            res.forEach(row => {
                new PostRestriction(post, row.id, row.created, JSON.parse(row.countries), JSON.parse(row.regions), row.reason, row.hidecontent)
            })
        }
    } catch (err) {
        return new ReturnMessage("1103", "General Failure", 500, 'error')
    }

    let ret = {}
    ret.id = post.id
    ret.created = post.created
    ret.userid = post.userid
    ret.content = post.content
    ret.restrictions = []
    ret.actions = post.actions
    ret.deleted = post.deleted

    if (post.deleted == 1 && !isAdmin) {
        ret.content = ""
    }

    if (post.deleted == 1 && isAdmin) {
        ret.content = `${ret.content}`
    }

    let loc = geo.lookup(req.socket.remoteAddress)
    post.restrictions.forEach(r => {
        if ((loc != undefined && loc != null && (r.countries.includes(loc.country) || r.regions.includes(loc.region))) || r.countries.includes("*")) {
            ret.restrictions.push(Object.assign({}, r))
            if (r.hidecontent == true && !isAdmin) {
                ret.actions = []
                ret.content = ""
            }

            if (r.hidecontent == true && isAdmin && r.reason != 'The account that created this post is suspended.') {
                ret.content = `${ret.content}`
            }
        }
    })

    return ret
}

async function get(id, req) {
    let post = (await postsService.get(id))
    if (post.constructor != undefined && post.constructor.name == "ReturnMessage") return post;



    let login = jwtService.isLoggedIn(req)
    if (login != false) {
        let myid = login.sub
        if (myid == post.userid) {
            if (post.deleted == 0) {
                post.actions.push("delete")
            }

        } else {
            post.actions.push("report")
        }
    }

    let ret = await (restrict(post, req));
    if (ret.constructor.name == 'ReturnMessage') return ret;

    return new ReturnMessage("1104", ret, 200, 'postGet')
}

async function deletePost(id, req) {
    let post = (await get(id, req))

    if (post.constructor != undefined && post.constructor.name == "ReturnMessage" && post.type == 'error') {
        return post;
    }

    if (post.data.deleted == 1) {
        return new ReturnMessage("1900", "Post already deleted", 400, 'error')
    }

    let login = jwtService.isLoggedIn(req)
    if (login == false) {
        return new ReturnMessage("1903", "Login required", 401, 'error')
    }

    if (login.sub != post.data.userid) {
        return new ReturnMessage("1904", "Unauthorized", 403, 'error')
    }

    let del = (await postsService.deletePost(id))
    if (del !== true) {
        return del;
    }

    return new ReturnMessage("1905", "Post deleted successfully", 200, 'postDelete')
}

module.exports = { get, feed, create, deletePost }