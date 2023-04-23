let geo = require("geoip-lite")
let localeConfig = require("../configs/locale.config")

function getDefaultLocale(req) {
    try {
        let loc = geo.lookup(req.socket.remoteAddress)

        if (!loc) {
            return "en-US"
        }

        let def = localeConfig.defaults[loc.country]
        console.log(loc.country)
        if (!def) return "en-US"
        return def
    } catch (err) {
        console.log(err)
        return 'en-US'
    }
}



function getLocale(req, res) {
    
    const defaultLocale = getDefaultLocale(req)
    let locale = defaultLocale
    if (!req.cookies || !req.cookies.locale) {
        locale = defaultLocale
        res.cookie("locale", defaultLocale, { maxAge: 86400000000 })
    }

    locale = req.cookies.locale

    let localeData = require(`../locale/${defaultLocale}.locale.js`);
    try {
        localeData = require(`../locale/${locale}.locale.js`);
    } catch (e) {
        localeData = require(`../locale/${defaultLocale}.locale.js`);
    }

    console.log(localeData)

    return localeData
}

module.exports = { getLocale }