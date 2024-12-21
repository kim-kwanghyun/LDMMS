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


const PRE_PAY_STATUS = 1;
const POST_PAY_STATUS = 2;
const POST_PAY_FAILE_STATUS = 3;
const MEMBER_REG_TRANS_TYPE = 1;
const REQ_FRIEND_TRANS_TYPE = 2;
const CONFIRM_FRIEND_TRANS_TYPE = 3;
const RECAHRGE_TRANS_TYPE = 10;
const PAY_TRANS_TYPE = 11;

const PAY_TYPE_CREDIT = 1;
const PAY_TYPE_PAYPAL = 2;


async function addMileage(member_id, amount, TRANS_TYPE){
  
    var sql_insert ="insert tbl_mileage_log (member_id, trans_date, type, amount, crdt_id, crdt_date) ";
    sql_insert += " values ('"+member_id+"', (DATE_FORMAT(CURDATE(), '%Y%m%d'),";
     sql_insert += " (select amount from tbl_cd_val where cd_type = "+TRANS_TYPE+" and cd_id = 'MILEAGE_TYPE') ,"
     sql_insert += " "+amount+",'"+member_id+"',sysdate())";
    console.log("sql_insert:"+sql_insert);
    let [row_insert] = await global.mysqlPool.query(sql_insert).catch((e) => {        
      return false;
    });
  
    var sql ="update tbl_member set mileage = mileage + "+amount;
    sql += " where member_id = '"+member_id +"'";
    console.log("sql:"+sql);
    let [rows] = await global.mysqlPool.query(sql).catch((e) => {        
      return false;
    });
  
    return true;
  }
  async function subMileage(member_id, amount){
    var sql ="update tbl_member set mileage = mileage - "+amount;
    sql += " where member_id = '"+member_id +"'";
    console.log("sql:"+sql);
    let [rows] = await global.mysqlPool.query(sql).catch((e) => {        
      return false;
    });
  }
  async function addTransLog(sqlObject){    
    var sql ="insert into istamp_payment(paymentKey, orderId, member_seq, member_id, member_name ";
    sql += " , pay_day, amount,pay_type, pay_status , orderName, crdt_id, crdt_date) ";
    sql += " values('"+sqlObject.paymentKey+"','"+sqlObject.orderId+"', "+sqlObject.member_seq+",";
    sql += " '"+sqlObject.member_id+"','"+sqlObject.member_name+"'";
    sql += " ,  (DATE_FORMAT(CURDATE(), '%Y%m%d'),"+sqlObject.amount+",";
    sql += "'"+sqlObject.pay_type+"',"+sqlObject.pay_status+",'"+sqlObject.orderName+"',";
    sql += " '"+sqlObject.member_id+"',sysdate()) ";
    console.log("sql:"+sql);
    let [rows] = await global.mysqlPool.query(sql).catch((e) => {        
      return false;
    });
    return true;
  }
  
  async function updateTransLog(sqlObject){    
    var sql ="update istamp_payment set ";
    sql += "pay_status = "+ sqlObject.pay_status +",";  
    sql += "mdfy_date = sysdate(),";
    sql += "mdfy_id = '"+ sqlObject.mdfy_id +"' ";
    sql += " where paymentKey='"+sqlObject.paymentKey + "' and member_id ='"+sqlObject.member_id+"'";
    console.log("sql:"+sql);
    let [rows] = await global.mysqlPool.query(sql).catch((e) => {        
      return false;
    });
    return true;
  }

  module.exports = {
    addMileage
};