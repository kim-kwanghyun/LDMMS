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

exports.calender_basic = async (req, res, next) => {
  console.log('calender_basic start');
  //res.setHeader('Content-Type', 'application/json');

  var userObject = new Object();
  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }


  var rows = await db.select_calender()
  console.log(JSON.stringify(rows))
  retObject.data = rows;     
  retObject.str_data = JSON.stringify(rows);     

  
  var rows_trans = await db.select_feed_trans_all()
  console.log(JSON.stringify(rows_trans))
  retObject.trans = rows_trans;
/*
  if(rows.length == 0){
      retObject.retcode = "fail";
  }else{
      retObject.retcode = "success";
      retObject.data = rows;     
  } 
      */ 
  //console.log("retObject.data:" + retObject.data)
  return res.render('todolist/calender_basic',{userObject:userObject,retObject:retObject});
};
exports.calender_list = async (req, res, next) => {
  console.log('calender_list start');
  var userObject = new Object();
  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }

  
  var rows = await db.select_calender()
  console.log(JSON.stringify(rows))
  retObject.data = rows;     
  retObject.str_data = JSON.stringify(rows);     
  return res.render('todolist/calender_list',{userObject:userObject, retObject:retObject});
};


exports.bbs_list = async (req, res, next) => {
  console.log('bbs_list start');
  var userObject = new Object();
  var retObject = new Object();
  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }  

  var rows = await db.select_bbs_all()
  if(rows.length == 0){
      retObject.retcode = "fail";
  }else{
      retObject.retcode = "success";
      retObject.data = rows;     
  }
  //console.log(JSON.stringify(retObject.data));

  return res.render('todolist/bbs_list',{userObject:userObject,retObject:retObject});
};

exports.bbs_update = async (req, res, next) => {
  console.log('bbs_update start');
  var userObject = new Object();
  var bbs_seq = req.query.bbs_seq;
  console.log("bbs_seq:"+bbs_seq);

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }  
  if((bbs_seq == null)||(bbs_seq == 'undefined')){
    bbs_seq = 0;
  }
  console.log("bbs_seq:"+bbs_seq);
  var rows = await db.select_bbs_detail(bbs_seq)
  if(rows.length == 0){
      retObject.retcode = "fail";
  }else{
      retObject.retcode = "success";
      retObject.data = rows;     
  }  
  return res.render('todolist/bbs_update',{userObject:userObject,retObject:retObject});
};


exports.bbs_insert = async (req, res, next) => {
  console.log('bbs_insert start');
  var userObject = new Object();

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }  

  
  return res.render('todolist/bbs_insert',{userObject:userObject,retObject:retObject});
};

exports.AjaxBBSInsert = async (req, res, next) => {   
  console.log("AjaxBBSInsert start");
  var title = req.body.title;
  var contents = req.body.contents;
  
  var retObject = new Object();
  retObject.title = title;
  retObject.contents = contents;
  
  var rows = await db.insert_bbs(retObject)
  retObject.ret = "success";
  return res.json(retObject);    
 
};


exports.AjaxBBSUpdate = async (req, res, next) => {   
  console.log("AjaxBBSUpdate start");
  var reply = req.body.reply;
  var bbs_seq = req.body.bbs_seq;
  var memeber_id = req.session.user.member_id;
  
  var retObject = new Object();
  retObject.reply = reply;
  retObject.bbs_seq = bbs_seq;
  
  var rows = await db.update_bbs(bbs_seq,reply ,memeber_id)
  retObject.ret = "success";
  return res.json(retObject);    
 
};


exports.AjaxCalenderInsert = async (req, res, next) => {   
  console.log("AjaxCalenderInsert start");
  var title = req.body.title;
  var start = req.body.start;
  var end = req.body.end;
  
  var retObject = new Object();
  retObject.title = title;
  retObject.start_date = start;
  retObject.end_date = end;
  retObject.crdt_id = req.session.user.member_id;
  
  var rows = await db.insert_calender(retObject)
  retObject.ret = "success";
  return res.json(retObject);    
 
};


exports.AjaxCalenderDelete = async (req, res, next) => {   
  console.log("AjaxCalenderDelete start");
  var id = req.body.id;
  
  var retObject = new Object();
  retObject.id = id;
  
  var rows = await db.delete_calender(id)
  retObject.ret = "success";
  return res.json(retObject);    
 
};

