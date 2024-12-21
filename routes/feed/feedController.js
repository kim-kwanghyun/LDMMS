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
const abnormal_db  = require('../../utils/abnormal_database')

var retObject = new Object();

exports.feed_stat_hour = async (req, res, next) => {
  console.log('feed_stat_hour start');

  var retObject = new Object();
  var userObject = new Object();

  var gwid = req.query.gwid;
  var strdate = req.query.strdate;
  var strhour = req.query.strhour;
  var enddate = req.query.enddate;
  var endhour = req.query.endhour;

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }

  if((gwid == null)||(gwid == 'undefined')){
    gwid = '1'
    strdate = '2024-02-28'
    strhour = '10'
    enddate = '2024-03-10'
    endhour = '10'
  }

  var rows = await db.get_feed_stat_hour(gwid, strdate,strhour,enddate,endhour);
  console.log("rows.all.length:"+rows.all.length);
  if(rows.all.length == 0){
      retObject.retcode = "fail";
  }else{
      retObject.retcode = "success";
      retObject.all = rows.all; 
      retObject.data = rows; 
  }
  //console.log(JSON.stringify(retObject));
  return res.render('feed/feed_stat_hour',{userObject:userObject,retObject:retObject});
};

/***
 * 환경
 */
exports.get_feed_stat_hour = async (req, res, next) => {
  console.log('get_feed_stat_hour start');

  var retObject = new Object();
  var gwid = req.query.gwid;
  var strdate = req.query.strdate;
  var strhour = req.query.strhour;
  var enddate = req.query.enddate;
  var endhour = req.query.endhour;
  //console.log(JSON.stringify(req.query))
  var rows = await db.get_feed_stat_hour(gwid,strdate,strhour,enddate,endhour)
  if(rows.length == 0){
      retObject.retcode = "fail";
  }else{
      retObject.retcode = "success";
      retObject.data = rows;     
  }
  //console.log(JSON.stringify(retObject))
  return res.json(retObject);
};


exports.feed_stat_day = async (req, res, next) => {
  console.log('feed_stat_day start');
  
  var retObject = new Object();
  var userObject = new Object();

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }

  return res.render('feed/feed_stat_day',{userObject:userObject});
};

exports.feed_stat_month = async (req, res, next) => {
  console.log('feed_stat_month start');
  
  var retObject = new Object();
  var userObject = new Object();

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }


  return res.render('feed/feed_stat_month',{userObject:userObject});
};

exports.index = async (req, res, next) => {
  console.log('index start');
  
  return res.render('feed/index');
};


exports.abnormal_donbang_info = async (req, res, next) => {
  console.log('abnormal_donbang_info start');
  
  var retObject = new Object();
  var userObject = new Object();

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }

  
  var rows = await db.select_code("feed_model")
  retObject.data = rows;     
  return res.render('feed/abnormal_donbang_info',{userObject:userObject,retObject:retObject});
};

exports.abnormal_livestock_info = async (req, res, next) => {
  console.log('abnormal_livestock_info start');
  
  var retObject = new Object();
  var userObject = new Object();

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }

  
  var rows = await db.select_code("feed_model")
  retObject.data = rows;     
  return res.render('feed/abnormal_livestock_info',{userObject:userObject,retObject:retObject});
};


exports.abnormal1 = async (req, res, next) => {
  console.log('abnormal1 start');
  
  var retObject = new Object();
  var userObject = new Object();

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }
   var rows = await abnormal_db.abnormal1()
  retObject.data = rows;
  return res.render('feed/abnormal1',{userObject:userObject,retObject:retObject});
};

exports.abnormal2 = async (req, res, next) => {
  console.log('abnormal2 start');
  
  var retObject = new Object();
  var userObject = new Object();

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }
   var rows = await abnormal_db.abnormal2()
  retObject.data = rows;
  return res.render('feed/abnormal2',{userObject:userObject,retObject:retObject});
};

exports.abnormal3 = async (req, res, next) => {
  console.log('abnormal3 start');
  
  var retObject = new Object();
  var userObject = new Object();

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }
   var rows = await abnormal_db.abnormal3()
  retObject.data = rows;
  return res.render('feed/abnormal3',{userObject:userObject,retObject:retObject});
};

exports.abnormal4 = async (req, res, next) => {
  console.log('abnormal4 start');
  
  var retObject = new Object();
  var userObject = new Object();

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }
   var rows = await abnormal_db.abnormal4()
  retObject.data = rows;
  return res.render('feed/abnormal4',{userObject:userObject,retObject:retObject});
};

exports.abnormal5 = async (req, res, next) => {
  console.log('abnormal5 start');
  
  var retObject = new Object();
  var userObject = new Object();

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }
   var rows = await abnormal_db.abnormal5()
  retObject.data = rows;
  return res.render('feed/abnormal5',{userObject:userObject,retObject:retObject});
};

exports.abnormal6 = async (req, res, next) => {
  console.log('abnormal6 start');
  
  var retObject = new Object();
  var userObject = new Object();

  var type = req.query.kind;
  var density = req.query.density; 
  console.log("type:"+type)

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }

  var co2 = 0;
  var nh3 = 0;
  var rows = "";
  
  if(type =="co2"){

    rows = await abnormal_db.abnormal6(type,density, nh3 );
  retObject.data = rows;
  }else if(type =="nh3"){ 

    rows = await abnormal_db.abnormal6(type,co2, density );
    retObject.data = rows;
  }else{
    retObject.data = {};
  }
  return res.render('feed/abnormal6',{userObject:userObject,retObject:retObject});
};
