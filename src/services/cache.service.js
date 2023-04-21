/*

let cache = {}



function setCache(title, key, object){
    if(cache[title] == undefined){
        cache[title] = {}
    }
    cache[title][key] = Object.assign({}, object) 
}

function getCache(title, key){
    if(cache[title] == undefined || cache[title][key] == undefined)return false;
    let ret = cache[title][key];
    if(ret.constructor != undefined){
        ret = Object.assign({}, ret)
    }
    console.log(ret)
    return ret
}

*/

const NodeCache = require( "node-cache" );

let cache = {}

let excache = new NodeCache()

function setCache(title, key, object, ttl=undefined, noclone=false){
    if(cache[title] == undefined){
        cache[title] = new NodeCache({useClones:!noclone})
    }
    if(ttl != undefined){
        cache[title].set(key, object, ttl)
    } else {
        cache[title].set(key, object)
    }
    return cache[title].get(key)
}

function getCache(title, key){
    if(cache[title] == undefined)return false;
    let g = cache[title].get(key)
    if(g == undefined)return false;
    return g
}

function delCache(title, key){
    if(cache[title] == undefined)return false;
    cache[title].del(key)
    return true
}


module.exports = {
    setCache,
    getCache,
    delCache
}