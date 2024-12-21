const { default: axios } = require("axios");
var express = require("express");
const { restart } = require("nodemon");
var app = express();
const mysql = require("mysql2");
const crypto = require('crypto');
const multer = require('multer');

var request = require("request");
var options = {
  headers: { "user-agent": "node.js" },
};


var RET_NO_LOGIN = "9";
var RET_LOGIN = "1";
var RET_SUCCESSS = "1";
var RET_FAIL = "0";
var default_session = new Object();
default_session.email='';
default_session.member_seq=0;
default_session.member_id='';
default_session.member_location='';
default_session.area='';
default_session.authorized=false;



exports.uploadpage = async (req, res, next) => {
    console.log("uploadpage start");

    //관리자 회원일련번호
    var member_seq = req.query.member_seq;
    var prdt_seq = req.query.prdt_seq;
    var pic_type_cd = req.query.pic_type_cd;
    
    var prdtList = new Object();    
    prdtList.prdt_seq = prdt_seq;
    prdtList.pic_type_cd = pic_type_cd;//00:장비사진, 10: 사용자면허증, 20:정비사진        
    
    return res.render('upload/uploadpage',{prdtList,prdtList,member_seq:member_seq});    
};


exports.uploadcomplete = async (req, res, next) => {
  console.log("uploadcomplete start");
   
  return res.render('upload/uploadcomplete');    
};

exports.view_pic = async (req, res, next) => {
  console.log("view_pic start");

  var tbl_prdt_pic_seq = req.query.tbl_prdt_pic_seq;
  
  var sql_view ="";  
  sql_view += " select *, ";
  sql_view += " DATE_FORMAT(crdt_date, '%Y-%m-%d %H:%i:%s') AS CRDT_DATE ";
  sql_view += " from tbl_prdt_pic where tbl_prdt_pic_seq ="+tbl_prdt_pic_seq;
  sql_view += " order by crdt_date";
    console.log('sql_view:'+sql_view);
    
    let [rows_view] = await global.mysqlPool.query(sql_view).catch((e) => {
          console.error(e);
    });

    var prdtList = new Object();
    // 해시 값 추출
    generateHash(rows_view[0].tbl_prdt_pic)
    .then(hash => {
      console.log(`Hash value: ${hash}`)
      prdtList.hash=hash;
    })
    .catch(err => console.error(`Error: ${err.message}`));

        
    prdtList.rows_view = rows_view[0];
    prdtList.tbl_prdt_pic_seq = tbl_prdt_pic_seq;
   
  return res.render('upload/view_pic',{prdtList,prdtList});    
};

// 해시 값을 생성하는 함수
function generateHash(filePath) {
  return new Promise((resolve, reject) => {
    // create a hash object
    const hash = crypto.createHash('sha256');
    
    // create a read stream from the file
    const fileStream = fs.createReadStream(filePath);
    
    // handle errors from the stream
    fileStream.on('error', err => reject(err));
    
    // pipe the file data into the hash object
    fileStream.on('data', chunk => hash.update(chunk));
    
    // resolve the promise with the hash once the file is completely read
    fileStream.on('end', () => resolve(hash.digest('hex')));
  });
}
exports.pic_list = async (req, res, next) => {
  console.log("pic_list start");

  var member_seq = req.query.member_seq;
  var pic_index = req.query.pic_index;
  var pic_type_cd = req.query.pic_type_cd;
  
  var subquery = "";
  if((member_seq == null)||(member_seq == 'undefined')||(member_seq == '0')){
    subquery += " pic_type_cd ="+pic_type_cd;
  }else{
    subquery = " member_seq ="+member_seq;
    subquery += " and pic_type_cd ="+pic_type_cd;
  }
  
  
  var sql_view ="";  
  sql_view += " select * , ";
  sql_view += " DATE_FORMAT(crdt_date, '%Y-%m-%d %H:%i:%s') AS CRDT_DATE ";
  sql_view += " from tbl_prdt_pic where ";
  sql_view += subquery;
  sql_view += " order by crdt_date desc";
    console.log('sql_view:'+sql_view);
    
    let [rows_view] = await global.mysqlPool.query(sql_view).catch((e) => {
          console.error(e);
    });
    var prdtList = new Object();
    prdtList.list = rows_view;
    prdtList.member_seq = member_seq;
    prdtList.pic_index = pic_index;
    prdtList.pic_type_cd = pic_type_cd;

    console.log("prdtList:"+JSON.stringify(prdtList));
   
  return res.render('upload/pic_list',{prdtList,prdtList});    
};



// 파일 저장 경로와 파일명 지정
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, Date.now() + '-' + basename.replace(/[^a-zA-Z0-9]/g, '') + ext);
  }
});

// multer 인스턴스 생성
const upload = multer({ storage: storage });

// 파일 업로드를 처리하는 라우트
// 파일 업로드 처리 (여러 파일 업로드)
exports.upload = async (req, res, next) => {
  console.log('upload start');
  const files = req.files;
  console.log(files);
  
  if (!files || files.length === 0) {
    const error = new Error('Please upload one or more files');
    error.status = 400;
    return next(error);
  }

  const fileNames = files.map(file => file.originalname);
  res.send(fileNames);
};
/****
 * REST 통신
 */
async function sendURL(myaddr, options) {
    // Return new promise
    return new Promise(function (resolve, reject) {
      // Do async job
      request(myaddr, options, function (error, response, body) {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      });
    });
  }

  
async function fetchData(sql) {
    try {
        let rows = await global.mysqlPool.query(sql);
        console.log(JSON.stringify(rows));
        return rows[0]; // Assuming rows is an array and you want to return the first element
        // Process rows here
    } catch (error) {
        console.error(error);
        return "DB Error"; // Or handle the error in another appropriate way
    }
}
