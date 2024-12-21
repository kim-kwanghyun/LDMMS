const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const app = express();
const fs = require("fs");
const crypto = require('crypto');
const axios = require('axios');
const FormData = require('form-data');
const sharp = require('sharp');
const nodemailer = require('nodemailer');

const { restart } = require("nodemon");
const mysql = require("mysql2");
const { Web3 } = require('web3');
var request = require("request");

const controller = require('./uploadController.js');
var ApiResponse = new Object();
const apiKey = 'QN_e9f7fa8e0a974ed2b138d31644c26616';
const MAINNET = "POLYGON";
const secretKey = "45554e534f4f45554e534f4f45554e53";
const iv = "0000000000000000";


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



var request = require("request");
var options = {
  headers: { "user-agent": "node.js" },
};
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


var email_istamp_list_seq = 0;

// 전처리
router.use(async (req, res, next) => {
    next();
});
router.route('/').get(controller.upload);
router.route('/uploadpage').get(controller.uploadpage);
router.route('/uploadcomplete').get(controller.uploadcomplete);

router.route('/view_pic').get(controller.view_pic);
router.route('/pic_list').get(controller.pic_list);


// 파일 업로드를 위한 Multer 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/'); // 파일이 저장될 경로 지정
  },
  filename: function (req, file, cb) {
    //cb(null, file.originalname); // 파일 이름 설정
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, Date.now() + '-' + basename.replace(/[^a-zA-Z0-9]/g, '') + ext);
  }
});
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 }  });

// 파일 업로드 처리 (여러 파일 업로드)
router.post('/upload', upload.array('files', 10), async function(req, res) {
  console.log('upload upload start');

  try{
    var memberid = req.body.memberid;
    var title = req.body.title;
    var creater = req.body.creater;
    var comment = req.body.comment;
    var open = req.body.open;

    var jsonObject = new Object();
    jsonObject.memberid = memberid;
    jsonObject.title = title;
    jsonObject.creater = creater;
    jsonObject.comment = comment;
    jsonObject.open = open;
    console.log("req.body:"+ JSON.stringify(req.body));
      
    const files = req.files;  
    
    if (!files || files.length === 0) {
      const error = new Error('Please upload one or more files');
      error.status = 400;
      return res.status(400).json({ error: 'Please upload one or more files' });
    }
    const fileNames = files.map(file => file.originalname);
    const fileNames1 = files.map(file => file.filename);
    var storefilename = 'http://allthemind.com/static/uploads/'+ fileNames1;

    //const uploadDir = path.join(__dirname, 'public', 'uploads');
    const uploadDir = '/root/project/ISTAMP_WEB3/public/uploads';
    const thumbnailPath = path.join(uploadDir, `thumbnail-${fileNames1}`);
    console.log('thumbnailPath:'+thumbnailPath);

      // 원본 이미지의 썸네일 생성
      await sharp(files[0].path)
          .resize(200, 200)
          .toFile(thumbnailPath);


  var contentType = "image/png"
    //1. 사진 IPFS 업로드 -> CID

    var imgipfs = await  uploadImgIPFS(jsonObject, fileNames1,memberid + Date.now() , contentType,storefilename,memberid);
    console.log("imgipfs:"+JSON.stringify(imgipfs));

    await makeShareImage(fileNames1);

    var retObject = new Object();
    retObject.isSuccessful = true;
    return res.send(ApiResponse.txid);
  } catch (error) {
    // 예외가 발생했을 때 실행되는 코드
    console.error("An error occurred:", error.message);
    return res.send(ApiResponse.txid);
  }

});


/***
 * 이미지 업로드 IPFS
 */
async function uploadImgIPFS(jsonObject, fileNames1,fileName, contentType,storefilename,memberid) {
  
  filePath = 'public/uploads/'+fileNames1;

  console.log("===================================");
  console.log("filePath:"+filePath);
  console.log("fileName:"+fileName);
  console.log("contentType:"+contentType);
  console.log("===================================");

  // FormData 객체를 생성하고 파일 및 메타 데이터를 추가합니다.
  const form = new FormData();
  
  form.append('Body', fs.createReadStream(filePath));
  form.append('Key', fileName);
  form.append('ContentType', contentType);

  // 요청을 보냅니다.
  axios.post('https://api.quicknode.com/ipfs/rest/v1/s3/put-object', form, {
      headers: {
          'x-api-key': apiKey,
          ...form.getHeaders()
      }
  })
  .then(response => {
      console.log('Success:', response.data);
      var imgipfs = response.data;
      storefilename = 'https://istam.quicknode-ipfs.com/ipfs/'+imgipfs.pin.cid;

      /*
      var sql_insert ="insert into istamp_list ";
      sql_insert += "(pic_url, hash, fileHash, ipfs_requestid, ipfs_cid, crdt_id, crdt_date)";
      sql_insert += " values('"+fileNames1+"','"+fileName +"','"+fileName+"','"+imgipfs.requestid+"','"+imgipfs.pin.cid+"','"+memberid+"',sysdate())";    

      console.log('sql_insert:'+sql_insert);
      runSQL(sql_insert, true)
      */
      runinsertSQL(jsonObject, fileNames1,fileName ,imgipfs.requestid,imgipfs.pin.cid,memberid)

      makeJsonFile(jsonObject, fileName ,storefilename,imgipfs.requestid,imgipfs.pin.cid,memberid);

      return response.data;
  })
  .catch(error => {
      console.error('Error:', error);
      return "error";
  });
}

async function runinsertSQL(jsonObject, fileNames1,fileName ,requestid,cid,memberid) {

  var insertQuery ="insert into istamp_list ";
  insertQuery += "(pic_url, hash, fileHash, ipfs_requestid, ipfs_cid, share_pic_url, open,title,contents, crdt_id, crdt_date)";
  insertQuery += " values(?,?,?,?,?,?,?,?,?,?,sysdate())";      

        // 데이터 삽입 쿼리
    const data = [fileNames1,fileName,fileName,requestid,cid, "download_"+fileNames1, jsonObject.open, jsonObject.title,jsonObject.comment, memberid];
        // 데이터 삽입 쿼리

    const connection = mysql.createConnection({
      database: process.env.CONST_DB_DATABASE,
      host: process.env.CONST_DB_HOST,
      port: process.env.CONST_DB_PORT,
      user: process.env.CONST_DB_USER,
      password: process.env.CONST_DB_PASSWORD,
      connectionLimit: 100,
      connectTimeout: 1000,
      multipleStatements: true,
    });

  
    // 데이터 삽입
    connection.query(insertQuery, data, (error, results, fields) => {
          if (error) {
            console.error('데이터 삽입 실패: ' + error.stack);
            connection.end();
            return;
          }

          // 마지막 삽입된 ID 가져오기
          const lastInsertId = results.insertId;
          console.log('마지막 삽입된 ID: ' + lastInsertId);

          email_istamp_list_seq = lastInsertId;
          //runemail(lastInsertId);

          // 연결 종료
          connection.end();      
        
        return "success";
        // Process rows here

    });
}
async function runemail() {
  console.log("email start");

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
    sql += " from istamp_list as a where a.istamp_list_seq = '"+email_istamp_list_seq+"'"  ; 
    console.log("sql:"+sql);
    let [row] = await global.mysqlPool.query(sql).catch((e) => {
      throw new Error('처리중 오류가 발생했습니다!');
      console.error(e);
    });
    if(row.length > 0){
        data = data.replace('{date}',row[0].formatted_date);
        data = data.replace('{Image}',row[0].ipfs_cid);
        data = data.replace('{Image}',row[0].ipfs_cid);    
        data = data.replace('{NFT}',row[0].metadata_url);
        data = data.replace('{NFT}',row[0].metadata_url);

          // 이메일 옵션 설정
        const mailOptions = {
          from: 'khkim@eterners.com',     // 발신자 이메일 주소
          to: row[0].crdt_id,// 수신자 이메일 주소
          subject: '[ISTAM]Your contents safy saving Blockcahin['+row[0].istamp_list_seq+']',    // 이메일 제목
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
      }

  var retObject = new Object();
  retObject.ret = "success"; 
  console.log('email complete');   
}

async function runSQL(sql_insert, email_flag) {
    try {
      let rows = await global.mysqlPool.query(sql_insert);      
      console.log(JSON.stringify(rows));
      
      runemail();

      return "success";
      // Process rows here
  } catch (error) {
      console.error(error);
      return "DB Error"; // Or handle the error in another appropriate way
  }
}

async function makeJsonFile(jsonObject, file_name,storefilename,requestid,cid,memberid) {
  
  // JSON 데이터
  var jsonData = new Object();
  jsonData.name = "ETENERS i-STAM NFT";
  jsonData.version = "1.0";
  jsonData.url = "https://i-stam.com";
  jsonData.description = "iSTAM metadata file";
  jsonData.email = "khkim@eterners.com";
  jsonData.requestid = requestid;
  jsonData.cid = cid;
  jsonData.image = storefilename;

  if(jsonObject.open == "2"){
    jsonData.requestid = encrypt(requestid);
    jsonData.cid = encrypt(cid);
    jsonData.image = encrypt(storefilename);
  }
  jsonData.Creationdates = (new Date()).toDateString;  
  
  jsonData.creator = memberid;
  jsonData.mainnet = MAINNET;
  
  var attributes  = new Array();
  var aaa =  new Object();
  aaa.title = jsonObject.title;
  aaa.creater = jsonObject.creater;
  aaa.comment = jsonObject.comment;
  if(jsonObject.open == "1"){
    aaa.open = "public";
  }else if(jsonObject.open == "2"){
    aaa.open = "confidential";
  }
  attributes.push(aaa) ;

  jsonData.attributes=attributes;
  // JSON 데이터를 문자열로 변환
  const jsonString = JSON.stringify(jsonData, null, 2); // null과 2는 들여쓰기를 위한 옵션
  
  var write_file_name = "./public/json/"+file_name+".json";
  // 파일에 JSON 문자열 쓰기
  fs.writeFile(write_file_name, jsonString, (err) => {
    if (err) {
        console.log('Error writing file:', err);
    } else {
        console.log('Successfully wrote JSON data to file');
        console.log('file_name:'+file_name);
        var contentType ='application/json';
        const form = new FormData();
        //form.append('Body', fs.createReadStream(write_file_name));
        var filePath = 'public/json/'+file_name+".json";
        form.append('Body', fs.createReadStream(filePath));
        form.append('Key', file_name+"_1");
        form.append('ContentType', contentType);

        // 요청을 보냅니다.
        axios.post('https://api.quicknode.com/ipfs/rest/v1/s3/put-object', form, {
            headers: {
                'x-api-key': apiKey,
                ...form.getHeaders()
            }
        })
        .then(response => {
            console.log('Success:', response.data);
            var imgipfs = response.data;
            storefilename = 'https://istam.quicknode-ipfs.com/ipfs/'+imgipfs.pin.cid;

            var txid = makeNFT(storefilename,file_name,memberid,cid);
          
        })
        .catch(error => {
            console.error('Error:', error);
            return "error";
        });
      
        
    }
  });
  };
  
  
async function makeNFT(storefilename,file_name, memberid,cid) {
  
  try {
    const mainnetType = 1;
    //const contractAddress = '0xDA8d208bb96ddedBc69D21Ed9Fe27036F883e72B'; // 스마트 계약 주소  before 2024-07-23
    const contractAddress = '0xE376566a2CC4F8A663F3A669bD8AbcD0573171c0'; // 스마트 계약 주소 from 2024-07-23
    const INFURA_API_KEY = "4fc0783f88504c6692cea45407110da7";
    //const rpcUrl = (`https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}`);
    const rpcUrl = 'https://cosmological-alien-friday.matic.quiknode.pro/e364875ea47dbb02161b6e2bd3c1c1106aedd3c2/';
    //const rpcUrl = 'https://ultra-dawn-sea.matic.quiknode.pro/eb444c33ba4de7d617f6b6c6cce939649f1039ff/'
      const metadataUrl = storefilename;
     // const receiverAddress = "0xE8A7a6694E8a0Dc3cD74F58041D5EcEb14d929bC"    before 2024-07-23 
      const receiverAddress = "0x89dc87255B76511eFbcA0898e60b34B6b106EC19";  // from 2024-07-23
         
      var privateKey = global.globalPKData;
     
      let web3 = null;
      if (mainnetType === 0 || mainnetType === 1) {
          web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
      } else {
          return res.status(200).send(ApiResponse.getFailureResponseWithMessage(1000, "INVALID CHAIN ID"));
      }
      const account = web3.eth.accounts.privateKeyToAccount(privateKey);
      const contract = new web3.eth.Contract(contractAbi, contractAddress);
      let wallet = web3.eth.accounts.wallet.add(account);
      const gasPrice = await web3.eth.getGasPrice();
      let nonce = await web3.eth.getTransactionCount(account.address, 'pending');
      console.log("1: " );
      const gasLimit = await contract.methods.safeMint(receiverAddress, metadataUrl).estimateGas({
      //const gasLimit = await contract.methods.mint(receiverAddress, metadataUrl).estimateGas({
          from: account.address, nonce: nonce
      });
      console.log("gasLimit: " + gasLimit);
      console.log("receiverAddress: " + receiverAddress);
      console.log("metadataUrl: " + metadataUrl);

      await contract.methods.safeMint(receiverAddress, metadataUrl).send({
          from: account.address, gas: gasLimit, gasPrice: gasPrice, nonce: nonce++
      }).on('transactionHash', function (hash) {
          console.log("Transaction Hash: " + hash);
          web3.eth.accounts.wallet.clear();
          ApiResponse.Retcode= 1;
          ApiResponse.txid= hash

          sql_update ="update istamp_list ";
          sql_update += " set metadata_url = '"+hash+"' , mdfy_id ='"+memberid+"' , mdfy_date = sysdate() ";
          sql_update += " where hash = '"+file_name +"'";    
          console.log('sql_update:'+sql_update);  
          runSQL(sql_update, false);

          subMileage(memberid, 0,PAY_TRANS_TYPE );
        
          return ApiResponse.txid;          
      });
  } catch (e) {
    console.log("error(makeNFT): " + e);
    return ApiResponse.txid;
  }
 };

 
  // 2초 지연 함수
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
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


// SEED 암호화 함수
function encrypt(text) {
  const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// SEED 복호화 함수
function decrypt(encryptedText) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

async function subMileage(member_id, amount, TRANS_TYPE){  
  var sql_insert ="insert tbl_mileage_log (member_id, trans_date, trans_type, amount, crdt_id, crdt_date) ";
  sql_insert += " values ('"+member_id+"',(DATE_FORMAT(CURDATE(), '%Y%m%d')),"+TRANS_TYPE+",";
   sql_insert += " (select amount from tbl_cd_val where cd_type = "+TRANS_TYPE+" and cd_id = 'MILEAGE_TYPE') ,"
   sql_insert += " '"+member_id+"',sysdate())";
  console.log("sql_insert:"+sql_insert);
  let [row_insert] = await global.mysqlPool.query(sql_insert).catch((e) => {        
    return false;
  });

  //정기결제여부를 확인하여 마일리지 차감여부 확인
  var sql0 = "select *,";
  sql0 += "  CASE WHEN CURDATE() BETWEEN str_date AND end_date THEN 'Yes' ELSE 'No'  END AS is_within_range ";
  sql0 +=" from tbl_member_subscription as a where a.member_id ='"+member_id+"' and enable =1 ";
  let [row0] = await global.mysqlPool.query(sql0).catch((e) => {        
    return false;
  });

  var is_within_range = "No";
  if(row0.length > 0){
    if(row0[0].is_within_range == "No"){
      is_within_range = "No";
    }else{
      is_within_range = "Yes";
    }
  }else {  
    is_within_range = "No";
  }

  if(is_within_range == "No"){
    var sql ="update tbl_member set mileage = mileage - (select amount from tbl_cd_val where cd_type = "+TRANS_TYPE+" and cd_id = 'MILEAGE_TYPE')";
    sql += " where member_id = '"+member_id +"'";
  
    console.log("sql:"+sql);
    let [rows] = await global.mysqlPool.query(sql).catch((e) => {        
      return false;
    });
  }
  return true;
}
/***
 * 공유할 사진 만들기
 */

//exports.istam_download = async (req, res, next) => {   
async function makeShareImage(pic_url) {     
  //var istamp_list_seq = req.query.istamp_list_seq;
  //var pic_url = req.query.pic_url;
   
  // 이미지 파일과 로고 파일 경로 설정
  const currentDir = __dirname;
  const pic_folder ="../../public/uploads/";
  const logo_folder = "../../public/assets/img/";

  var inputImagePath1 = pic_folder+pic_url; // 원본 이미지 경로  
  var inputImagePath = path.join(currentDir, inputImagePath1);
  var outImagePath = path.join(currentDir, pic_folder+"resize_"+pic_url); 
  
  await resizeImage(inputImagePath,outImagePath );

  inputImagePath1 = pic_folder+"resize_"+pic_url;
  const logoPath1 = logo_folder + "[50]pic_logo.png"; // 로고 이미지 경로
  const outputImagePath1 = pic_folder + "download_"+pic_url; // 결과 이미지 경로
  const logoPath = path.join(currentDir, logoPath1);
  const outputImagePath = path.join(currentDir, outputImagePath1);
  await processImage(outImagePath, logoPath, outputImagePath); 
  
};

// 이미지 크기 조정 함수
const resizeImage = async (inputPath, outputPath) => {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    const maxSize = 800; // 최대 크기 예시 (500px)
    const isLandscape = metadata.width > metadata.height;
    
    if (isLandscape) {
      await image.resize({ width: maxSize }).toFile(outputPath);
    } else {
      await image.resize({ height: maxSize }).toFile(outputPath);
    }

    console.log('이미지 크기 조정 완료');
  } catch (err) {
    console.error('이미지 크기 조정 중 오류 발생:', err);
  }
};


// 이미지 크기 조정 및 배경에 올리기 함수
const processImage = async (inputPath, logoPath, outputPath) => {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const { width: imageWidth, height: imageHeight } = await image.metadata();

 
    // 로고 이미지 크기 조정
    const logo = sharp(logoPath).resize({
      width: 50, // 로고 크기 예시 (100px)
      height: 50,
      fit: 'inside'
    });

    const { width: logoWidth, height: logoHeight } = await sharp(logoPath).metadata();

    console.log("imageWidth:"+imageWidth +"/imageHeight:"+imageHeight);

console.log("logoWidth:"+logoWidth +"/logoHeight:"+logoHeight);
    
    // 크기 조정된 이미지를 배경에 올리기
    await image
      .composite([      
        { input: await logo.toBuffer(),        
          top: imageHeight - (imageHeight - 10), // 상단에서 10px 떨어진 위치
          left: imageWidth - ( 50-10), // 오른쪽 가장자리에서 10px 떨어진 위치          
          blend: 'over'} // 로고를 하단 오른쪽에 배치
      ])
      .toFile(outputPath);

    console.log('이미지 처리 완료');
  } catch (err) {
    console.error('이미지 처리 중 오류 발생:', err);
  }
};

module.exports = router;
