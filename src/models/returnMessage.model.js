class ReturnMessage{
    constructor(code, data, httpcode, type=undefined){
        this.code = code
        this.data = data
        this.httpcode = httpcode

        if(type){
            this.type = type
        }
    }
}

module.exports = ReturnMessage