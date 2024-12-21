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

exports.perlivestock_hour = async (req, res, next) => {
  console.log('perlivestock_hour start');

  var tagnum = req.query.tagnum;
  var strdate = req.query.strdate;
  var enddate = req.query.enddate;

  
  if((tagnum == null)||(tagnum == 'undefined')){
    tagnum = '53212'
    strdate = '2024-05-13'
    enddate = '2024-06-12'
  }

  var retObject = new Object();
  var userObject = new Object();

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }

  var rows = await db.get_feed_per_livestock_hour(tagnum,strdate,enddate)
  if(rows.all.length == 0){
      retObject.retcode = "fail";
  }else{
      retObject.retcode = "success";
      retObject.all = rows.all; 
      retObject.data = rows; 
  }

  var rows = await db.get_perlivestock(userObject.member_id)
  if(rows.length == 0){
      retObject.retcode = "fail";
  }else{
      retObject.retcode = "success";
      retObject.livestock = rows;     
  }

  return res.render('perlivestock/perlivestock_hour',{userObject:userObject,retObject:retObject});
};


exports.get_feed_per_hour = async (req, res, next) => {
  console.log('get_feed_per_hour start');

  var retObject = new Object();
  var strdate = req.query.strdate;
  var strhour = req.query.strhour;
  var enddate = req.query.enddate;
  var endhour = req.query.endhour;
  //console.log(JSON.stringify(req.query))
  var rows = await db.get_feed_per_hour(strdate,strhour,enddate,endhour)
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
 
  var rows = await db.get_feed_per_livestock_hour(tagnum,strdate,enddate)
  if(rows.all.length == 0){
      retObject.retcode = "fail";
  }else{
      retObject.retcode = "success";
         
  }
  retObject.data = rows; 
   
  console.log(JSON.stringify(retObject))
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

