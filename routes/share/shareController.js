const { default: axios } = require("axios");
var express = require("express");
const { restart } = require("nodemon");
var app = express();
const mysql = require("mysql2");
const crypto = require('crypto');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require("fs");
const nodemailer = require('nodemailer');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
 

exports.istam_share = async (req, res, next) => { 
  var userObject = req.session.user;  
  var retObject = new Object();  
  var istam_list_seq = req.query.istam_list_seq;
  console.log("req.query:"+JSON.stringify(req.query));

  var sql ="select *, ";
  sql += " DATE_FORMAT(crdt_date, '%Y-%m-%d') AS formatted_date ";
  sql += " from istamp_list where istamp_list_seq="+istam_list_seq;
  console.log("sql:"+sql);
  let [rows] = await global.mysqlPool.query(sql).catch((e) => {
    throw new Error('처리중 오류가 발생했습니다!');
    console.error(e);
  });
  retObject.data = rows[0];
  retObject.ret = "success";

  console.log("istam_share start");
  return res.render('share/istam_share',{userObject:userObject,retObject:retObject})
};
/****
 * Email 전송포맷 확인 사이트
 */
exports.istam_share_email = async (req, res, next) => { 
  var userObject = req.session.user;  
  var retObject = new Object();  
  var istam_list_seq = req.query.istam_list_seq;
  console.log("req.query:"+JSON.stringify(req.query));

  var sql ="select *, ";
  sql += " DATE_FORMAT(crdt_date, '%Y-%m-%d') AS formatted_date ";
  sql += " from istamp_list where istamp_list_seq="+istam_list_seq;
  console.log("sql:"+sql);
  let [rows] = await global.mysqlPool.query(sql).catch((e) => {
    throw new Error('처리중 오류가 발생했습니다!');
    console.error(e);
  });
  retObject.data = rows[0];
  retObject.ret = "success";

  console.log("istam_share start");
  return res.render('share/istam_share_email',{userObject:userObject,retObject:retObject})
};



exports.request_sale = async (req, res, next) => { 
  var userObject = req.session.user;  
  var retObject = new Object();  
  var istamp_list_seq = req.query.istamp_list_seq;
 

  var sql ="select *, ";
  sql += " DATE_FORMAT(crdt_date, '%Y-%m-%d') AS formatted_date ";
  sql += " from istamp_list where istamp_list_seq="+istamp_list_seq;
  console.log("sql:"+sql);
  let [rows] = await global.mysqlPool.query(sql).catch((e) => {
    throw new Error('처리중 오류가 발생했습니다!');
    console.error(e);
  });
  retObject.data = rows[0];
  retObject.ret = "success";

  console.log("istam_share start");
  return res.render('share/request_sale',{userObject:userObject,retObject:retObject})
};

exports.reg_sale = async (req, res, next) => { 
  var userObject = req.session.user;  
  console.log("reg_sale start");
  var retObject = new Object();  
  retObject = req.body;  

  var sql ="insert into  tbl_istam_sale ";
  sql +=" (istamp_list_seq, member_id,reg_date,nft_sale_comp,sale_prdt_title,sale_prdt_desc , ";
  sql +=" sale_date,sale_price,crdt_id,crdt_date) "
  sql += " values("+retObject.istamp_list_seq+", '"+userObject.member_id+"', ";
  sql += " DATE_FORMAT(SYSDATE(), '%Y-%m-%d'),'"+retObject.sale_comp+"','"+retObject.sale_prdt_title+"','"+retObject.sale_prdt_desc+"', ";
  sql += "DATE_FORMAT(SYSDATE(), '%Y-%m-%d'),"+retObject.sale_price+", '"+userObject.member_id+"',sysdate()) ";

  console.log("sql:"+sql);
  let [rows] = await global.mysqlPool.query(sql).catch((e) => {
    throw new Error('처리중 오류가 발생했습니다!');
    console.error(e);
  });
  retObject.retcode = "success";
  
  return res.json(retObject);
};


