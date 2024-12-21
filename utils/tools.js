const net = require('net')
const axios = require('axios')
const crypto = require('crypto');
let myIP = ""
exports.atob = (str) => {
    return Buffer.from(str).toString('base64')
}

exports.isTrue = (value) => {
    //ERR : FALSE
    if(typeof value == "undefined") return false
    if(typeof value == "boolean") return value
    if(typeof value === 'string'){
        if(value == 'true') return true
        if(value == '1') return true
        return false
    } 
    return !!value
}

exports.getClientIP = (req) =>
    req.headers['x-forwarded-for']?.split(',').shift()
    || req.socket?.remoteAddress

exports.getServerIP =
async () => {
    try{
        if(myIP != "") return myIP;
        const response = await axios.get("https://api.ipify.org")
        if(!net.isIPv4(response.data)){
            return '3.3.3.3'
        }
        myIP = response.data
        return response.data
    } catch(E) {
        return '4.4.4.4'
    }
}


exports.unixTimestamp = () =>{
    return Math.floor(new Date().getTime() / 1000);
}

//knex('users').orderBy([{ column: 'timestamp', order: 'desc' }, { column: 'idx' }])
exports.parseSortFromRestfulAPIForKnex = (orderBy) => {
    //sort=-timestamp,idx
    let jsonArr = []
    if(typeof orderBy == "undefined") return jsonArr;
    orderBy = orderBy.split(",")
    for(var i in orderBy){
        let tmpJson = {}
        if(orderBy[i][0]=='-'){
            tmpJson["column"] = orderBy[i].slice(1)
            tmpJson["order"] = "desc"
        } else {
            tmpJson["column"] = orderBy[i]
            tmpJson["order"] = "asc"
        }
        jsonArr.push(tmpJson)
    }
    return jsonArr
}




/*
isTrue(true)
true
isTrue(false)
false
isTrue(1)
true
isTrue(0)
false
isTrue("1")
true
isTrue("0")
false
isTrue("true")
true
isTrue("false")
false
isTrue()
false
*/