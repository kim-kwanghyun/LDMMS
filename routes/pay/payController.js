//const { default: axios } = require("axios");
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
const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');

  
const PRE_PAY_STATUS = 1;
const POST_PAY_STATUS = 2;
const POST_PAY_FAILE_STATUS = 3;
const MEMBER_REG_TRANS_TYPE = 1;
const REQ_FRIEND_TRANS_TYPE = 2;
const CONFIRM_FRIEND_TRANS_TYPE = 3;
const CONFIRM_MY_FRIEND_TRANS_TYPE = 4;
const RECHARGE_TRANS_TYPE = 10;
const PAY_TRANS_TYPE = 11;

const PAY_TYPE_CREDIT = 1;
const PAY_TYPE_PAYPAL = 2;

// Google API 인증 설정
const auth = new GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/androidpublisher'],
});

exports.verifyPurchase = async (req, res, next) => { 

  const packageName = "kr.co.hping.istam";
  const productId = "com.eterners.istam.1stam";
  const purchaseToken = "plphffpocjfgdjfggcgbagah.AO-J1OwWwFWYCwQsNsri6evWHMSyLgwwoB1OYfKtifuvR7lNJkIjoZo2gXF-z5FgXE04q07BAGMA3mEqjiLa0EVjcIgJB7GfQw";

  if (!packageName || !productId || !purchaseToken) {
    return res.status(400).json({ error: 'Invalid request parameters' });
  }

  try {
    console.log("client start 1");
    // Google API에 접근하기 위한 인증 토큰 가져오기
    const client = await auth.getClient();
    console.log("client start 2");
    const accessToken = await client.getAccessToken();
    console.log("accessToken.token:"+accessToken.token);
    // Google Play Developer API 호출
    const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/products/${productId}/tokens/${purchaseToken}`;

    

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
      },
    });

    // 조회 결과 반환
    return res.status(200).json(response.data);

  } catch (error) {
    console.error('Error verifying purchase:', error.response ? error.response.data : error.message);
    return res.status(500).json({ error: 'Failed to verify purchase' });
  }
};


exports.pay = async (req, res, next) => { 
  var userObject = req.session.user;  
  var retObject = new Object();  
  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/istamp/reloadwinodw');
    //return res.redirect('/istamp/login');
  }
  //1. 회원정보 조회
  var sql_select = "select * from tbl_member where member_id ='" +userObject.member_id+ "'";
  
  console.log("sql_select:"+sql_select);
  let [rows] = await global.mysqlPool.query(sql_select).catch((e) => {
    throw new Error('처리중 오류가 발생했습니다!');
    console.error(e);
  });
  retObject.list = rows[0];

  //2. 판매가능상품조회
  var sql_prdt  = "select * from tbl_cd_val where cd_id ='PURCHASE_PRTDT' order by cd_val_seq";
  
  console.log("sql_prdt:"+sql_prdt);
  let [rows_prdt] = await global.mysqlPool.query(sql_prdt).catch((e) => {
    throw new Error('처리중 오류가 발생했습니다!');
    console.error(e);
  });
  var prdtObject = new Object();
  prdtObject.data = rows_prdt;
  
  console.log("pay start");
  return res.render('pay/pay',{userObject:userObject,retObject:retObject,prdtObject:prdtObject})
};

exports.istam_mypay_list = async (req, res, next) => { 
  var userObject = req.session.user;  
  console.log("istam_mypay_list start");
  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/istamp/reloadwinodw');
    //return res.redirect('/istamp/login');
  }

  var retObject = new Object();

  var sql ="select *  ";
  //sql += " ,(select cd_type_desc from tbl_cd_val where cd_type = a.pay_type and cd_id = 'pay_type') as PAY_TYPE, ";
  //sql += " (select cd_type_desc from tbl_cd_val where cd_type = a.pay_type and cd_id = 'pay_status') as PAY_STATUS ";
  sql += " from istamp_payment as a where a.member_id = '"+userObject.member_id+"'";
  sql += " order by a.crdt_date desc ";
  console.log("sql:"+sql);
  let [rows] = await global.mysqlPool.query(sql).catch((e) => {    
    retObject.retcode = "fail";
    return res.json(retObject)
  });
  retObject.list = rows;

  return res.render('pay/istam_mypay_list',{retObject:retObject, userObject:userObject});

};
exports.istam_pay = async (req, res, next) => { 
  var userObject = req.session.user;  
  console.log("istam_pay start");
  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/istamp/reloadwinodw');
    //return res.redirect('/istamp/login');
  }
  var amount = req.query.amount; 
  var orderName = req.query.orderName; 
     

  var payObject = await pre_pay(amount,orderName,PAY_TYPE_CREDIT,userObject);
  console.log("payObject:"+JSON.stringify(payObject));
  return res.render('pay/istam_pay',{userObject:userObject,payObject:payObject})
};


exports.istam_pay_paypal = async (req, res, next) => { 
  var userObject = req.session.user;  
  console.log("istam_pay_paypal start");
  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/istamp/reloadwinodw');
    //return res.redirect('/istamp/login');
  }
  var amount = req.query.amount; 
  var orderName = req.query.orderName; 

  var payObject = await pre_pay(amount,PAY_TYPE_PAYPAL,userObject);
  console.log("payObject:"+JSON.stringify(payObject));

 return res.render('pay/istam_pay_paypal',{userObject:userObject,payObject:payObject})
};
/*
 /pay/istam_pay_success_return?paymentType=NORMAL&orderId=74AKZ1igVpvSBtJ_caM7b&paymentKey=tgen_20240804195149LRhS0&amount=5000    
 paymentType=NORMAL
 orderId=74AKZ1igVpvSBtJ_caM7b
 paymentKey=tgen_20240804195149LRhS0
 amount=5000
*/
exports.istam_pay_success_return = async (req, res, next) => { 
  var userObject = req.session.user;
  console.log("istam_pay_success_return start");
  console.log(JSON.stringify(req.body));

  var sqlObject = new Object();
  sqlObject.paymentType = req.query.paymentType;
  sqlObject.orderId = req.query.orderId;
  sqlObject.paymentKey = req.query.paymentKey;
  sqlObject.amount = req.query.amount;
  sqlObject.pay_status = POST_PAY_STATUS;
  sqlObject.mdfy_id = userObject.member_id;
  sqlObject.member_id = userObject.member_id;
  
  //await addMileage(userObject.member_id, sqlObject.amount, RECAHRGE_TRANS_TYPE);
  //await updateTransLog(sqlObject);

  processTransaction(userObject, sqlObject, RECHARGE_TRANS_TYPE);

  req.session.user.mileage = Number(Number(req.session.user.mileage) + Number(sqlObject.amount));

 return res.redirect('/pay/pay');
};

async function processTransaction(userObject, sqlObject, RECHARGE_TRANS_TYPE) {
  try {
      // 첫 번째 비동기 함수 실행
      await addMileage(userObject.member_id, sqlObject.amount, RECHARGE_TRANS_TYPE);
      
      // 첫 번째 함수가 완료된 후 두 번째 비동기 함수 실행
      await updateTransLog(sqlObject);
      
      console.log('Both functions have completed successfully.');
  } catch (error) {
      console.error('An error occurred:', error);
  }
}

exports.istam_pay_fail_return = async (req, res, next) => { 
  var userObject = req.session.user;
  console.log("istam_pay_fail_return start");
  console.log(JSON.stringify(req.body));

  var sqlObject = new Object();
  sqlObject.paymentType = req.query.paymentType;
  sqlObject.orderId = req.query.orderId;
  sqlObject.paymentKey = req.query.paymentKey;
  sqlObject.amount = req.query.amount;
  sqlObject.pay_status = POST_PAY_FAILE_STATUS;
  sqlObject.mdfy_id = userObject.member_id;
  sqlObject.member_id = userObject.member_id;
  

  await updateTransLog(sqlObject); 
  
  return res.redirect('/pay/pay');
};

exports.istam_pay_intro = async (req, res, next) => { 
  var userObject = req.session.user;
  console.log("istam_pay_intro start");
  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/istamp/reloadwinodw');
    //return res.redirect('/istamp/login');
  }
  
  var retObject = new Object();
  retObject.data = req.body;

 return res.render('pay/istam_pay_intro',{userObject:userObject,retObject:retObject})
};

exports.pre_pay = async (req, res, next) => { 
  var userObject = req.session.user;
  console.log("pre_pay start");  
  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/istamp/reloadwinodw');
    //return res.redirect('/istamp/login');
  }
  var retObject = new Object();
  retObject.data = req.body;
  var amount = req.body.amount;
  var pay_type = req.body.pay_type;
  var paymentKey = "ISTAM_"+ userObject.member_id + getUnixTimestamp();
  var orderId = "74AKZ1igVpvSBtJ_caM7b";
  //var orderId = userObject.member_id + getUnixTimestamp();
  var pay_day = getPayDate();
  var orderName = "";

  var pay_status = PRE_PAY_STATUS;

  var sql ="insert into istamp_payment(paymentKey, orderId, member_seq, member_id, member_name ";
  sql += " , pay_day, amount,pay_type, pay_status , orderName, crdt_date, crdt_id) ";
  sql += " values('"+paymentKey+"','"+orderId+"', "+userObject.member_seq+", '"+userObject.member_id+"','"+userObject.member_name+"'";
  sql += " ,'"+pay_day+"',"+amount+",'"+pay_type+"',"+pay_status+",'"+orderName+"', sysdate(), '"+userObject.member_id+"') ";
  console.log("sql:"+sql);
  let [rows] = await global.mysqlPool.query(sql).catch((e) => {
    
    retObject.retcode = "fail";
    return res.json(retObject)
  });

  retObject.retcode = "success";  
  return res.render('pay/istam_pay', {retObject:retObject});
};


async function pre_pay(amount,orderName,pay_type,userObject){  
  console.log("pre_pay start");
  

  var retObject = new Object(); 
  retObject.amount = amount;
  retObject.orderName = orderName;  
  retObject.pay_type = pay_type;
  retObject.paymentKey = "ISTAM_"+ userObject.member_id + getUnixTimestamp();
  retObject.orderId = "74AKZ1igVpvSBtJ_caM7b";
  //retObject.orderId = userObject.member_id + getUnixTimestamp();
  retObject.pay_day = getPayDate();

  retObject.pay_status = PRE_PAY_STATUS;

  var sql ="insert into istamp_payment(paymentKey, orderId, member_seq, member_id, member_name ";
  sql += " , pay_day, amount,pay_type, pay_status , orderName, crdt_date, crdt_id) ";
  sql += " values('"+retObject.paymentKey+"','"+retObject.orderId+"', "+userObject.member_seq+", '"+userObject.member_id+"','"+userObject.member_name+"'";
  sql += " ,'"+retObject.pay_day+"',"+retObject.amount+",'"+retObject.pay_type+"',"+retObject.pay_status+",'"+retObject.orderName+"', sysdate(), '"+userObject.member_id+"') ";
  console.log("sql:"+sql);
  let [rows] = await global.mysqlPool.query(sql).catch((e) => {
    
    retObject.retcode = "fail";
    return retObject;
  });

  retObject.retcode = "success";  
  return retObject;
}

const getPayDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');  

  return `${year}${month}${day}`;
};
const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};
const getUnixTimestamp = () => {
  const now = new Date();
  const unixTimestamp = Math.floor(now.getTime() / 1000);
  return unixTimestamp;
};
/*****
 * 결제 공통 함수
 */


async function addMileage(member_id, amount, TRANS_TYPE){
  
  var sql_insert ="insert tbl_mileage_log (member_id, trans_date, trans_type, amount, crdt_id, crdt_date) ";
  sql_insert += " values ('"+member_id+"', (DATE_FORMAT(CURDATE(), '%Y%m%d')),"+RECHARGE_TRANS_TYPE+",";
   sql_insert += " (select amount from tbl_cd_val where cd_type = "+TRANS_TYPE+" and cd_id = 'MILEAGE_TYPE') ,"
   sql_insert += " '"+member_id+"',sysdate())";
  console.log("sql_insert:"+sql_insert);
  let [row_insert] = await global.mysqlPool.query(sql_insert).catch((e) => {        
    return false;
  });

  var sql ="update tbl_member set mileage = mileage + "+amount+"" ;
  sql += " where member_id = '"+member_id +"'";
  console.log("sql:"+sql);
  let [rows] = await global.mysqlPool.query(sql).catch((e) => {        
    return false;
  });

  return true;
}

async function addMileage_prdt(member_id, PURCHASE_PRTDT, device_type){
  
  var sql_insert ="insert tbl_mileage_log (member_id, trans_date, trans_type, amount, crdt_id, crdt_date) ";
  sql_insert += " values ('"+member_id+"', (DATE_FORMAT(CURDATE(), '%Y%m%d')),"+RECHARGE_TRANS_TYPE+",";
  if(device_type == "1"){
   sql_insert += " (select amount from tbl_cd_val where cd_id = 'PURCHASE_PRTDT' and google_prdt='"+ PURCHASE_PRTDT +"') ,"
  }else {
    sql_insert += " (select amount from tbl_cd_val where cd_id = 'PURCHASE_PRTDT' and app_prdt='"+ PURCHASE_PRTDT +"') ,"
  }
   sql_insert += " '"+member_id+"',sysdate())";
  console.log("sql_insert:"+sql_insert);
  let [row_insert] = await global.mysqlPool.query(sql_insert).catch((e) => {        
    return false;
  });

  var sql ="";
  if(PURCHASE_PRTDT.includes("monthly")){
    sql ="insert into tbl_member_subscription(member_id, prdt_id, str_date, end_date,crdt_date,  crdt_id,enable ) "
    sql += " values ('"+member_id+"', '"+PURCHASE_PRTDT+"', DATE_FORMAT(CURDATE(), '%Y-%m-%d') , DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-%d') ,sysdate(),  '"+member_id+"',1 ) "
  }else {
    sql ="update tbl_member ";
    if(device_type == "1"){
      sql += "set mileage = mileage + (select amount from tbl_cd_val where cd_id = 'PURCHASE_PRTDT' and google_prdt='"+ PURCHASE_PRTDT +"') "
    }else{
      sql += "set mileage = mileage + (select amount from tbl_cd_val where cd_id = 'PURCHASE_PRTDT' and app_prdt='"+ PURCHASE_PRTDT +"') "
    }
    sql += " where member_id = '"+member_id +"'";
  }
  
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


// 구글페이 결제 후 리턴값 처리 엔드포인트
exports.googleapy_payment_callback = async (req, res, next) => { 

  var retObject = new Object();
  const paymentData = req.query;
  console.log("googleapy_payment_callback start");
  console.log("paymentData:"+JSON.stringify(paymentData));

  
  console.log('userObject:', JSON.stringify(userObject));
  //console.log('결제자:', userObject.member_id);

  retObject.paymentData = paymentData;
  var userObject = req.session.user;    

  // 구글페이로부터 전달된 결제 데이터 처리
  try {
      // 결제 상태 확인
      
      const transactionId = paymentData.transactionId;
      const productId = paymentData.productId;      
      const transactionReceipt = paymentData.transactionReceipt;
      const purchaseToken = paymentData.purchaseToken;
      
      const device_type = paymentData.device_type;
      const member_id = paymentData.member_id;
      var sqlObject = new Object();
      sqlObject.transactionId = transactionId;
      sqlObject.productId = productId;
      sqlObject.transactionReceipt = transactionReceipt;
      sqlObject.purchaseToken = purchaseToken;
      sqlObject.device_type = device_type;
      sqlObject.member_id = member_id;

      sqlObject.userObject = userObject;
            
      //console.log('결제 성공:', transactionReceipt);

          if(device_type == "1"){
             // 결제 처리 로직 추가 (예: 데이터베이스 저장, 영수증 생성 등)
             
            await addTransLog(sqlObject);
            await addMileage_prdt(sqlObject.member_id, sqlObject.productId, sqlObject.device_type);

            /*
            var sql ="insert into istamp_payment (transactionReceipt, transactionId, productId, device_type, crdt_date,crdt_id )";
            sql += " values ('"+transactionReceipt+"','"+transactionId+"','"+productId+"',"+device_type+",sysdate(),'"+sqlObject.member_id+"')"
            console.log("sql:"+sql);
            let [rows] = await global.mysqlPool.query(sql).catch((e) => {        
              return false;
            });
*/
            /*
            const url = `https://play.googleapis.com/admin/v1/purchases/products/${purchaseToken}?access_token=YOUR_ACCESS_TOKEN`;
    
            try {
              const response = await axios.get(url);              
              retObject.data = response.data;   
            } catch (error) {
              console.error('구글 인앱 결제 검증 실패:', error);
              throw error;
            }
              */
          }else if(device_type == "2"){
            //애플인앱결제일 경우
            try{
                  // 결제 처리 로직 추가 (예: 데이터베이스 저장, 영수증 생성 등)
                  await addTransLog(sqlObject);
                  await addMileage_prdt(sqlObject.member_id, sqlObject.productId, sqlObject.device_type);
                
                  /*
                  var sql ="insert into istamp_payment (transactionReceipt, transactionId, productId, device_type, crdt_date,crdt_id )";
                  sql += " values ('"+transactionReceipt+"','"+transactionId+"','"+productId+"',"+device_type+",sysdate(),'"+sqlObject.member_id+"')"
                  console.log("sql:"+sql);
                  let [rows] = await global.mysqlPool.query(sql).catch((e) => {        
                    return false;
                  });
                  */
  

/*
              //const APP_STORE_VERIFY_URL = 'https://buy.itunes.apple.com/verifyReceipt'; // (실제환경)
              const APP_STORE_VERIFY_URL = 'https://sandbox.itunes.apple.com/verifyReceipt';// (테스트 환경)
              const response = await axios.post(APP_STORE_VERIFY_URL, {
                'receipt-data': paymentData,
                'password': 'YOUR_SHARED_SECRET' // In-App Purchase Shared Secret (서브스크립션의 경우 필요)
              });
              retObject.data = response.data;  
              
  */            
            } catch (error) {
              console.error('Error verifying receipt:', error);
              throw error;
            }       
          }

          //잔액을 업데이트 함
          var sql_select ="select mileage from tbl_member " ;
          sql_select += " where member_id = '"+member_id +"'";
          console.log("sql_select:"+sql_select);
          let [rows_select] = await global.mysqlPool.query(sql_select).catch((e) => {        
            return false;
          });
          console.log("rows_select[0].mileage:"+rows_select[0].mileage);
          
          req.session.destroy();
          // 클라이언트에 성공 응답 전송
          //return res.render('istamp/istamp_alllist');
          return res.status(200).send({ message: 'Payment processed successfully' });
          /*
      } else {
          console.error('결제 실패: 올바르지 않은 결제 상태');
          return res.redirect('/pay/pay');
          return res.status(400).send({ message: 'Invalid payment status' });
      }
          */
  } catch (error) {
      console.error('결제 처리 중 오류 발생:', error);
      //return res.render('istamp/istamp_alllist');
    return res.status(500).send({ message: 'Internal server error' });
  }
};


async function addTransLog(sqlObject){  
  var sql ="";
  if(sqlObject.device_type == "1"){  
    sql ="insert into istamp_payment(";
    sql += " member_seq, member_id, member_name ";
    sql += " , pay_day, amount, pay_status , orderName, crdt_id, crdt_date,";
    sql += " transactionReceipt,transactionId,productId,purchaseToken,device_type) ";
    //sql += " values('','', "+sqlObject.userObject.member_seq+",";
    sql += " values( (select member_seq from tbl_member where member_id = '"+sqlObject.member_id+"'),";
    sql += " '"+sqlObject.member_id+"',(select member_name from tbl_member where member_id = '"+sqlObject.member_id+"')";
    sql += " ,  (DATE_FORMAT(CURDATE(), '%Y%m%d')),(select amount from tbl_cd_val where google_prdt = '"+sqlObject.productId+"'),";
    sql += "1,'"+sqlObject.productId+"',";
    sql += " '"+sqlObject.member_id+"',sysdate(),";
    sql += "'"+sqlObject.transactionReceipt+"','"+sqlObject.transactionId+"','"+sqlObject.productId+"','"+sqlObject.purchaseToken+"',"+sqlObject.device_type+") ";
  }else  if(sqlObject.device_type == "2"){  
    sql ="insert into istamp_payment( ";
    sql += " member_seq, member_id, member_name ";
    sql += " , pay_day, amount, pay_status , orderName, crdt_id, crdt_date,";
    sql += " transactionReceipt,transactionId,productId,purchaseToken,device_type) ";
    //sql += " values('','', "+sqlObject.userObject.member_seq+",";
    //sql += " '"+sqlObject.userObject.member_id+"','"+sqlObject.userObject.member_name+"'";
    sql += " values((select member_seq from tbl_member where member_id = '"+sqlObject.member_id+"'),";
    sql += " '"+sqlObject.member_id+"',(select member_name from tbl_member where member_id = '"+sqlObject.member_id+"')";
    sql += " ,  (DATE_FORMAT(CURDATE(), '%Y%m%d')),(select amount from tbl_cd_val where app_prdt = '"+sqlObject.productId+"'),";
    sql += "1,'"+sqlObject.productId+"',";
    //sql += " '"+sqlObject.userObject.member_id+"',sysdate(),";
    sql += " '"+sqlObject.member_id+"',sysdate(),";
    sql += "'"+sqlObject.transactionReceipt+"','"+sqlObject.transactionId+"','"+sqlObject.productId+"','"+sqlObject.purchaseToken+"',"+sqlObject.device_type+") ";
  }
  console.log("sql:"+sql);
  let [rows] = await global.mysqlPool.query(sql).catch((e) => {        
    return false;
  });
  return true;
}

