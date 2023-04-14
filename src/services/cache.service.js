let cache = {}

function setCache(title, key, object){
    if(cache[title] == undefined){
        cache[title] = {}
    }
    cache[title][key] = object
}

function getCache(title, key){
    if(cache[title] == undefined || cache[title][key] == undefined)return false;
    let ret = cache[title][key];
    if(ret.constructor != undefined){
        ret = Object.assign({}, ret)
    }
    return ret
}

module.exports = {
    setCache,
    getCache
}