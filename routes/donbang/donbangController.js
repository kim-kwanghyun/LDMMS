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
  var gwid = req.query.gwid;

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }

  var rows = await db.getSensorList(gwid)
  if(rows.length == 0){
      retObject.retcode = "fail1";
      retObject.data = [];
  }else{
      retObject.data = rows;
  }


  return res.render('donbang/senserlist',{userObject:userObject,retObject:retObject});
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


exports.AjaxMemberUpdate = async (req, res, next) => {
  console.log('AjaxMemberUpdate start');
  var retObject = new Object();
  var userObject = new Object();
  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }
  req.body.member_id =  userObject.member_id
  req.body.crdt_id =  userObject.member_id

  /*
  sendData.feed_model = document.getElementById("feed_model").textContent;
  sendData.postcode = document.getElementById("sample6_postcode").textContent;
  sendData.address = document.getElementById("sample6_address").textContent;
  sendData.extraAddress = document.getElementById("sample6_extraAddress").textContent;
  sendData.detailAddress = document.getElementById("sample6_detailAddress").textContent;
            
  
  var rows = await db.updateMeber(req.body)

  var rows = await db.updateFeedModel(req.body.feed_model)
*/
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
/***
 * 초기화면
 */
exports.dash = async (req, res, next) => {
  console.log('dash start');
  var retObject = new Object();
  var userObject = new Object();
  var kind = req.query.kind;
  var gwid = req.query.gwid;

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }
  
  if((gwid == null)||(gwid == 'undefined')){
    gwid = 1;
  }
  if((kind == null)||(kind == 'undefined')){
    kind = 1;
  }

  //개체수
  var rows0 = await db.select_normal(userObject.member_id, gwid)
  if(rows0.length == 0){
      retObject.retcode = "fail1";
  }else{
      retObject.dashdata = rows0[0];
  }
  console.log("retObject.dashdata:"+JSON.stringify(retObject.dashdata))
  console.log("retObject.dashdata:"+JSON.stringify(retObject.dashdata[0].livestock_cnt))
  console.log("retObject.dashdata.livestock_cnt:"+JSON.stringify(rows0[0].livestock_cnt))
  console.log("retObject.dashdata:"+retObject.dashdata.livestock_cnt)
  //개체수
  var gwid = 1;
  var rows1 = await db.getAVGweight(userObject.member_id,gwid)
  if(rows1.length == 0){
      retObject.retcode = "fail1";
  }else{
      retObject.dash = rows1[0];
  }
/**
 * 축사평균무게
 */
  var rows2 = await db.getAllAVGweight(userObject.member_id)
  if(rows2.length == 0){
      retObject.retcode = "fail1";
  }else{
    console.log(rows2[0].AVG)
    const num = rows2[0].AVG;
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    const formattedNum = formatter.format(num); // "89.00"

      retObject.allAVG = formattedNum;
  }


/*** 시세 */
//var livestock_type = 1;
  var rows = await db.getLiveStockPriceList(kind)
  if(rows.all.length == 0){
      retObject.retcode = "fail1";
  }else{
      retObject.livestocklist_all = rows.all;
      retObject.livestocklist_price = rows.price;
      retObject.livestocklist_month = rows.month;
      retObject.livestocklist_year = rows.year;
      retObject.livestocklist_kind = kind;
  }  
   /**** 개체 평균무게 */
  var strdate = '2024-05-13'
  var enddate = '2024-05-29'
  var rows4 = await db.get_avg_weight(strdate,enddate)
  if(rows4.all.length == 0){
    retObject.retcode = "fail1";
  }else{
    retObject.avg_weight_all = rows4.all;
    retObject.avg_weight_rcvtime = rows4.rcvtime;
    retObject.avg_weight_weight = rows4.weight;
  }
  console.log("retObject.avg_weight_rcvtime:"+JSON.stringify(retObject.avg_weight_rcvtime))
  console.log("retObject.avg_weight_weight:"+JSON.stringify(retObject.avg_weight_weight))
  
/****환경 */
  var gwid = '1'
  var strdate = '2024-02-28'
  var strhour = '10'
  var enddate = '2024-03-06'
  var endhour = '10'
  var rows3 = await db.get_feed_stat_hour(gwid,strdate,strhour,enddate,endhour)
  if(rows3.all.length == 0){
    retObject.retcode = "fail1";
}else{
    retObject.env = rows3.all;
    retObject.rcvday = ( rows3.rcvday);    
    retObject.temp = ( rows3.temp);
    retObject.humi = (rows3.humi);
    retObject.co2 = (rows3.co2);
    retObject.nh3 = (rows3.nh3);
}

  return res.render('donbang/dash',{userObject:userObject,retObject:retObject});
};



exports.livestock_info = async (req, res, next) => {
  console.log('livestock_info start');
  var retObject = new Object();
  var userObject = new Object();

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/member/login');
  }else{
    userObject = req.session.user;
  }
  var livestock_type = 1;
  var rows = await db.getLiveStockPriceList(livestock_type);
  console.log("rows:"+JSON.stringify(rows))

  if(rows.all.length == 0){
      retObject.retcode = "fail1";
  }else{
      retObject.livestocklist_all = rows.all;
      retObject.livestocklist_price = rows.price;
      retObject.livestocklist_month = rows.month;
      retObject.livestocklist_year = rows.year;
  }
console.log(JSON.stringify(retObject))
  
  var rows1 = await db.getCountLivestock(userObject.member_id)
  if(rows1.length == 0){
      retObject.retcode = "fail1";
  }else{
      retObject.countLivestock = rows1[0];
  }

  var rows2 = await db.select_code("feed_model")
  if(rows2.length == 0){
      retObject.retcode = "fail1";
  }else{
      retObject.data = rows2;
  }

  console.log(JSON.stringify(retObject))
  return res.render('donbang/livestock_info',{userObject:userObject,retObject:retObject});
};
