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



exports.donbanglist = async (req, res, next) => {
  console.log('donbanglist start');
  var retObject = new Object();
  var userObject = new Object();

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }
  console.log(userObject.member_id);
  var rows = await db.getDonBangList(userObject.member_id)
  if(rows.length == 0){
      retObject.retcode = "fail1";
      retObject.data = [];
  }else{
      retObject.data = rows;
  }
  console.log(JSON.stringify(retObject))
  return res.render('donbang/donbanglist',{userObject:userObject,retObject:retObject});
};


exports.donlist = async (req, res, next) => {
  console.log('donlist start');

  var retObject = new Object();
  var userObject = new Object();

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }
  var gwid = req.query.gwid;
  var rows = await db.getDonList(gwid)
  if(rows.length == 0){
      retObject.retcode = "fail1";
      retObject.data = [];
  }else{
      retObject.data = rows;
  }
  return res.render('donbang/donlist',{gwid:gwid,userObject:userObject,retObject:retObject});
};
exports.senserlist = async (req, res, next) => {
  console.log('senserlist start');
  var retObject = new Object();
  var userObject = new Object();

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }
  return res.render('donbang/senserlist',{userObject:userObject});
};

exports.donbang_insert = async (req, res, next) => {
  console.log('donbang_insert start');
  var retObject = new Object();
  var userObject = new Object();

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }
  return res.render('donbang/donbang_insert',{userObject:userObject});
};

exports.Ajaxdonbang_insert = async (req, res, next) => {
  console.log('Ajaxdonbang_insert start');
  var retObject = new Object();
  var userObject = new Object();
  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }
  req.body.member_id =  userObject.member_id
  req.body.crdt_id =  userObject.member_id
  
  var rows = await db.insertDonBang(req.body)
  retObject.ret ="success";
  return res.json(retObject);
};
exports.Ajaxdon_insert = async (req, res, next) => {
  console.log('Ajaxdon_insert start');
  var retObject = new Object();
  var userObject = new Object();
  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }
  req.body.member_id =  userObject.member_id
  req.body.crdt_id =  userObject.member_id
  
  var rows = await db.insertDon(req.body)
  retObject.ret ="success";
  return res.json(retObject);
};

exports.senser_insert = async (req, res, next) => {
  console.log('senser_insert start');
  
  var retObject = new Object();
  var userObject = new Object();

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }
  return res.render('donbang/senser_insert',{userObject:userObject,retObject:retObject});
};

exports.don_insert = async (req, res, next) => {
  console.log('don_insert start');

  var retObject = new Object();
  var userObject = new Object();
  var gwid = req.query.gwid;

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }
//축사을 조회
  var rows = await db.getDonBangList(userObject.member_id)
  if(rows.length == 0){
      retObject.ret = "fail1";
      retObject.data = [];
  }else{
    retObject.ret = "success";
    retObject.data = rows;
  }
  return res.render('donbang/don_insert',{gwid:gwid,userObject:userObject,retObject:retObject});
};

exports.dash = async (req, res, next) => {
  console.log('dash start');
  var retObject = new Object();
  var userObject = new Object();

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }

  var rows = await db.getLiveStockPriceList()
  if(rows.length == 0){
      retObject.retcode = "fail1";
  }else{
      retObject.livestocklist = rows;
  }

  
  var rows1 = await db.getDash(userObject.member_id)
  if(rows1.length == 0){
      retObject.retcode = "fail1";
  }else{
      retObject.dash = rows1[0];
  }
  console.log(JSON.stringify(retObject))
  return res.render('donbang/dash',{userObject:userObject,retObject:retObject});
};