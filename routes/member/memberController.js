const { default: axios } = require("axios");
var express = require("express");
const { restart } = require("nodemon");
var app = express();
const mysql = require("mysql2");
const crypto = require('crypto');
const multer = require('multer');
const readline = require('readline');

const db  = require('../../utils/database2')


exports.postLogin = async (req, res, next) => {   
  console.log("postLogin start");
  var member_id = req.body.email;
  var pwd = req.body.pwd;  
  
  console.log("body:"+ JSON.stringify(req.body)+ "member_id:"+member_id+" pwd:"+pwd);
  pwd = crypto.createHash('sha256').update(pwd).digest('hex');
  
 let sql = "SELECT * ";
 sql +=" FROM tbl_member_mgt as a ";
 sql +=" where member_id='"+member_id+"' and member_pwd = '"+pwd+"'";  
 sql+= " order by crdt_date";
 console.log('sql:'+sql);

 var retObject  = new Object();  
 let [rows] = await global.mysqlPool.query(sql).catch((e) => {
     console.error(e);
     retObject.retcode = "fail";           
     return res.json(retObject);
 });

 console.log("rows:"+JSON.stringify(rows)); 
 
 if(rows.length > 0){  
   retObject.retcode = "success";
   retObject.data = rows[0];

   req.session.user = {    
    email: rows[0].member_email,
    member_seq: rows[0].member_seq,
    member_id: rows[0].member_id,        
    member_mobile: rows[0].member_mobile,
    member_name: rows[0].member_name,  
    member_gubun: rows[0].member_gubun,  
    recommender:rows[0].recommender,  
    authorized: true
  };

   return res.redirect('/istam/istam_alllist');    
 }else{
   retObject.retcode = "fail";
   return res.redirect('/member/login');    
 } 
 
};
exports.login = async (req, res, next) => {
    console.log("login start");
   
    return res.render('member/login');    
};
exports.pagesregister = async (req, res, next) => {
  console.log("pagesregister start");
 
  return res.render('member/pagesregister');    
};



exports.logout = async (req, res, next) => {
  console.log("logout start");
  if (!req.session.user) {
    req.session.user = {}; // 세션 데이터를 저장할 객체를 초기화
  }
 
  return res.redirect('/member/login');    
};


exports.member_register = async (req, res, next) => {
  console.log("member_register start");
 
  return res.render('member/member_register');    
};
exports.resetpassword = async (req, res, next) => {
  console.log("resetpassword start");
 
  return res.render('member/resetpassword');    
};


exports.ajaxpostLogin = async (req, res, next) => {   
  console.log("ajaxpostLogin start");
  var member_id = req.body.email;
  var pwd = req.body.pwd;  
  var retObject = new Object();
  
  console.log("body:"+ JSON.stringify(req.body)+ "member_id:"+member_id+" pwd:"+pwd);
  pwd = crypto.createHash('sha256').update(pwd).digest('hex');
  var sql = "";

  sql = "SELECT * "  
  sql +=" FROM tbl_member as a ";
  sql +=" where member_id='"+member_id+"' and member_pwd = '"+pwd+"'";  
  //sql+= " and member_status = 1 ";
  sql+= " order by crdt_date";

  console.log('sql:'+sql);
 var retObject  = new Object();  
 let [rows] = await global.mysqlPool.query(sql).catch((e) => {
     console.error(e);
     retObject.retcode = "fail";           
     return res.json(retObject);
 });

 console.log("rows:"+JSON.stringify(rows)); 
 
 if((rows.length > 0)){  
   retObject.retcode = "success";
   retObject.data = rows[0];

   req.session.user = {    
    email: rows[0].member_email,
    member_seq: rows[0].member_seq,
    member_id: rows[0].member_id,        
    member_mobile: rows[0].member_mobile, 
    member_gubun: rows[0].member_gubun,                  
    member_name: rows[0].member_name,   
    authorized: true
  };

  retObject.retcode ="success"        
  retObject.retmsg =" 로그인되었습니다."  
 }else{
  retObject.retcode ="fail"        
  retObject.retmsg ="로그인 정보를 다시 확인하십시오."
 }

 return res.json(retObject); 
};

/***
 * 
 */
exports.regmember = async (req, res, next) => {   
  console.log("regmember start");
  var member_id = req.body.email;
  var mobile = req.body.mobile;
  var pwd = req.body.password;  
  var retObject = new Object();
  
  console.log("body:"+ JSON.stringify(req.body)+ "member_id:"+member_id+" pwd:"+pwd);
  pwd = crypto.createHash('sha256').update(pwd).digest('hex');
  var sql = "";

  sql = "SELECT * "  
  sql +=" FROM tbl_member as a ";
  sql +=" where member_id='"+member_id+"' and member_pwd = '"+pwd+"'";  
  //sql+= " and member_status = 1 ";
  sql+= " order by crdt_date";

  console.log('sql:'+sql);
 var retObject  = new Object();  
 let [rows] = await global.mysqlPool.query(sql).catch((e) => {
     console.error(e);
     retObject.retcode = "fail";           
     return res.json(retObject);
 });

 console.log("rows:"+JSON.stringify(rows)); 
 
 if((rows.length == 0)){ 
  var insert = new Object();
  insert.member_id = member_id;
  insert.member_pwd = pwd;
  insert.member_mobile = mobile;
  insert.crdt_id = member_id;  
  
  var rows1 = await db.insert_member(insert)
  
  retObject.retcode ="success"        
  retObject.retmsg =" 로그인되었습니다."  
 }else{
  retObject.retcode ="fail"        
  retObject.retmsg ="로그인 정보를 다시 확인하십시오."
 }

 return res.json(retObject); 
};



/****
 * REST 통신
 */
async function sendURL(myaddr, options) {
    // Return new promise
    return new Promise(function (resolve, reject) {
      // Do async job
      request(myaddr, options, function (error, response, body) {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      });
    });
  }
  function isNotNumber(value) {
    return /^\d+$/.test(value) === false;
  }