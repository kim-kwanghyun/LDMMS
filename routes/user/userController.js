var express = require("express");
const { restart } = require("nodemon");
var app = express();
const mysql = require("mysql2");
const crypto = require('crypto');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const sharp = require('sharp');
const { Web3 } = require('web3');
const cheerio = require('cheerio');
const remakeImage = require('./remakeImage');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const bodyParser = require('body-parser');
app.use(express.json());


exports.intro = async (req, res, next) => {
  console.log("home start");
 
  var retObject = new Object();
  try{  
    if((req.session.user == null)||(req.session.user == 'undefined')){
      console.log("req.session.user  null");
      return res.redirect('/istamp/reloadwinodw');
      //return res.redirect('/istamp/login');
    }

    var userObject = req.session.user;
    var member_id = req.session.user.member_id;
  
    var sql_select = " SELECT a.*, ";
    sql_select += " DATE_FORMAT(a.crdt_date, '%Y-%m-%d') AS formatted_date ,";
    sql_select += " CASE WHEN a.crdt_date >= DATE_SUB(CURDATE(), INTERVAL 1 DAY) THEN 'NEW' ";
    sql_select += "       ELSE ''     END AS NEW_DATE ";
    sql_select += "  FROM ";
    sql_select += "  istamp_list a";
    sql_select += "  LEFT JOIN    tbl_istam_claim cl  ON a.istamp_list_seq = cl.istam_list_seq and cl.type = 2 and cl.claim_member_id='"+member_id+"' ";
    sql_select += "  WHERE cl.istam_claim_seq IS NULL  AND a.metadata_url IS NOT NULL   AND a.open = 1   AND a.block_view = 0  ";
    sql_select += "  order by a.crdt_date desc LIMIT 0, 30";

    console.log("sql_select:"+sql_select);
    let [rows] = await global.mysqlPool.query(sql_select).catch((e) => {
      throw new Error('처리중 오류가 발생했습니다!');
      console.error(e);
    });
    var retObject = new Object();
    retObject.mylist = rows;

    var sql_count = " select * from istamp_sum order by crdt_date desc LIMIT 1"  ; 
    console.log("sql_count:"+sql_count);
    let [row_count] = await global.mysqlPool.query(sql_count).catch((e) => {
      throw new Error('처리중 오류가 발생했습니다!');
      console.error(e);
    });
    retObject.total = row_count[0];
  
    //console.log("retObject:"+JSON.stringify(retObject))
    return res.render('stamory/home',{retObject:retObject, userObject:userObject}); 
  } catch (error) {
    // 예외가 발생했을 때 실행되는 코드
    console.error("An error occurred:", error.message);
    retObject.retcode = "fail"; 
    retObject.error = error; 
    return res.json(retObject);
  }    
};