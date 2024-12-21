var express = require("express");
const { restart } = require("nodemon");
var app = express();
const mysql = require("mysql2");
const crypto = require('crypto');
const multer = require('multer');
const fs = require('fs');
//const axios = require('axios');
const FormData = require('form-data');
//const fs = require('fs');
const path = require('path');
var request = require("request");

const db  = require('../../utils/database2')

var retObject = new Object();

exports.livestock = async (req, res, next) => {
  console.log('livestock start');

  var retObject = new Object();
  var userObject = new Object();
  var gwid = req.query.gwid;

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }

  if((gwid == null)||(gwid == 'undefined')){
    gwid = 0;
  }
  var rows = await db.get_livestock(userObject.member_id, gwid)
  if(rows.length == 0){
      retObject.retcode = "fail";
  }else{
      retObject.retcode = "success";
      retObject.livestock = rows;
  }
  console.log(JSON.stringify(retObject.livestock));
  return res.render('livestock/livestock',{userObject:userObject,retObject:retObject});
};

exports.livestock_perlist = async (req, res, next) => {
  console.log('livestock_perlist start');

  var retObject = new Object();
  var userObject = new Object();
  var livestock_seq = req.query.livestock_seq;
  var gwid = req.query.gwid;  

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }

  var rows = await db.get_livestock_trans(livestock_seq)
  if(rows.length == 0){
      retObject.retcode = "fail";
  }else{
      retObject.retcode = "success";
      retObject.livestock = rows;
  }
  retObject.gwid = gwid;
  return res.render('livestock/livestock_perlist',{userObject:userObject,retObject:retObject});
};


exports.set_outlivestock = async (req, res, next) => {
  console.log('set_outlivestock start');

  var retObject = new Object();
  var livestock_seq = req.query.livestock_seq;
  var state = req.query.state;
  //0: 등록, 1: 입고, 2: 출고, 3: 판매

  var rows = await db.set_outlivestock(livestock_seq, state)
  if(rows.length == 0){
      retObject.retcode = "fail";
  }else{
      retObject.retcode = "success";
      retObject.data = rows;     
  }
  //console.log(JSON.stringify(retObject))
  return res.json(retObject);
};
/***
 * 개별 돈별 급이,급수, 몸무게 조회
 */
exports.get_feed_per_livestock_hour = async (req, res, next) => {
  console.log('get_feed_per_hour start');

  var retObject = new Object();
  var strdate = req.query.strdate;
  var enddate = req.query.enddate;
  var tagnum = req.query.tagnum;
  console.log(JSON.stringify(req.query))
  var rows = await db.get_feed_per_livestock_hour(tagnum,strdate,enddate)
  if(rows.length == 0){
      retObject.retcode = "fail";
  }else{
      retObject.retcode = "success";
      retObject.data = rows;     
  }
 //console.log(JSON.stringify(retObject))
  return res.json(retObject);
};

exports.perlivestock_day = async (req, res, next) => {
  console.log('perlivestock_day start');
  
  var retObject = new Object();
  var userObject = new Object();

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }

  return res.render('perlivestock/perlivestock_day',{userObject:userObject});
};

exports.perlivestock_month = async (req, res, next) => {
  console.log('perlivestock_month start');
  
  var retObject = new Object();
  var userObject = new Object();

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }
  return res.render('perlivestock/perlivestock_month',{userObject:userObject});
};

