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
const cheerio = require('cheerio');
const remakeImage = require('./remakeImage');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const bodyParser = require('body-parser');
app.use(express.json());

var ApiResponse = new Object();
const apiKey = 'QN_e9f7fa8e0a974ed2b138d31644c26616';
const MAINNET = "POLYGON";

const PRE_PAY_STATUS = 1;
const POST_PAY_STATUS = 2;
const POST_PAY_FAILE_STATUS = 3;
const MEMBER_REG_TRANS_TYPE = 1;
const REQ_FRIEND_TRANS_TYPE = 2;
const CONFIRM_FRIEND_TRANS_TYPE = 3;
const CONFIRM_MY_FRIEND_TRANS_TYPE = 4;
const RECAHRGE_TRANS_TYPE = 10;
const PAY_TRANS_TYPE = 11;

const PAY_TYPE_CREDIT = 1;
const PAY_TYPE_PAYPAL = 2;


const contractAbi =[
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "initialOwner",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "ERC721IncorrectOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ERC721InsufficientApproval",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "approver",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidApprover",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidOperator",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidReceiver",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidSender",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ERC721NonexistentToken",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_fromTokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_toTokenId",
        "type": "uint256"
      }
    ],
    "name": "BatchMetadataUpdate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      }
    ],
    "name": "MetadataUpdate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "uri",
        "type": "string"
      }
    ],
    "name": "safeMint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

var request = require("request");
var options = {
  headers: { "user-agent": "node.js" },
};


exports.home = async (req, res, next) => {
  console.log("home start");
 
  var retObject = new Object();
  try{  
    if((req.session.user == null)||(req.session.user == 'undefined')){
      console.log("req.session.user  null");
      return res.redirect('/istamp/reloadwinodw');
      //return res.redirect('/istamp/login');
    }

    var userObject = req.session.user;
    var member_id = req.session.user.member_id;
  
    var sql_select = " SELECT a.*, ";
    sql_select += " DATE_FORMAT(a.crdt_date, '%Y-%m-%d') AS formatted_date ,";
    sql_select += " CASE WHEN a.crdt_date >= DATE_SUB(CURDATE(), INTERVAL 1 DAY) THEN 'NEW' ";
    sql_select += "       ELSE ''     END AS NEW_DATE ";
    sql_select += "  FROM ";
    sql_select += "  istamp_list a";
    sql_select += "  LEFT JOIN    tbl_istam_claim cl  ON a.istamp_list_seq = cl.istam_list_seq and cl.type = 2 and cl.claim_member_id='"+member_id+"' ";
    sql_select += "  WHERE cl.istam_claim_seq IS NULL  AND a.metadata_url IS NOT NULL   AND a.open = 1   AND a.block_view = 0  ";
    sql_select += "  order by a.crdt_date desc LIMIT 0, 30";

    console.log("sql_select:"+sql_select);
    let [rows] = await global.mysqlPool.query(sql_select).catch((e) => {
      throw new Error('처리중 오류가 발생했습니다!');
      console.error(e);
    });
    var retObject = new Object();
    retObject.mylist = rows;

    var sql_count = " select * from istamp_sum order by crdt_date desc LIMIT 1"  ; 
    console.log("sql_count:"+sql_count);
    let [row_count] = await global.mysqlPool.query(sql_count).catch((e) => {
      throw new Error('처리중 오류가 발생했습니다!');
      console.error(e);
    });
    retObject.total = row_count[0];
  
    //console.log("retObject:"+JSON.stringify(retObject))
    return res.render('stamory/home',{retObject:retObject, userObject:userObject}); 
  } catch (error) {
    // 예외가 발생했을 때 실행되는 코드
    console.error("An error occurred:", error.message);
    retObject.retcode = "fail"; 
    retObject.error = error; 
    return res.json(retObject);
  }    
};
exports.download = async (req, res, next) => {
  console.log("download start");
  var userObject = req.session.user;

  var istamp_list_seq = req.query.istamp_list_seq;

  var sql_select = "select *, ";
  sql_select +=" DATE_FORMAT(crdt_date, '%Y-%m-%d') AS formatted_date ";
  sql_select +="  from istamp_list where istamp_list_seq = "+istamp_list_seq;
  console.log("sql_select:"+sql_select);
  let [rows] = await global.mysqlPool.query(sql_select).catch((e) => {
    throw new Error('처리중 오류가 발생했습니다!');
    console.error(e);
  });
  var retObject = new Object();
  retObject.mylist = rows[0];

 return res.render('stamory/download',{retObject:retObject,userObject:userObject});    
};


exports.getAllChatDia = async (req, res, next) => {
  console.log("getAllChatDia start");

  if((req.session.user == null)||(req.session.user == 'undefined')){
    console.log("req.session.user  null");
    return res.redirect('/istamp/reloadwinodw');
    //return res.redirect('/istamp/login');
  }

  var retObject = new Object();
  var istamp_list_seq = req.query.istamp_list_seq;
  var member_id = req.session.user.member_id;
  var chatroom_seq = req.query.chatroom_seq;
  var maker = req.query.maker;
  var list_type = req.query.list_type;
  
//작성한 모든 글만 조회
  var sql_select = " SELECT comment, person1_id, person2_id, crdt_id,";
  sql_select += " DATE_FORMAT(crdt_date, '%p %l:%i') AS formatted_time "
  sql_select += " FROM userchat WHERE istamp_list_seq = '"+istamp_list_seq+"' ";
  sql_select += " and chatroom_seq= "+chatroom_seq+" "
 
  if(list_type =="ALL"){

  }else{
    sql_select += " and new_yn = 0 ";
  }
  sql_select += " order by crdt_date ";
  console.log("sql_select:"+sql_select);

  let [rows] = await global.mysqlPool.query(sql_select).catch((e) => {
    throw new Error('처리중 오류가 발생했습니다!');
    console.error(e);
  });

  var diatag ="";
  for(var i=0;i<rows.length;i++){
    var aaa ='';
    //대화창에 내가 창작자일 경우
    if((rows[i].crdt_id == member_id )){
      aaa = '<li class="mine">'
    }else{
      aaa = '<li>'      
      aaa += '<img src="/static/asset/images/test2.jpg">'
    }
    aaa +='		<p>'+rows[i].comment+'</p>'
    +'		<time>'+rows[i].formatted_time+'</time>'
    +'	</li>';
    diatag = diatag + aaa;
  }
  console.log("diatag:"+diatag);
  // 조회한 글 상태 업데이트
  var sql = " UPDATE userchat SET new_yn = 1 ";
  sql += " WHERE istamp_list_seq = '"+istamp_list_seq+"' ";
  sql += " and chatroom_seq= "+chatroom_seq+" "
  sql += " and new_yn = 0 ";//and person2_id= '"+member_id+"' ";
  let [rows1] = await global.mysqlPool.query(sql).catch((e) => {
    throw new Error('처리중 오류가 발생했습니다!');
    console.error(e);
  });

  return res.send(diatag);
};

exports.setDigData = async (req, res, next) => {
  console.log("setDigData start");
  var istamp_list_seq = req.query.istamp_list_seq;
  var content = req.query.content;
  var maker = req.query.maker;
  var chatroom_seq = req.query.chatroom_seq;
  var memeber_id = req.session.user.member_id;

  //작가가 답변을 기재할 경우 
  var person1_id = "";
  if( maker ==memeber_id){
    person1_id = memeber_id;
  }else{
    person1_id = "";
  }
 
  var sql = " INSERT INTO userchat (istamp_list_seq, chatroom_seq, person1_id,person2_id, comment, new_yn ,crdt_id,crdt_date ) ";
  sql += " values("+istamp_list_seq+","+chatroom_seq+", '"+person1_id+"','"+memeber_id+"','"+ content+"', 0 ,'"+memeber_id+"',sysdate() ) "; 
  let [rows1] = await global.mysqlPool.query(sql).catch((e) => {
    throw new Error('처리중 오류가 발생했습니다!');
    console.error(e);
  });

  return res.send("success");
};


exports.getAllSellChatDia = async (req, res, next) => {
  console.log("getAllSellChatDia start");

  if((req.session.user == null)||(req.session.user == 'undefined')){
    console.log("req.session.user  null");
    return res.redirect('/istamp/reloadwinodw');
    //return res.redirect('/istamp/login');
  }

  var retObject = new Object();
  var istamp_list_seq = req.query.istamp_list_seq;
  var member_id = req.session.user.member_id;
  var maker = req.query.maker;
  var list_type = req.query.list_type;
  var chatroom_seq = req.query.chatroom_seq;

//작성한 모든 글만 조회
  var sql_select = " SELECT comment, person1_id, person2_id,crdt_id, ";
  sql_select += " DATE_FORMAT(crdt_date, '%p %l:%i') AS formatted_time "
  sql_select += " FROM userchat WHERE istamp_list_seq = '"+istamp_list_seq+"' ";
  sql_select += " and chatroom_seq= '"+chatroom_seq+"' "

  if(list_type =="ALL"){

  }else{
    sql_select += " and new_yn = 0 ";
  }
  sql_select += " order by crdt_date ";
  console.log("sql_select:"+sql_select);

  let [rows] = await global.mysqlPool.query(sql_select).catch((e) => {
    throw new Error('처리중 오류가 발생했습니다!');
    console.error(e);
  });

  var diatag ="";
  for(var i=0;i<rows.length;i++){
    var aaa ='';
    //대화창에 내가 창작자일 경우
    console.log(rows[i].crdt_id + "/"+ member_id)
    if((rows[i].crdt_id == member_id)){
      aaa = '<li class="mine">'
    }else{
      aaa = '<li>'      
      aaa += '<img src="/static/asset/images/test2.jpg">'
    }
    aaa +='		<p>'+rows[i].comment+'</p>'
    +'		<time>'+rows[i].formatted_time+'</time>'
    +'	</li>';
    diatag = diatag + aaa;
  }
  console.log("diatag:"+diatag);
  // 조회한 글 상태 업데이트
  var sql = " UPDATE userchat SET new_yn = 1 ";
  sql += " WHERE istamp_list_seq = '"+istamp_list_seq+"' ";
  sql += " and chatroom_seq= '"+chatroom_seq+"' "
  sql += " and new_yn = 0 ";//and person2_id= '"+member_id+"' ";
  console.log("sql:"+sql);
  let [rows1] = await global.mysqlPool.query(sql).catch((e) => {
    throw new Error('처리중 오류가 발생했습니다!');
    console.error(e);
  });

  return res.send(diatag);
};

exports.setDigSellData = async (req, res, next) => {
  console.log("setDigSellData start");
  var istamp_list_seq = req.query.istamp_list_seq;
  var content = req.query.content;
  var maker = req.query.maker;
  var chatroom_seq = req.query.chatroom_seq;
  var memeber_id = req.session.user.member_id;
  

  //작가가 답변을 기재할 경우 
  var person1_id = "";
  if( maker ==memeber_id){
    person1_id = memeber_id;
  }else{
    person1_id = "";
  }
 
  var sql = " INSERT INTO userchat (istamp_list_seq, chatroom_seq,person1_id,person2_id, comment, new_yn ,crdt_id,crdt_date ) ";
  sql += " values("+istamp_list_seq+","+chatroom_seq+", '"+person1_id+"','"+memeber_id+"','"+ content+"', 0 ,'"+memeber_id+"',sysdate() ) "; 
  console.log("sql:"+sql)
  let [rows1] = await global.mysqlPool.query(sql).catch((e) => {
    throw new Error('처리중 오류가 발생했습니다!');
    console.error(e);
  });

  return res.send("success");
};
exports.edit = async (req, res, next) => {
  console.log("edit start");
 return res.render('stamory/edit');    
};
exports.index = async (req, res, next) => {
  console.log("index start");
  return res.render('stamory/index');    
};
exports.intro = async (req, res, next) => {
  console.log("intro start");
  return res.render('stamory/intro');    
};
exports.logout = async (req, res, next) => {
  console.log("logout start");
  req.session.destroy((err) => {
    if (err) {
        return res.status(500).send('Failed to destroy session.');
    }
    return res.redirect('/stamory/intro'); 
});
  
};


exports.my_chat = async (req, res, next) => {
  console.log("my_chat start");
  var userObject = req.session.user;
  var retObject = new Object();
  var istamp_list_seq = req.query.istamp_list_seq;
  var chatroom_seq = req.query.chatroom_seq;
  var member_id = req.session.user.member_id;

  console.log("istamp_list_seq:"+istamp_list_seq);
  console.log("chatroom_seq:"+chatroom_seq);

  try{  
    if((req.session.user == null)||(req.session.user == 'undefined')){
      console.log("req.session.user  null");
      return res.redirect('/istamp/reloadwinodw');
      //return res.redirect('/istamp/login');
    }
  
    var sql_select = " SELECT il.*, mm.member_pic, ";
    sql_select += " SUBSTRING_INDEX(mm.member_id, '@', 1) AS CRDT_ID, ";
    sql_select += " DATE_FORMAT(il.crdt_date, '%Y-%m-%d') AS formatted_date ";
    sql_select += " from  istamp_list AS il ";
    sql_select += " LEFT JOIN tbl_member AS mm ON il.crdt_id = mm.member_id ";
    sql_select += " WHERE il.istamp_list_seq = "+istamp_list_seq;
   
    console.log("sql_select:"+sql_select);
    let [rows] = await global.mysqlPool.query(sql_select).catch((e) => {
      throw new Error('처리중 오류가 발생했습니다!');
      console.error(e);
    });

    retObject.mylist = rows[0];
    var maker_id = rows[0].crdt_id;

    if(chatroom_seq == 0){
      var sql_insert = " INSERT INTO chatroom (istamp_list_seq, maker_id, buyer,crdt_date,crdt_id) ";
      sql_insert += " values("+istamp_list_seq+", '"+maker_id+"','"+ member_id+"',sysdate(),'"+member_id+"') ";
     
      console.log("sql_insert:"+sql_insert);
      let [result] = await global.mysqlPool.query(sql_insert).catch((e) => {
        throw new Error('처리중 오류가 발생했습니다!');
        console.error(e);
      });

      var sql_select = " select * from chatroom ";
      sql_select += " where istamp_list_seq = "+istamp_list_seq + " and maker_id = '"+maker_id+"'";
      sql_select += " and buyer ='"+member_id+"' ";
     
      console.log("sql_select:"+sql_select);
      let [rows1] = await global.mysqlPool.query(sql_select).catch((e) => {
        throw new Error('처리중 오류가 발생했습니다!');
        console.error(e);
      });    
      console.log("rows1[0].chatroom_seq:"+rows1[0].chatroom_seq);

      retObject.chatroom_seq = rows1[0].chatroom_seq;   
      return res.render('stamory/my_chat',{userObject:userObject,retObject:retObject });    

    }else{

      var sql_select = " SELECT uc.*, ";
      //sql_select += " SUBSTRING_INDEX(uc.member_id, '@', 1) AS CRDT_ID, ";
      sql_select += " DATE_FORMAT(uc.crdt_date, '%Y-%m-%d') AS formatted_date ";
      sql_select += " from  userchat AS uc ";
      sql_select += " WHERE uc.istamp_list_seq = "+istamp_list_seq;
      //sql_select += " and uc.person2_id = '"+member_id+"' order by uc.crdt_date desc ";
      sql_select += " and uc.chatroom_seq = '"+chatroom_seq+"' order by uc.crdt_date desc ";
    
      console.log("sql_select:"+sql_select);
      let [rows_chat] = await global.mysqlPool.query(sql_select).catch((e) => {
        throw new Error('처리중 오류가 발생했습니다!');
        console.error(e);
      });      
      
      retObject.mylist = rows[0];
      retObject.chatlist = rows_chat;
      retObject.chatroom_seq = chatroom_seq;   
      return res.render('stamory/my_chat',{userObject:userObject,retObject:retObject });    
    }  
    
  } catch (error) {
    // 예외가 발생했을 때 실행되는 코드
    console.error("An error occurred:", error.message);
    retObject.retcode = "fail"; 
    retObject.error = error; 
    return res.json(retObject);
  }   
};
exports.my_chat_sell = async (req, res, next) => {
  console.log("my_chat_sell start");
  var userObject = req.session.user;
  var retObject = new Object();
  var istamp_list_seq = req.query.istamp_list_seq;
  var chatroom_seq = req.query.chatroom_seq;
  var member_id = req.session.user.member_id;

  console.log("istamp_list_seq:"+istamp_list_seq);
  console.log("chatroom_seq:"+chatroom_seq);

  try{  
    if((req.session.user == null)||(req.session.user == 'undefined')){
      console.log("req.session.user  null");
      return res.redirect('/istamp/reloadwinodw');
      //return res.redirect('/istamp/login');
    }

    var userObject = req.session.user;
  
    var sql_select = " SELECT il.*, mm.member_pic, ";
    sql_select += " SUBSTRING_INDEX(mm.member_id, '@', 1) AS CRDT_ID, ";
    sql_select += " DATE_FORMAT(il.crdt_date, '%Y-%m-%d') AS formatted_date ";
    sql_select += " from  istamp_list AS il ";
    sql_select += " LEFT JOIN tbl_member AS mm ON il.crdt_id = mm.member_id ";
    sql_select += " WHERE il.istamp_list_seq = "+istamp_list_seq;
   
    console.log("sql_select:"+sql_select);
    let [rows] = await global.mysqlPool.query(sql_select).catch((e) => {
      throw new Error('처리중 오류가 발생했습니다!');
      console.error(e);
    });
    var retObject = new Object();
    retObject.mylist = rows[0];

    var sql_select = " SELECT uc.*, ";
    //sql_select += " SUBSTRING_INDEX(uc.member_id, '@', 1) AS CRDT_ID, ";
    sql_select += " DATE_FORMAT(uc.crdt_date, '%Y-%m-%d') AS formatted_date ";
    sql_select += " from  userchat AS uc ";
    sql_select += " WHERE uc.istamp_list_seq = "+istamp_list_seq;
    sql_select += " and uc.chatroom_seq = '"+chatroom_seq+"' order by uc.crdt_date desc ";
   
    console.log("sql_select:"+sql_select);
    let [rows_chat] = await global.mysqlPool.query(sql_select).catch((e) => {
      throw new Error('처리중 오류가 발생했습니다!');
      console.error(e);
    });
    var retObject = new Object();
    retObject.mylist = rows[0];
    retObject.chatlist = rows_chat;   
    retObject.chatroom_seq = chatroom_seq;     
  
    return res.render('stamory/my_chat_sell',{userObject:userObject,retObject:retObject });    
  } catch (error) {
    // 예외가 발생했을 때 실행되는 코드
    console.error("An error occurred:", error.message);
    retObject.retcode = "fail"; 
    retObject.error = error; 
    return res.json(retObject);
  }    

  
};

exports.my_chatroomlist = async (req, res, next) => {
  console.log("my_chatroomlist start");
  var userObject = req.session.user;
  var retObject = new Object();
  var istamp_list_seq = req.query.istamp_list_seq;
  var member_id = req.session.user.member_id;

  console.log("istamp_list_seq:"+istamp_list_seq);

  try{  
    if((req.session.user == null)||(req.session.user == 'undefined')){
      console.log("req.session.user  null");
      return res.redirect('/istamp/reloadwinodw');
      //return res.redirect('/istamp/login');
    }

    var userObject = req.session.user;
    var member_id = req.session.user.member_id;
  
    var sql_select = " SELECT il.*, mm.member_pic, ";
    sql_select += " SUBSTRING_INDEX(mm.member_id, '@', 1) AS CRDT_ID, ";
    sql_select += " DATE_FORMAT(il.crdt_date, '%Y-%m-%d') AS formatted_date ";
    sql_select += " from  istamp_list AS il ";
    sql_select += " LEFT JOIN tbl_member AS mm ON il.crdt_id = mm.member_id ";
    sql_select += " WHERE il.istamp_list_seq = "+istamp_list_seq;
   
    console.log("sql_select:"+sql_select);
    let [rows] = await global.mysqlPool.query(sql_select).catch((e) => {
      throw new Error('처리중 오류가 발생했습니다!');
      console.error(e);
    });
    var retObject = new Object();
    retObject.mylist = rows[0];

    var sql_select = " SELECT uc.*, ";
    sql_select += " (select member_pic from tbl_member where member_id = uc.buyer) as member_pic, ";
    sql_select += " (select member_nickname from tbl_member where member_id = uc.buyer) as member_nickname, ";
    sql_select += " DATE_FORMAT(uc.crdt_date, '%Y-%m-%d') AS formatted_date ";
    sql_select += " from  chatroom AS uc ";
    sql_select += " WHERE uc.istamp_list_seq = "+istamp_list_seq;
    sql_select += " order by uc.crdt_date desc ";
   
    console.log("sql_select:"+sql_select);
    let [rows_chat] = await global.mysqlPool.query(sql_select).catch((e) => {
      throw new Error('처리중 오류가 발생했습니다!');
      console.error(e);
    });
    var retObject = new Object();
    retObject.mylist = rows[0];
    retObject.chatroomlist = rows_chat;
    
  
    return res.render('stamory/my_chatroomlist',{userObject:userObject,retObject:retObject });    
  } catch (error) {
    // 예외가 발생했을 때 실행되는 코드
    console.error("An error occurred:", error.message);
    retObject.retcode = "fail"; 
    retObject.error = error; 
    return res.json(retObject);
  }    

  
};

exports.my_comment = async (req, res, next) => {
  console.log("my_comment start");  
  var target_istamp_list_seq = req.query.istamp_list_seq;
  var retObject = new Object();
  try{  
    if((req.session.user == null)||(req.session.user == 'undefined')){
      console.log("req.session.user  null");
      return res.redirect('/istamp/reloadwinodw');
      //return res.redirect('/istamp/login');
    }

    var userObject = req.session.user;
    var member_id = req.session.user.member_id;
  
    var sql_select = " SELECT a.*,  IFNULL(cr.chatroom_seq,0) as chatroom_seq, ";
    sql_select += " SUBSTRING_INDEX(a.crdt_id, '@', 1) AS CRDT_ID, ";
    sql_select += " (select member_pic from tbl_member where member_id = a.crdt_id) as member_pic, ";
    sql_select += " DATE_FORMAT(a.crdt_date, '%Y-%m-%d') AS formatted_date ,";
    sql_select += " CASE WHEN a.crdt_date >= DATE_SUB(CURDATE(), INTERVAL 1 DAY) THEN 'NEW' ";
    sql_select += "       ELSE ''     END AS NEW_DATE ";
    sql_select += "  FROM ";
    sql_select += "  istamp_list a";
    sql_select += "  LEFT JOIN    tbl_istam_claim cl  ON a.istamp_list_seq = cl.istam_list_seq and cl.type = 2 and cl.claim_member_id='"+member_id+"' ";
    sql_select += "  LEFT JOIN    chatroom cr  ON cr.istamp_list_seq = a.istamp_list_seq and cr.maker_id = a.crdt_id and cr.buyer='"+member_id+"' ";
    
    sql_select += "  WHERE cl.istam_claim_seq IS NULL  AND a.metadata_url IS NOT NULL   AND a.open = 1   AND a.block_view = 0  ";
    sql_select += "  order by a.crdt_date desc LIMIT 0, 30";

    console.log("sql_select:"+sql_select);
    let [rows] = await global.mysqlPool.query(sql_select).catch((e) => {
      throw new Error('처리중 오류가 발생했습니다!');
      console.error(e);
    });
    var retObject = new Object();
    retObject.mylist = rows;
  
    //console.log("retObject:"+JSON.stringify(retObject))
    return res.render('stamory/my_comment',{retObject:retObject, userObject:userObject,target_istamp_list_seq:target_istamp_list_seq}); 
  } catch (error) {
    // 예외가 발생했을 때 실행되는 코드
    console.error("An error occurred:", error.message);
    retObject.retcode = "fail"; 
    retObject.error = error; 
    return res.json(retObject);
  }    
};
exports.my_istam_comment = async (req, res, next) => {
  console.log("my_istam_comment start");
  
  var target_istamp_list_seq = req.query.istamp_list_seq;
  var member_id = req.session.user.member_id;

  var retObject = new Object();
  try{  
    if((req.session.user == null)||(req.session.user == 'undefined')){
      console.log("req.session.user  null");
      return res.redirect('/istamp/reloadwinodw');
      //return res.redirect('/istamp/login');
    }

    var userObject = req.session.user;

    var sql_select = " SELECT a.*,  IFNULL(cr.chatroom_seq,0) as chatroom_seq, ";
    sql_select += " SUBSTRING_INDEX(a.crdt_id, '@', 1) AS CRDT_ID, ";
    sql_select += " (select member_pic from tbl_member where member_id = a.crdt_id) as member_pic, ";
    sql_select += " DATE_FORMAT(a.crdt_date, '%Y-%m-%d') AS formatted_date ,";
    sql_select += " CASE WHEN a.crdt_date >= DATE_SUB(CURDATE(), INTERVAL 1 DAY) THEN 'NEW' ";
    sql_select += "       ELSE ''     END AS NEW_DATE ";
    sql_select += "  FROM ";
    sql_select += "  istamp_list a";
    sql_select += "  LEFT JOIN    tbl_istam_claim cl  ON a.istamp_list_seq = cl.istam_list_seq and cl.type = 2 and cl.claim_member_id='"+member_id+"' ";
    sql_select += "  LEFT JOIN    chatroom cr  ON cr.istamp_list_seq = a.istamp_list_seq and cr.maker_id = a.crdt_id and cr.buyer='"+member_id+"' ";
    sql_select += "  WHERE cl.istam_claim_seq IS NULL  ";
    sql_select += "  AND a.crdt_id ='"+member_id+"' ";
    sql_select += "  order by a.crdt_date desc LIMIT 0, 30";

    console.log("sql_select:"+sql_select);
    let [rows] = await global.mysqlPool.query(sql_select).catch((e) => {
      throw new Error('처리중 오류가 발생했습니다!');
      console.error(e);
    });
    var retObject = new Object();
    retObject.mylist = rows;
  
    //console.log("retObject:"+JSON.stringify(retObject))
    return res.render('stamory/my_istam_comment',{retObject:retObject, userObject:userObject,target_istamp_list_seq:target_istamp_list_seq}); 
  } catch (error) {
    // 예외가 발생했을 때 실행되는 코드
    console.error("An error occurred:", error.message);
    retObject.retcode = "fail"; 
    retObject.error = error; 
    return res.json(retObject);
  }    
};

exports.my_main = async (req, res, next) => {
  console.log("my_main start");
  var userObject = req.session.user;

  try{  
    if((req.session.user == null)||(req.session.user == 'undefined')){
      console.log("req.session.user  null");
      return res.redirect('/istamp/reloadwinodw');
      //return res.redirect('/istamp/login');
    }
    var member_id = req.session.user.member_id;
  
    var sql_select = " SELECT a.*, ";
    sql_select += " DATE_FORMAT(a.crdt_date, '%Y-%m-%d') AS formatted_date ,";
    sql_select += " CASE WHEN a.crdt_date >= DATE_SUB(CURDATE(), INTERVAL 1 DAY) THEN 'NEW' ";
    sql_select += "       ELSE ''     END AS NEW_DATE ";
    sql_select += "  FROM ";
    sql_select += "  istamp_list a";
    sql_select += "  LEFT JOIN    tbl_istam_claim cl  ON a.istamp_list_seq = cl.istam_list_seq and cl.type = 2 and cl.claim_member_id='"+member_id+"' ";
    sql_select += "  WHERE cl.istam_claim_seq IS NULL  AND a.crdt_id ='"+member_id+"' ";
    sql_select += "  order by a.crdt_date desc LIMIT 0, 30";

    console.log("sql_select:"+sql_select);
    let [rows] = await global.mysqlPool.query(sql_select).catch((e) => {
      throw new Error('처리중 오류가 발생했습니다!');
      console.error(e);
    });
    var retObject = new Object();
    retObject.mylist = rows;

    if(rows.length < 1){
      return res.redirect("/stamory/home");
    }

    //console.log("retObject:"+JSON.stringify(retObject))
    return res.render('stamory/my_main',{retObject:retObject, userObject:userObject}); 
  } catch (error) {
    // 예외가 발생했을 때 실행되는 코드
    console.error("An error occurred:", error.message);
    retObject.retcode = "fail"; 
    retObject.error = error; 
    return res.json(retObject);
  }    
};

exports.my_more = async (req, res, next) => {
  console.log("my_more start");

   
  try{

    if((req.session.user == null)||(req.session.user == 'undefined')){
      return res.redirect('/stamory/reloadwinodw');
      //return res.redirect('/istamp/login');
    }
    
    var userObject = req.session.user;
    var istamp_list_seq = req.query.istamp_list_seq;    
  
    var imgInfo = new Object();
    imgInfo.istamp_list_seq= istamp_list_seq;

    var sql ="select iq.* , ";
    sql += " DATE_FORMAT(iq.crdt_date, '%Y-%m-%d') AS formatted_date ";
    sql +=" from istamp_list as iq where iq.istamp_list_seq = "+istamp_list_seq; 
    console.log("sql:"+sql);
    let [rows] = await global.mysqlPool.query(sql).catch((e) => {
      throw new Error('처리중 오류가 발생했습니다!');
      console.error(e);
    });

    imgInfo.info = rows[0];
    imgInfo.crdt_yn = false;
    if(imgInfo.info.crdt_id == userObject.member_id){
      imgInfo.crdt_yn = true;
    }

  //  console.log("imgInfo:"+JSON.stringify(imgInfo));
  //  console.log("req.session.user:"+JSON.stringify(req.session.user));
    
    var retHtmlObject = new Object();
  // URL을 설정합니다.
  const polygonurl = 'https://polygonscan.com/tx/'+rows[0].metadata_url;

    axios.get(polygonurl)
    .then(response => {
      // HTML을 로드합니다.
      const html = response.data;
      const $ = cheerio.load(html);    
      const element = $(`#${"showUtcLocalDate"}`);   
  
      if (element.length > 0) {
        // 추출한 요소의 텍스트 내용을 출력합니다.
        //console.log(`Text content of #${"showUtcLocalDate"}: ${element.text()}`);
        const extractedText = $('.col-md-9 .d-flex .d-flex a').text();
        //console.log(`extractedText:`+extractedText);
        retHtmlObject.date = element.text();    
        const match = extractedText.match(/^\d+/);
        if (match) {       
          retHtmlObject.blockno = match[0];;  
        }

      } else {
        console.log(`Element with ID  not found.`);        
      }

      return res.render('stamory/my_more', {userObject:userObject,imgInfo:imgInfo,retHtmlObject:retHtmlObject});    
    })
    .catch(error => {
      console.error(`Error fetching the URL: ${error}`);
    });
  } catch (error) {
    console.log(error)
    return res.redirect('/stamory/home'); 

  }   
};

exports.my_reservation = async (req, res, next) => {
  console.log("my_reservation start");
  return res.render('stamory/my_reservation');    
};

exports.order = async (req, res, next) => {
  console.log("order start");
  return res.render('stamory/order');    
};
exports.profile_01 = async (req, res, next) => {
  console.log("profile_01 start");
  var member_nickname = req.session.user.member_nickname;

 return res.render('stamory/profile_01',{member_nickname:member_nickname});    
};
exports.profile_02 = async (req, res, next) => {
  console.log("profile_02 start");
  var member_nickname = req.session.user.member_nickname;
  var member_pic = req.session.user.member_pic;
  
 return res.render('stamory/profile_02',{member_nickname:member_nickname,member_pic:member_pic});    
};


exports.email_login = async (req, res, next) => {
  console.log("email_login start");
 return res.render('stamory/email_login');    
};
exports.register_01 = async (req, res, next) => {
  console.log("register_01 start");
 return res.render('stamory/register_01');    
};
exports.register_02 = async (req, res, next) => {
  console.log("register_02 start");
 return res.render('stamory/register_02');    
};
exports.register_03 = async (req, res, next) => {
  console.log("register_03 start");
  var email =  req.query.email;

 return res.render('stamory/register_03',{email:email});    
};



exports.checktempcode = async (req, res, next) => {
  console.log("checktempcode start");
  try{

    var email = req.body.email;
    var tempcode = req.body.tempcode;
    var retObject =  new Object();

    var sql ="select * from tbl_member_reg_temp "
    sql += " where email = '"+email+"' and temp_code ='"+tempcode+"'"
    sql +=" and  crdt_date >= NOW() - INTERVAL 5 MINUTE ";
    console.log('sql:'+sql);
     
    let [rows] = await global.mysqlPool.query(sql).catch((e) => {
        console.error(e);
        retObject.retcode = "fail";           
        return res.json(retObject);
    });

    if(rows.length > 0){
      retObject.ret = "success";
    }else{
      retObject.ret = "fail";
    }   

    return res.send(retObject)

  }catch (error) {
    // 예외가 발생했을 때 실행되는 코드
    console.error("An error occurred:", error.message);
    retObject.ret = "fail"; 
    return res.json(retObject);   
  } 
};

exports.register_04 = async (req, res, next) => {
  console.log("register_04 start");
  var email =  req.query.email;

 return res.render('stamory/register_04',{email:email});    
};
/**
 * 회원등록
 * @param {} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.regmember = async (req, res, next) => {
  console.log("regmember start");

  try{
    var email = req.body.email;
    var pwd = req.body.pwd;
    var retObject  = new Object(); 
    pwd = crypto.createHash('sha256').update(pwd).digest('hex');
    console.log('pwd: ' + pwd);

    //1. 이미 등록된 사용자가 있는 지 여부를 확인함
    var sql00 = "select count(*) as cnt from tbl_member where member_id = '"+email+"'";
    console.log('sql:'+sql00);
    
    let [rows00] = await global.mysqlPool.query(sql00).catch((e) => {
        console.error(e);    
        retObject.ret = "fail";
        return res.json(retObject);
    });

    if(rows00[0].cnt > 0){
      retObject.ret = "fail";
      return res.json(retObject);

    }else{
        //2. 사용자 등록 확인함
        var sql = "INSERT INTO tbl_member (member_id,member_email, member_pwd,status, crdt_date , crdt_id) " ;
        sql += " values('"+email+"','"+email+"','"+pwd+"',1,sysdate(),'"+email+"')";
        console.log('sql:'+sql);
        
        let [rows0] = await global.mysqlPool.query(sql).catch((e) => {
            console.error(e);    
            retObject.ret = "fail";
            return res.json(retObject);
        });

        //회원정보 
            //var subQuary = " where member_id='"+email+"' and member_pwd = '"+pwd+"'";  
            var subQuary = " where member_id='"+email+"'  and status = 1 ";  
            sql = "SELECT * ";
            sql +=" FROM tbl_member as a ";
            sql += subQuary;
            sql+= " order by crdt_date";
            console.log('sql:'+sql);

            
            let [rows] = await global.mysqlPool.query(sql).catch((e) => {
                console.error(e);       
                return res.json(retObject);
            });

            if(rows.length == 1){
              var member_email_ck = false;
              var member_mobile_ck = false;
              var member_email = "";
              var member_mobile = "";
            
              if((rows[0].member_email == '')||(rows[0].member_email == null)||(rows[0].member_email == 'null')||(rows[0].member_email == 'undefinded')){
              }else{
                if((rows[0].member_email.length) > 5){
                  member_email_ck = true;
                  member_email = rows[0].member_email;
                }
              
              }      
              if((rows[0].member_mobile == '')||(rows[0].member_mobile == null)||(rows[0].member_email == 'null')||(rows[0].member_mobile == 'undefinded')){
              }else{
                if((rows[0].member_mobile.length) > 5){
                  member_mobile_ck = true;
                  member_mobile = rows[0].member_mobile;
                }
              }

              console.log("member_mobile_ck:"+member_mobile_ck);
              console.log("member_email_ck:"+member_email_ck);
                //로그인 성공한 경우
                req.session.user = {
                  member_email: member_email,
                  member_email_ck: member_email_ck,
                  member_mobile_ck: member_mobile_ck,
                  member_seq: rows[0].member_seq,
                  member_id: rows[0].member_id,
                  member_id: rows[0].member_id,
                  member_location: rows[0].member_location,
                  member_gubun: rows[0].member_gubun,
                  member_mobile:member_mobile,                  
                  member_name:rows[0].member_name,
                  token_id:rows[0].token_id,
                  member_token:rows[0].member_token,
                  mileage:rows[0].mileage,
                  area: rows[0].area2,
                  first_login:true,
                  authorized: true
              };

            var userObject = req.session.user;

            //회원가입마일리지 적립
            await addMileage(userObject.member_id, MEMBER_REG_TRANS_TYPE);

            retObject.ret = "success";
            return res.json(retObject);
          }  
        }
      }catch (error) {
        console.log(error)
        retObject.ret = "fail";
        return res.json(retObject);
      }
  
};

exports.register_05 = async (req, res, next) => {
  console.log("register_05 start");
  var email =  req.query.email;
 return res.render('stamory/register_05',{ email:email});    
};
exports.tutorial = async (req, res, next) => {
  console.log("tutorial start");
 return res.render('stamory/tutorial');    
};
exports.upload_ui = async (req, res, next) => {
  console.log("upload_ui start");
 return res.render('stamory/upload_ui');    
};

exports.upload = async (req, res, next) => {
  console.log("upload start");
 return res.render('stamory/upload');    
};
exports.upload_intro = async (req, res, next) => {
  console.log("upload_intro start");
 return res.render('stamory/upload_intro');    
};

exports.reloadwinodw = async (req, res, next) => { 
  var userObject = req.session.user;  
  console.log("reloadwinodw start");

 return res.render('istamp/reloadwinodw')
};

exports.getReply = async (req, res, next) => {
  console.log("getReply start");
  try{
    var istamp_list_seq = req.body.istamp_list_seq;
    var retObject =  new Object();


    var sql ="select iq.* , "
    //sql += " CASE WHEN iq.istamp_friend_id = '"+member_id+"' THEN 'Y'  ELSE 'N' END AS target_user , "
    sql += " (select member_nickname from tbl_member where member_id = iq.crdt_id) AS member_nickname, ";
    sql += " DATEDIFF(NOW(), iq.crdt_date) AS days_difference, ";
    sql += " DATE_FORMAT(iq.crdt_date, '%Y-%m-%d') AS formatted_date ";
    sql +=" from istamp_request as iq where iq.istamp_list_seq = "+istamp_list_seq+" order by iq.crdt_date desc " 
    console.log('sql:'+sql);
     
    let [rows] = await global.mysqlPool.query(sql).catch((e) => {
        console.error(e);
        retObject.retcode = "fail";           
        return res.json(retObject);
    });

    var reply_str = "";
    reply_str = '<div class="comment-box"  >';
    for(var i =0;i<rows.length;i++){
      var aaa = '<ul>'
						+'<li class="on">'
							+'		<div class="list-image">'
							+'			<img src="/static/asset/images/test1.jpg">'
									+'			</div>'
								+'	<div class="list-content">'
								+'		<div>'
							+'				<b>'+rows[i].member_nickname+'</b>'
								+'			<time>'+rows[i].days_difference+'일</time>'
							+'			</div>'
							+'			<p>'+rows[i].istamp_friend_message+'</p>'
							//+'			<a href="">reply</a>'
							+'		</div>'
						+'			<div class="list-like">'
						+'				<a href="javascript:setlike('+rows[i].istamp_request_seq+')"><p id="like_'+rows[i].istamp_request_seq+'">'+rows[i].like_cnt+'</p></a>'
						+'			</div>'
						+'		</li>'
							
						+'	</ul>';

            reply_str += aaa;
    }
    reply_str += '					</div>'
					+'	<div class="reply-box">'
          /*
						+'	<div class="reply-head">'
							+'	<ul>'
							+'		<li><a href="">😀</a></li>'
							+'		<li><a href="">😁</a></li>'
							+'		<li><a href="">😂</a></li>'
							+'		<li><a href="">🤣</a></li>'
							+'		<li><a href="">😃</a></li>'
							+'		<li><a href="">😄</a></li>'
							+'		<li><a href="">😅</a></li>'
							+'		<li><a href="">😆</a></li>'
							+'		<li><a href="">😉</a></li>'
							+'		<li><a href="">😊</a></li>'
							+'		<li><a href="">😋</a></li>'
						+'		</ul>'
					+'		</div>'
          */
					+'		<div class="reply-body">'
					+'			<img src="/static/asset/images/test1.jpg">'
					+'			<div>'
					+'				<textarea placeholder="Add a comment to the creator" rows="1" id="textcomment"></textarea>'
					+'				<a href="javascript:writeComments('+istamp_list_seq+')" >더보기</a>'
					+'			</div>'
					+'		</div>'
				+'		</div>'
   // retObject.rows = rows;
    retObject.data = decodeURIComponent(reply_str);
    //console.log(JSON.stringify(retObject));
    //return res.json(retObject);
    res.send(retObject.data)

  }catch (error) {
    // 예외가 발생했을 때 실행되는 코드
    console.error("An error occurred:", error.message);
    retObject.ret = "fail"; 
    return res.json(retObject);   
  } 
};

exports.setlike = async (req, res, next) => {
  console.log("setlike start");
  try{
    var istamp_request_seq = req.body.istamp_request_seq;
    var retObject =  new Object();

    var sql ="update istamp_request set  like_cnt = like_cnt+ 1 "
    sql +=" where  istamp_request_seq = "+istamp_request_seq; 
    console.log('sql:'+sql);
     
    let [rows] = await global.mysqlPool.query(sql).catch((e) => {
        console.error(e);
        retObject.retcode = "fail";           
        return res.json(retObject);
    });
    retObject.ret = "success";

    return res.send(retObject)

  }catch (error) {
    // 예외가 발생했을 때 실행되는 코드
    console.error("An error occurred:", error.message);
    retObject.ret = "fail"; 
    return res.json(retObject);   
  } 
};
exports.setlikeSTAM = async (req, res, next) => {
  console.log("setlikeSTAM start");
  try{
    var istamp_list_seq = req.body.istamp_list_seq;
    var member_seq = req.session.user.member_seq;
    var retObject =  new Object();

    var sql ="update istamp_list set  like_cnt = like_cnt+ 1 "
    sql +=" where  istamp_list_seq = "+istamp_list_seq; 
    console.log('sql:'+sql);
     
    let [rows] = await global.mysqlPool.query(sql).catch((e) => {
        console.error(e);
        retObject.retcode = "fail";
        return res.json(retObject);
    });
    retObject.ret = "success";

    return res.send(retObject)

  }catch (error) {
    // 예외가 발생했을 때 실행되는 코드
    console.error("An error occurred:", error.message);
    retObject.ret = "fail"; 
    return res.json(retObject);   
  } 
};
exports.writeComments = async (req, res, next) => {
  console.log("writeComments start");
  try{
    var textcomment = req.body.textcomment;
    var retObject =  new Object();
    var member_id = req.session.user.member_id;
    var istamp_list_seq = req.body.istamp_list_seq;

    var sql = " insert into istamp_request ";
    sql += " ( istamp_list_seq, istamp_friend_id, istamp_friend_message,istamp_crdt_id, status, crdt_date,crdt_id) ";            
    sql += " values("+istamp_list_seq+","
    sql += " '"+member_id+"', '"+textcomment+"',";  
    sql += "'"+member_id+"',0,sysdate(), ";
    sql += " '"+member_id+"')";

    console.log('sql:'+sql);
     
    let [rows] = await global.mysqlPool.query(sql).catch((e) => {
        console.error(e);
        retObject.retcode = "fail";           
        return res.json(retObject);
    });
    retObject.ret = "success";

    return res.send(retObject)

  }catch (error) {
    // 예외가 발생했을 때 실행되는 코드
    console.error("An error occurred:", error.message);
    retObject.ret = "fail"; 
    return res.json(retObject);   
  } 
};


exports.updatemember_nickname = async (req, res, next) => {
  console.log("updatemember_nickname start");
  try{
    var member_nickname = req.body.member_nickname;

    var member_id = req.session.user.member_id;
    var retObject =  new Object();

    var sql = "update tbl_member ";
    sql += " set member_nickname = '"+member_nickname+"'  ";            
    sql += " where member_id = '"+member_id+"'"

    console.log('sql:'+sql);
     
    let [rows] = await global.mysqlPool.query(sql).catch((e) => {
        console.error(e);
        retObject.retcode = "fail";           
        return res.json(retObject);
    });
    retObject.ret = "success";

    return res.send(retObject)

  }catch (error) {
    // 예외가 발생했을 때 실행되는 코드
    console.error("An error occurred:", error.message);
    retObject.ret = "fail"; 
    return res.json(retObject);   
  } 
};


exports.checkLogIn_istam = async (req, res, next) => {
  console.log("checkLogIn_istam start");
  try{
    var email = req.body.email;
    var pwd = req.body.pwd;
    var member_id = email;

    var retObject = new Object();
    
    console.log("body:"+ JSON.stringify(req.body)+ "email:"+email+" pwd:"+pwd);
    pwd = crypto.createHash('sha256').update(pwd).digest('hex');
    console.log('pwd: ' + pwd);

     //회원정보 
     var subQuary = "";
     if((member_id == '')||(member_id == null)||(member_id == 'undefinded')){
       //애플일경우 토큰으로 조회
       subQuary = " where token_id='"+idToken+"'  and status = 1 ";  
     }else{
       //안드로이드일경우 id 로 조회
       subQuary = " where member_id='"+member_id+"' and member_pwd ='"+pwd+"' and status = 1 ";          
     }

    let sql = "SELECT * ";
    sql +=" FROM tbl_member ";
    sql += subQuary;
    sql+= " order by crdt_date";
    console.log('sql:'+sql);
     
    let [rows] = await global.mysqlPool.query(sql).catch((e) => {
        console.error(e);
        retObject.retcode = "fail";           
        return res.json(retObject);
    });

    console.log("rows[0].member_email:"+rows[0].member_email);
    console.log("rows[0].member_mobile:"+rows[0].member_mobile);
    if(rows.length == 1){
      var member_email_ck = false;
      var member_mobile_ck = false;
      var member_email = "";
      var member_mobile = "";
     
      if((rows[0].member_email == '')||(rows[0].member_email == null)||(rows[0].member_email == 'null')||(rows[0].member_email == 'undefinded')){
      }else{
        if((rows[0].member_email.length) > 5){
          member_email_ck = true;
          member_email = rows[0].member_email;
        }
       
      }      
      if((rows[0].member_mobile == '')||(rows[0].member_mobile == null)||(rows[0].member_email == 'null')||(rows[0].member_mobile == 'undefinded')){
      }else{
        if((rows[0].member_mobile.length) > 5){
          member_mobile_ck = true;
          member_mobile = rows[0].member_mobile;
        }
      }

      console.log("member_mobile_ck:"+member_mobile_ck);
    console.log("member_email_ck:"+member_email_ck);
      //로그인 성공한 경우
      req.session.user = {
        member_email: member_email,
        member_email_ck: member_email_ck,
        member_mobile_ck: member_mobile_ck,
        member_seq: rows[0].member_seq,
        member_id: rows[0].member_id,
        member_nickname: rows[0].member_nickname,
        member_location: rows[0].member_location,
        member_gubun: rows[0].member_gubun,
        member_mobile:member_mobile,                  
        member_name:rows[0].member_name,
        member_pic:rows[0].member_pic,
        token_id:rows[0].token_id,
        member_token:rows[0].member_token,
        mileage:rows[0].mileage,        
        first_login:true,
        authorized: true
    };
    console.log("req.session.user.member_id:"+req.session.user.member_id);

    retObject.ret = "success"; 
    return res.json(retObject);    
  }else {
    retObject.ret = "fail"; 
    return res.json(retObject);   
  }
} catch (error) {
  // 예외가 발생했을 때 실행되는 코드
  console.error("An error occurred:", error.message);
  retObject.ret = "fail"; 
  return res.json(retObject);   
} 
};


exports.member_reg_email_contents = async (req, res, next) => {
  console.log("email_contents start");
  var retObject = new Object();
  
  var to_email = req.query.email;
  //var email_subject = req.query.email_subject;
  //var email_contents = req.query.email_contents;
  console.log("req.query:"+JSON.stringify(req.query));


  var sql = " select * from  tbl_member where member_id = '"+to_email+"'";

    console.log('sql:'+sql);
     
    let [rows] = await global.mysqlPool.query(sql).catch((e) => {
        console.error(e);
        retObject.retcode = "fail";           
        return res.json(retObject);
    });

    if(rows.length > 0){
      console.log("동일한 이메일 존재");
      retObject.retcode = "duplicateEmail";           
      return res.json(retObject);
    }


  try{

     // SMTP 서버 설정
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'khkim@eterners.com', // 당신의 이메일 주소
           //pass: 'twsz rpzg wvnw vmgz'   // 당신의 이메일 비밀번호 (또는 앱 비밀번호)
          //pass:'clat hqdj hldf ijka'
          pass:'rvjh uyoy qycg kqeq'          
      }
    });

    var temp_code = generateHexCode();
    var sql = " insert into tbl_member_reg_temp ";
    sql += " ( email, temp_code, crdt_date) ";            
    sql += " values('"+to_email+"',"
    sql += " '"+temp_code+"', sysdate())";
    sql += " ON DUPLICATE KEY UPDATE ";
    sql += " temp_code = VALUES(temp_code), ";
    sql += " crdt_date = VALUES(crdt_date) ";

    console.log('sql:'+sql);
     
    let [rows] = await global.mysqlPool.query(sql).catch((e) => {
        console.error(e);
        retObject.retcode = "fail";           
        return res.json(retObject);
    });

    var email_contents = "member register code : " + temp_code + "<br>"
    email_contents += "you can fill the app within 5 seconds"
    var email_subject = "[istamp]member resiater code"

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
  } catch (error) {
    // 예외가 발생했을 때 실행되는 코드
    console.error("An error occurred:", error.message);
    retObject.retcode = "fail"; 
    return res.json(retObject);   
  } 


  retObject.retcode = "success";
  return res.json(retObject);    
};
function generateHexCode() {
  // Math.random()으로 0부터 16777215 (0xFFFFFF) 사이의 숫자를 생성하고 16진수로 변환
  let hexCode = Math.floor(Math.random() * 0xFFFFFF).toString(16);

  // 6자리가 아닌 경우, 0으로 패딩하여 6자리로 맞춤
  return hexCode.padStart(6, '0');
}

async function getRequestList(istamp_list_seq,member_id) {
  try {
      var sql ="select iq.* , "
      sql += " CASE WHEN iq.istamp_friend_id = '"+member_id+"' THEN 'Y'  ELSE 'N' END AS target_user , "
      sql += " DATE_FORMAT(iq.crdt_date, '%Y-%m-%d') AS formatted_date ";
      sql +=" from istamp_request as iq where iq.istamp_list_seq = "+istamp_list_seq+" order by iq.status" 

    let rows = await global.mysqlPool.query(sql);
    console.log("sql:"+sql);
    return rows[0];
    // Process rows here
  } catch (error) {
      console.error(error);
      return "DB Error"; // Or handle the error in another appropriate way
  }
}


async function addMileage(member_id,  TRANS_TYPE){  
  var sql_insert ="insert tbl_mileage_log (member_id, trans_date, trans_type, amount, crdt_id, crdt_date) ";
  sql_insert += " values ('"+member_id+"',(DATE_FORMAT(CURDATE(), '%Y%m%d')),"+TRANS_TYPE+",";
   sql_insert += " (select amount from tbl_cd_val where cd_type = "+TRANS_TYPE+" and cd_id = 'MILEAGE_TYPE') ,"
   sql_insert += " '"+member_id+"',sysdate())";
  console.log("sql_insert:"+sql_insert);
  let [row_insert] = await global.mysqlPool.query(sql_insert).catch((e) => {        
    return false;
  });

  var sql ="update tbl_member set mileage = mileage + (select amount from tbl_cd_val where cd_type = "+TRANS_TYPE+" and cd_id = 'MILEAGE_TYPE')";
  sql += " where member_id = '"+member_id +"'";
  console.log("sql:"+sql);
  let [rows] = await global.mysqlPool.query(sql).catch((e) => {        
    return false;
  });

  return true;
}



// Google OAuth2 Client 설정
const client = new OAuth2Client({
  clientId: 'YOUR_GOOGLE_CLIENT_ID',
  clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
  redirectUri: 'http://localhost:3000/oauth2callback', // 서버의 콜백 URL
});


exports.googlelogin = async (req, res, next) => {
  console.log("googlelogin start");
  const url = client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
});
res.redirect(url);
 
};

exports.google_login = async (req, res, next) => {
  console.log("google_login start");

  return res.render("stamory/google_login");
};




exports.afterGooglelogin = async (req, res, next) => {
  console.log("afterGooglelogin start");
  console.log("req.body:"+JSON.stringify(req.body));

  try{
      
    var member_id = req.query.member_id;
    var member_pic = req.query.photoUrl;
    var displayName = req.query.displayName;  
    //var member_mobile = req.query.member_mobile;
    var member_token = req.query.member_token;
    var idToken = req.query.idToken;
    var phoneNumber = req.query.phoneNumber;
    var device_type  = req.query.device_type;

     //회원정보가 있는 지여부를 확인
     var subQuary1 = "";
     if((member_id == '')||(member_id == null)||(member_id == 'undefinded')){
       //애플일경우 토큰으로 조회
       subQuary1 = " where token_id='"+idToken+"'  and status = 1 ";  
     }else{
       //안드로이드일경우 id 로 조회
       subQuary1 = " where member_id='"+member_id+"'  and status = 1 ";          
     }
     var sql1 = "SELECT * ";
     sql1 +=" FROM tbl_member as a ";
     sql1 += subQuary1;
     sql1+= " order by crdt_date";
     console.log('sql1:'+sql1);

     var retObject  = new Object();  
     let [rows1] = await global.mysqlPool.query(sql1).catch((e) => {
         console.error(e);
         retObject.retcode = "fail";           
         return res.json(retObject);
     });
  
      if(rows1.length == 1){
        var member_email_ck = false;
            var member_mobile_ck = false;
            var member_email = "";
            var member_mobile = "";
          
            if((rows1[0].member_email == '')||(rows1[0].member_email == null)||(rows1[0].member_email == 'null')||(rows1[0].member_email == 'undefinded')){
            }else{
              if((rows1[0].member_email.length) > 5){
                member_email_ck = true;
                member_email = rows1[0].member_email;
              }
            
            }      
            if((rows1[0].member_mobile == '')||(rows1[0].member_mobile == null)||(rows1[0].member_email == 'null')||(rows1[0].member_mobile == 'undefinded')){
            }else{
              if((rows1[0].member_mobile.length) > 5){
                member_mobile_ck = true;
                member_mobile = rows1[0].member_mobile;
              }
            }

              console.log("member_mobile_ck:"+member_mobile_ck);
            console.log("member_email_ck:"+member_email_ck);
              //로그인 성공한 경우
              req.session.user = {
                member_email: member_email,
                member_email_ck: member_email_ck,
                member_mobile_ck: member_mobile_ck,
                member_seq: rows1[0].member_seq,
                member_id: rows1[0].member_id,
                member_id: rows1[0].member_id,
                member_location: rows1[0].member_location,
                member_gubun: rows1[0].member_gubun,
                member_mobile:member_mobile,                  
                member_name:rows1[0].member_name,
                token_id:rows1[0].token_id,
                member_token:rows1[0].member_token,
                mileage:rows1[0].mileage,
                area: rows1[0].area2,
                first_login:true,
                authorized: true
            };
            console.log("session crete : "+ JSON.stringify(req.session.user))
      }else{       
//회원정보가 없는 경우 신규회원으로 등록후 마일리지 적립

        //회원여부 입력
        var sql = "";
        if((member_id == '')||(member_id == null)||(member_id == 'undefinded')){
          //애플일경우 토큰으로 저장
          sql = " INSERT INTO tbl_member (member_id, member_name, member_pic, member_email, member_mobile, member_token,token_id, crdt_date, crdt_id) " 
          sql += " SELECT '"+member_id+"', '"+displayName+"','"+ member_pic+"','"+ member_id+"','"+phoneNumber+"','"+member_token+"','"+idToken+"',sysdate(),'"+ member_id +"'";
          sql += " FROM DUAL ";
          sql += " WHERE NOT EXISTS (SELECT token_id FROM tbl_member WHERE token_id = '"+idToken+"')";
          
        }else{
          //안드로이드일 경우 토큰으로 저장
          sql = " INSERT INTO tbl_member (member_id, member_name, member_pic, member_email, member_mobile, member_token,token_id, crdt_date, crdt_id) " 
          sql += " SELECT '"+member_id+"', '"+displayName+"','"+ member_pic+"','"+ member_id+"','"+phoneNumber+"','"+member_token+"','"+idToken+"',sysdate(),'"+ member_id +"'";
          sql += " FROM DUAL ";
          sql += " WHERE NOT EXISTS (SELECT member_id FROM tbl_member WHERE member_id = '"+member_id+"')";
        }
        console.log('sql:'+sql);

        var retObject  = new Object();  
        let [rows0] = await global.mysqlPool.query(sql).catch((e) => {
            console.error(e);
            retObject.retcode = "fail";           
            return res.json(retObject);
        });

        //회원정보 
        var subQuary = "";
        if((member_id == '')||(member_id == null)||(member_id == 'undefinded')){
          //애플일경우 토큰으로 조회
          subQuary = " where token_id='"+idToken+"'  and status = 1 ";  
        }else{
          //안드로이드일경우 id 로 조회
          subQuary = " where member_id='"+member_id+"'  and status = 1 ";          
        }
        sql = "SELECT * ";
        sql +=" FROM tbl_member as a ";
        sql += subQuary;
        sql+= " order by crdt_date";
        console.log('sql:'+sql);

        var retObject  = new Object();  
        let [rows] = await global.mysqlPool.query(sql).catch((e) => {
            console.error(e);
            retObject.retcode = "fail";           
            return res.json(retObject);
        });

        if(rows.length == 1){
          var member_email_ck = false;
            var member_mobile_ck = false;
            var member_email = "";
            var member_mobile = "";
          
            if((rows[0].member_email == '')||(rows[0].member_email == null)||(rows[0].member_email == 'null')||(rows[0].member_email == 'undefinded')){
            }else{
              if((rows[0].member_email.length) > 5){
                member_email_ck = true;
                member_email = rows[0].member_email;
              }
            
            }      
            if((rows[0].member_mobile == '')||(rows[0].member_mobile == null)||(rows[0].member_email == 'null')||(rows[0].member_mobile == 'undefinded')){
            }else{
              if((rows[0].member_mobile.length) > 5){
                member_mobile_ck = true;
                member_mobile = rows[0].member_mobile;
              }
            }

              console.log("member_mobile_ck:"+member_mobile_ck);
            console.log("member_email_ck:"+member_email_ck);
              //로그인 성공한 경우
              req.session.user = {
                member_email: member_email,
                member_email_ck: member_email_ck,
                member_mobile_ck: member_mobile_ck,
                member_seq: rows[0].member_seq,
                member_id: rows[0].member_id,
                member_id: rows[0].member_id,
                member_location: rows[0].member_location,
                member_gubun: rows[0].member_gubun,
                member_mobile:member_mobile,                  
                member_name:rows[0].member_name,
                token_id:rows[0].token_id,
                member_token:rows[0].member_token,
                mileage:rows[0].mileage,
                area: rows[0].area2,
                first_login:true,
                authorized: true
            };
        }
        var userObject = req.session.user;
          //회원가입마일리지 적립
          userObject.mileage = 1000;
          await addMileage(userObject.member_id, MEMBER_REG_TRANS_TYPE);       
          
      }
      retObject.retcode = "success"; 
      return res.json(retObject)
  } catch (error) {
    // 예외가 발생했을 때 실행되는 코드
    console.error("An error occurred:", error.message);
    retObject.retcode = "fail"; 
    retObject.error = error; 
    return res.redirect('/stamory/regiser_01'); 
  } 

  
};