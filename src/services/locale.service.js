const defaultLocale = "en_us"

function getLocale(req, res){
    let locale = defaultLocale
    if(!req.cookies || !req.cookies.locale){
        locale = defaultLocale
        res.cookie("locale", defaultLocale, { maxAge: 86400000000 })
    } 
    
    locale = req.cookies.locale

    let localeData = require(`../locale/${defaultLocale}.locale.js`);
    try {
        localeData = require(`../locale/${locale}.locale.js`);
    } catch(e){
        localeData = require(`../locale/${defaultLocale}.locale.js`);
    }

    return localeData
}

module.exports = { getLocale }