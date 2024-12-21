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


exports.feedstufflist = async (req, res, next) => {
  console.log('feedstufflist start');

  var retObject = new Object();
  var userObject = new Object();

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }

  
  var rows = await db.select_feed_all()
  console.log(JSON.stringify(rows))
  retObject.data = rows;     
  retObject.str_data = JSON.stringify(rows);     

  
  var rows_trans = await db.select_feed_trans_all()
  retObject.trans = rows_trans;     
 

  return res.render('feedstuff/feedstufflist',{userObject:userObject,retObject:retObject});
};



exports.feedstuff_insert = async (req, res, next) => {
  console.log('feedstuff_insert start');
  
  var retObject = new Object();
  var userObject = new Object();

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }

  
  var rows = await db.select_code("feed_model")
  retObject.data = rows;     
  return res.render('feedstuff/feedstuff_insert',{userObject:userObject,retObject:retObject});
};





exports.AjaxFeedTransInsert = async (req, res, next) => {   
  console.log("AjaxFeedTransInsert start");
  var retObject = new Object();

  retObject.feed_model = req.body.feed_model;
  retObject.livestock_type = req.body.livestock_type;
  retObject.feed_stock_type = req.body.feed_stock_type;
  retObject.amount = req.body.amount;
  retObject.reg_date = req.body.reg_date;
    
  var rows = await db.insert_FeedTrans(retObject)
  retObject.ret = "success";
  return res.json(retObject);    
 
};