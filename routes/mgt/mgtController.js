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

const nodemailer = require('nodemailer');




var ApiResponse = new Object();

var request = require("request");
var options = {
  headers: { "user-agent": "node.js" },
};


exports.email = async (req, res, next) => {
  console.log("email start");
  var istamp_list_seq = req.query.istamp_list_seq;


     // SMTP 서버 설정
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'khkim@eterners.com', // 당신의 이메일 주소
          //pass: 'twsz rpzg wvnw vmgz'   // 당신의 이메일 비밀번호 (또는 앱 비밀번호)
          pass:'clat hqdj hldf ijka'
      }
    });

    var data = "";
    try {
      // 동기 방식으로 파일 읽기
      data = fs.readFileSync('routes/mgt/email_format.js', 'utf8');
      //console.log('파일 내용:', data);
    } catch (err) {
      console.error('파일을 읽는 중 오류가 발생했습니다:', err);
    }
    //해당 STAM 을 조회함
    var sql = " select *, DATE_FORMAT(a.crdt_date,  '%Y-%m-%d %H:%i:%s') AS formatted_date "
    sql += " from istamp_list as a where a.istamp_list_seq = '"+istamp_list_seq+"'"  ; 
    console.log("sql:"+sql);
    let [row] = await global.mysqlPool.query(sql).catch((e) => {
      throw new Error('처리중 오류가 발생했습니다!');
      console.error(e);
    });
    
    //data = data.replace('{date}',row[0].formatted_date);
    data = data.replace('{Image}',row[0].ipfs_cid);
    data = data.replace('{Image}',row[0].ipfs_cid);    
    data = data.replace('{NFT}',row[0].metadata_url);
    data = data.replace('{NFT}',row[0].metadata_url);

      // 이메일 옵션 설정
    const mailOptions = {
      from: 'khkim@eterners.com',     // 발신자 이메일 주소
      to: 'hijasmine444@gmail.com',// 수신자 이메일 주소
      subject: '[ISTAM]Your contents safy saving Blockcahin',    // 이메일 제목
      //text: 'Hello world!',             // 이메일 내용 (텍스트)
      html: data
      // html: '<b>Hello world!</b>'     // 이메일 내용 (HTML)
    };

    // 이메일 발송
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      //console.log('Email sent: ' + info.response);
    });

  var retObject = new Object();
  retObject.ret = "success";

 return res.json(retObject);    
};



exports.emailformat = async (req, res, next) => {
  console.log("emailformat start");

  var retObject = new Object();
  retObject.ret = "success";

  //return res.json(retObject);
  return res.render('istamp/emailformat');
};



exports.email_contents = async (req, res, next) => {
  console.log("email_contents start");
  
  var to_email = req.query.to_email;
  var email_subject = req.query.email_subject;
  var email_contents = req.query.email_contents;
  console.log("req.query:"+JSON.stringify(req.query));

     // SMTP 서버 설정
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'khkim@eterners.com', // 당신의 이메일 주소
           //pass: 'twsz rpzg wvnw vmgz'   // 당신의 이메일 비밀번호 (또는 앱 비밀번호)
          pass:'clat hqdj hldf ijka'
      }
    });

    var data = "";
    data = email_contents;

      // 이메일 옵션 설정
    const mailOptions = {
      from: 'khkim@eterners.com',     // 발신자 이메일 주소
      to: to_email,// 수신자 이메일 주소
      subject: email_subject,    // 이메일 제목
      //text: 'Hello world!',             // 이메일 내용 (텍스트)
      //html: "data"
       html: email_contents    // 이메일 내용 (HTML)
    };

    // 이메일 발송
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      //console.log('Email sent: ' + info.response);
    });

  var retObject = new Object();
  retObject.ret = "success";

 return res.json(retObject);    
};
