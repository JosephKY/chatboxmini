function req(obj, keys){
    let undef = true;
    keys.forEach(element => {
        if(obj[element] == undefined){
            undef = element;
            return
        }
    });
    return undef;
}

module.exports = {req};