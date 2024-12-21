const { default: axios } = require('axios');
const express = require('express');
const { restart } = require('nodemon');
const app = express();
const mysql = require('mysql2');
const request = require('request');

let options = {
    headers: {
        Authorization: '',
        'user-agent': 'node.js',
        'x-agent': 'website',
        'x-origin': '',
        'x-lang': 'KO',
    },
};

function getType(target) {
    return Object.prototype.toString.call(target).slice(8, -1);
}

function jsonToMap(jsonString) {
    //var jsonObject = JSON.parse(jsonString);
    var dataMap = new Map(Object.entries(jsonString));
    var keyMap = new Map();
    var resultMap = new Map();
    for (const key of dataMap.keys()) {
        //console.log(key);
        keyMap = new Map(Object.entries(dataMap.get(key)));
        resultMap.set(key, keyMap);
        //console.log(keyMap.get("name"));
    }
    // console.log("done!");
    return resultMap;
}



exports.getManufactor = async (req, res, next) => {
    console.log("getManufactor start");  
    var prdt_gubun = req.query.prdt_gubun;
    var flag = Number(prdt_gubun);
    
    let sql = " SELECT * FROM tbl_cd_val ";
    sql += " WHERE cd_id ='prdt_manufactor' ";
    sql += " AND cd_type >= "+ (flag * 10) +" and  cd_type < "+ (flag * 10 + 10) 
    console.log('sql:'+sql);
    
    let [rows2] = await global.mysqlPool.query(sql).catch((e) => {
          console.error(e);
    });
     
    var retObject = new Object();
    retObject.area = rows2;
  
    return res.json(retObject);    
};

exports.getMachine = async (req, res, next) => {
    console.log("getMachine start");  
    var prdt_manufactor = req.query.prdt_manufactor;
    
    let sql = " SELECT * FROM tbl_cd_val WHERE cd_id ='model' and cd_val1 = '"+prdt_manufactor+"' ";
    console.log('sql:'+sql);
    
    let [rows2] = await global.mysqlPool.query(sql).catch((e) => {
          console.error(e);
    });
     
    var retObject = new Object();
    retObject.area = rows2;
  
    return res.json(retObject);    
};

exports.email_format_com = async (req, res, next) => {
    console.log("email_format_com start");  
    var userObject = req.session.user;
    //var prdt_manufactor = req.query.prdt_manufactor;
   /* 
    let sql = " SELECT * FROM tbl_cd_val WHERE cd_id ='model' and cd_val1 = '"+prdt_manufactor+"' ";
    console.log('sql:'+sql);
    
    let [rows2] = await global.mysqlPool.query(sql).catch((e) => {
          console.error(e);
    });
     */
    var retObject = new Object();
   // retObject.area = rows2;
  
    return res.render('common/email_format_com',{userObject:userObject, retObject:retObject})
};



/****
 * REST 통신
 */
async function sendURL(url, options) {
    // Return new promise
    return new Promise(function (resolve, reject) {
        // Do async job
        request(url, options, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}
