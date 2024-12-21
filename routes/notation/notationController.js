const { default: axios } = require("axios");
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



const { Web3 } = require('web3');
//const contractAbi = require('./MyToken.json'); // 스마트 계약 ABI


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

// 직전 블록의 가스 가격을 조회하는 함수
async function getPreviousBlockGasPrice(web3) {
  const blockNumber = await web3.eth.getBlockNumber();
  const previousBlock = await web3.eth.getBlock(BigInt(blockNumber) - BigInt(1));

  var retBlockInfo = new Object();
  retBlockInfo.before_gasPrice = previousBlock.baseFeePerGas;

  const transactionData = {
    to: '0xRecipientAddress',  // 수신자 주소
    value: web3.utils.toWei('0.1', 'ether'),  // 전송할 이더량 (예: 0.1 ETH)
    gas: 21000n  // 전송에 필요한 gas 양
  };
  // 현재 gas 가격 (gas price) 조회
  web3.eth.getGasPrice()
      .then((currentGasPrice) => {
          var currentGasPrice1 = BigInt(currentGasPrice); // gas 가격을 BigInt로 변환

          // 최대 허용 gas 비용 계산
          const maxFee = transactionData.gas * currentGasPrice1;

          // maxFeePerGas 계산
          const maxFeePerGas = maxFee / transactionData.gas;
          retBlockInfo.currentGasPrice = currentGasPrice1;
          retBlockInfo.maxFeePerGas = maxFeePerGas;
          console.log('Gas Price:', currentGasPrice1.toString());
          console.log('Max Fee:', maxFee.toString());
          console.log('Max Fee Per Gas:', maxFeePerGas.toString());
      })
      .catch((error) => {
          console.error('Error:', error);
      });
      
  return retBlockInfo;
}


exports.mint = async (req, res, next) => {
  console.log("mint start");
  var id = req.query.id;
  const INFURA_API_KEY = "4fc0783f88504c6692cea45407110da7";
  const web3 = new Web3(`https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}`);
  //const web3 = new Web3('https://polygon-rpc.com'); // 폴리곤 RPC 엔드포인트
  //const web3 = new Web3(new Web3.providers.HttpProvider('https://polygon-rpc.com')); // 폴리곤 RPC 엔드포인트

  const contractAddress = '0xDA8d208bb96ddedBc69D21Ed9Fe27036F883e72B'; // 스마트 계약 주소
  var privateKey = '0x34e4bbd8f25edaa12854eff14da9407e5fd083d46e91252facbeb9cb6ab70a73'; // 개인 키
  const addr = "0xE3581a05C0dc0BdeCb60653Cfd396E0b5458Ab58";
  const toAddress = "0xE8A7a6694E8a0Dc3cD74F58041D5EcEb14d929bC"

  const contract = new web3.eth.Contract(contractAbi, contractAddress);
  const symbol = await contract.methods.symbol().call();
  console.log('symbol:',symbol);
  const add = await contract.methods.ownerOf(1).call();
  console.log('owner token addr:', add);

  var tokenUrl = "http://211.253.30.7/uploads/metadata/metadata.json"

  
  const previousBlock = await getPreviousBlockGasPrice(web3);  
  const gasPrice = previousBlock.before_gasPrice;
  console.log('gasPrice:', gasPrice);

//  var gas = previousBlock.currentGasPrice.gasLimit;
 // var gas = previousBlock.currentGasPrice.gasUsed;
  //var maxFeePerGas = (previousBlock.maxFeePerGas);

   // 이전에 보낸 트랜잭션의 nonce를 가져오기 위해 마지막 nonce를 조회
   const lastNonce = await web3.eth.getTransactionCount(addr);
   // 이전에 보낸 트랜잭션의 nonce에 1을 더하여 새로운 nonce를 생성
   const newNonce = lastNonce + BigInt(1);
   console.log('newNonce:', newNonce);

  // safeMint 함수의 호출 데이터 인코딩
  const data = contract.methods.safeMint(toAddress, tokenUrl).encodeABI();
  // 트랜잭션 객체 생성
  const txObject = {
    nonce: web3.utils.toHex(newNonce), // 새로운 nonce 설정
    from: web3.eth.accounts.privateKeyToAccount(privateKey).address,
    to: contractAddress,
    //gas: gas, // 적절한 가스 양 설정
    gas: '0x30d40', // 적절한 가스 양 설정
    maxFeePerGas: '0x5ee0238bc6', // 블록의 기본 가스 비용과 일치하도록 설정
    maxPriorityFeePerGas: gasPrice, // 최소한의 우선 순위 가스 비용 설정
    data: data
  };

  // Ethereum 노드에 연결하여 트랜잭션을 서명
  const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);
  
  // 서명된 트랜잭션 전송
  const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);  
  
  //mintNFT(toaddr,tokenUrl);
  var retObject = new Object();
  retObject.ret ="sucess";
  retObject.hash = txReceipt;

  return res.json(retObject);
};
var ApiResponse = new Object();

// Infura 프로젝트 ID와 프로젝트 비밀키
//const projectId = 'YOUR_PROJECT_ID';
//const projectSecret = 'YOUR_PROJECT_SECRET';
const projectId = '843fb43d2d294b439e3671db53220bd0';
const projectSecret = 'ZL9oMZc7v2FQIii1buzwP+wYKH34MTQzA6HAkq4sWMA=';

exports.info = async (req, res, next) => {
  try {
      //const mainnetType = req.query.mainnet;
      const mainnetType = 1;
      //const contractAddress = req.query.contract_address;
      //const rpcUrl = req.query.rpc_url;
      const tokenId = 1;
      

      const contractAddress = '0xDA8d208bb96ddedBc69D21Ed9Fe27036F883e72B'; // 스마트 계약 주소
      var privateKey = '0x34e4bbd8f25edaa12854eff14da9407e5fd083d46e91252facbeb9cb6ab70a73'; // 개인 키
      const addr = "0xE3581a05C0dc0BdeCb60653Cfd396E0b5458Ab58";
      const toAddress = "0xE8A7a6694E8a0Dc3cD74F58041D5EcEb14d929bC"

      const INFURA_API_KEY = "4fc0783f88504c6692cea45407110da7";
      const rpcUrl = (`https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}`);
      console.log("5")
      let web3 = null;
      if (mainnetType === 0 || mainnetType === 1) {
          web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
      } else {
          return res.status(200).send(ApiResponse.getFailureResponseWithMessage(1000, "INVALID CHAIN ID"));
      }
      console.log("6")


      const contract = new web3.eth.Contract(contractAbi, contractAddress);
      console.log("7")
      const result = await contract.methods.tokenURI(tokenId).call();
      const symbol = await contract.methods.symbol().call();
      ApiResponse.result=result;
      ApiResponse.symbol=symbol;
      return res.json(ApiResponse);

      
  } catch (e) {
      next(e);
  }
}

exports.transfer = async (req, res, next) => {

  try {
    const mainnetType = 1;
    const contractAddress = '0xDA8d208bb96ddedBc69D21Ed9Fe27036F883e72B'; // 스마트 계약 주소
    const INFURA_API_KEY = "4fc0783f88504c6692cea45407110da7";
    const rpcUrl = (`https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}`);
      const metadataUrl = "http://allthemind.com";
      const receiverAddress = "0xE8A7a6694E8a0Dc3cD74F58041D5EcEb14d929bC"
      var privateKey = '0x34e4bbd8f25edaa12854eff14da9407e5fd083d46e91252facbeb9cb6ab70a73'; // 개인 키

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

      await contract.methods.safeMint(receiverAddress, metadataUrl).send({
          from: account.address, gas: gasLimit, gasPrice: gasPrice, nonce: nonce++
      }).on('transactionHash', function (hash) {
          console.log("Transaction Hash: " + hash);
          web3.eth.accounts.wallet.clear();
          ApiResponse.Retcode= 1;
          ApiResponse.txid= hash
          return res.json(ApiResponse);
          
      });
  } catch (e) {
      next(e);
  }
}

exports.uploadipfs = async (req, res, next) => {

  // QuickNode API Key QN_004e5b39fd0e49a9b9b7ee626ceb4d80
  const apiKey = 'QN_004e5b39fd0e49a9b9b7ee626ceb4d80'; // QuickNode에서 발급받은 API 키
  var myHeaders = new Headers();
  myHeaders.append("x-api-key",apiKey);

  const filePath = path.join(__dirname, 'output.json');

  var formdata = new FormData();
  //formdata.append("Body", fileInput.files[0], "YOUR_FILE_PATH");
  //formdata.append("Key", "YOUR_FILE_NAME");
  //formdata.append("ContentType", "YOUR_CONTENT_TYPE");

  formdata.append("Body", filePath);
  formdata.append("Key", "output.json");
  formdata.append("ContentType", "text");

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow'
  };

  fetch("https://api.quicknode.com/ipfs/rest/v1/s3/put-object", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

/*
exports.uploadipfs = async (req, res, next) => {

  //https://eterners.quicknode-ipfs.com/ipfs
  //gateway name : eterners.quicknode-ipfs.com

  //const apiUrl = 'https://eterners.quicknode-ipfs.com/ipfs/api/v0/add'; // QuickNode IPFS API 엔드포인트
  const apiUrl = 'https://api.quicknode.com/ipfs/rest/v1/gateway';

// QuickNode API Key QN_004e5b39fd0e49a9b9b7ee626ceb4d80
const apiKey = 'QN_004e5b39fd0e49a9b9b7ee626ceb4d80'; // QuickNode에서 발급받은 API 키

    // 업로드할 파일 경로
    console.log("uploadipfs");
    //const filePath = path.join(__dirname, '../../config/config.js');
    const filePath = path.join(__dirname, 'output.json');
    console.log("filePath: " + filePath);

    // 파일을 읽어서 업로드
    const uploadToIPFS = async () => {
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));
      // 디버깅을 위한 로그
      console.log('API URL:', apiUrl);
      console.log('Headers:', {
        ...form.getHeaders(),
        Authorization: `Bearer ${apiKey}`,
      });
      try {
        const response = await axios.post(apiUrl , form, {
          headers: {
            ...form.getHeaders(),
            Authorization: `Bearer ${apiKey}`,
          },
        });

        if (response.status === 200) {
          console.log(`File uploaded successfully: ${response.data.Hash}`);
          ApiResponse.Retcode= 1;
          ApiResponse.txid= response.data.Hash
          return res.json(ApiResponse);
        } else {
          console.error(`Failed to upload file: ${response.statusText}`);
          ApiResponse.Retcode= 0;
          ApiResponse.txid= response.statusText;
          return res.json(ApiResponse);
        }
      } catch (error) {
        console.error(`Error uploading file: ${error.message}`);
      }
    };
    uploadToIPFS();
}
*/

exports.mintFile = async (req, res, next) => {
  
// JSON 데이터
//json 파일 위치 : http://localhost/static/json/output.json

var jsonData = new Object();
jsonData.name = "Ethernes iSTAMP NFT";
jsonData.description = "This is iSTAMP metadata file";
jsonData.images = "http://211.253.30.7/static/uploads/1712574069531-1707270808839png9111135301242174886.png";

// JSON 데이터를 문자열로 변환
const jsonString = JSON.stringify(jsonData, null, 2); // null과 2는 들여쓰기를 위한 옵션

// 파일에 JSON 문자열 쓰기
fs.writeFile('./public/json/output.json', jsonString, (err) => {
  if (err) {
      console.log('Error writing file:', err);
  } else {
      console.log('Successfully wrote JSON data to file');
  }
});

};

/*
exports.mint = async (req, res, next) => {
  console.log("mint start");
  var id = req.query.id;
  const INFURA_API_KEY = "4fc0783f88504c6692cea45407110da7";
  const web3 = new Web3(`https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}`);
  //const web3 = new Web3('https://polygon-rpc.com'); // 폴리곤 RPC 엔드포인트
  //const web3 = new Web3(new Web3.providers.HttpProvider('https://polygon-rpc.com')); // 폴리곤 RPC 엔드포인트

  const contractAddress = '0xDA8d208bb96ddedBc69D21Ed9Fe27036F883e72B'; // 스마트 계약 주소
  var privateKey = '0x34e4bbd8f25edaa12854eff14da9407e5fd083d46e91252facbeb9cb6ab70a73'; // 개인 키
  const addr = "0xE3581a05C0dc0BdeCb60653Cfd396E0b5458Ab58";
  const toaddr = "0xE8A7a6694E8a0Dc3cD74F58041D5EcEb14d929bC"
 
  const contract = new web3.eth.Contract(contractAbi, contractAddress);
  const symbol = await contract.methods.symbol().call();
  console.log('symbol:',symbol);

  const add = await contract.methods.ownerOf(1).call();
  console.log('owner token addr:', add);

  var tokenUrl = "http://211.253.30.7/uploads/metadata/metadata.json"
  
  //async function mintNFT(to, tokenUrl) {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);      
    const accounts = await web3.eth.getAccounts();
    
    console.log("accounts.length :"+accounts.length );
      for(var i = 0;i<accounts.length ; i++){
        const fromAccount = accounts[i]; 
        console.log(fromAccount);
      }

      await contract.methods.safeMint(  toaddr, tokenUrl).send({ from: account.address })
      console.log(`NFT 발행이 완료되었습니다. 토큰 ID: ${tokenUrl}`);
    
  //}
  
  //mintNFT(toaddr,tokenUrl);
  var retObject = new Object();
  retObject.ret ="sucess";

  return res.json();
};
*/



exports.uploadpage = async (req, res, next) => {
  console.log("uploadpage start");
 return res.render('notation/uploadpage');    
};


exports.notation_complete = async (req, res, next) => {
  console.log("notation_complete start");
 
  return res.render('notation/notation_complete');    
};

//notation_view?url="+url+"&notation_list_seq="+notation_list_seq;
//                  
exports.notation_view = async (req, res, next) => {
  console.log("notation_view start");
  //  "/static/uploads/pic1.jpg"\
  //   " /image/pic1.jpg/1"

  var url = req.query.url;
  var notation_list_seq = req.query.notation_list_seq;

  url = url.replace('/static/uploads','/image' )

  console.log("url:"+url);
 
  var imgInfo = new Object();
  imgInfo.url= url;
  imgInfo.notation_list_seq= notation_list_seq;
  imgInfo.img_url = "http://211.253.30.7"+url +"/"+notation_list_seq;
  console.log("imgInfo.img_url:"+imgInfo.img_url);

  return res.render('notation/notation_view', {imgInfo:imgInfo});    
};

exports.notation_alllist = async (req, res, next) => {
  console.log("notation_alllist start");

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/notation');
  }
  var userObject = req.session.user;
  var member_id = req.session.user.member_id;
  
  var sql_select = " select * , ";  
  sql_select += " DATE_FORMAT(crdt_date, '%Y-%m-%d') AS formatted_date ";
  sql_select += " from notation_list as a "  
  sql_select += " order by a.crdt_date desc "  
  
  
  console.log("sql_select:"+sql_select);
  let [rows] = await global.mysqlPool.query(sql_select).catch((e) => {
    throw new Error('처리중 오류가 발생했습니다!');
    console.error(e);
  });
  var retObject = new Object();
  retObject.mylist = rows;
  var aaa = [];
  retObject.myrequestlist = aaa; 
 
  console.log("userObject:"+JSON.stringify(userObject))
  return res.render('notation/notation_alllist',{retObject:retObject, userObject:userObject});    
};
exports.setnotation = async (req, res, next) => {
  console.log("setnotation start");
  var notation_request_seq = req.query.notation_request_seq
  var notation_id = req.query.notation_id
  
  var sql_updated = " update notation_request set status = 1 ";            
  sql_updated += " where notation_request_seq ="+notation_request_seq;
    
    console.log("sql_updated:"+sql_updated);
    let [rows] = await global.mysqlPool.query(sql_updated).catch((e) => {
      throw new Error('처리중 오류가 발생했습니다!');
      console.error(e);
    });

    
  sql_updated = " update notation_list set noti_cnt = noti_cnt + 1 ";            
  sql_updated += " where notation_list_seq = (select notation_list_seq from notation_request where notation_request_seq ="+notation_request_seq+")";
    
    console.log("sql_updated:"+sql_updated);
    let [rows0] = await global.mysqlPool.query(sql_updated).catch((e) => {
      throw new Error('처리중 오류가 발생했습니다!');
      console.error(e);
    });


    var retObject = new Object();
    retObject.ret = "success";
    return res.json(retObject);
}

exports.callNotation = async (req, res, next) => {
  console.log("callNotation start");
  var notation_list_seq = req.query.notation_list_seq
  var phone = req.query.phone
  
  var sql_updated = " insert into notation_request ";
  sql_updated += " ( notation_list_seq,notation_id, request_id,status, crdt_date,crdt_id) ";            
  sql_updated += " values("+notation_list_seq+","
  sql_updated += " (select member_id from tbl_member where member_mobile = '"+phone +"'),";  
  sql_updated += " (select crdt_id from notation_list where notation_list_seq = "+notation_list_seq +"),";
  sql_updated += "0,sysdate(), ";
  sql_updated += " (select crdt_id from notation_list where notation_list_seq = "+notation_list_seq +") )";
    
    console.log("sql_updated:"+sql_updated);
    let [rows] = await global.mysqlPool.query(sql_updated).catch((e) => {
      throw new Error('처리중 오류가 발생했습니다!');
      console.error(e);
    });

    var retObject = new Object();
    retObject.ret = "success";
    return res.json(retObject);
}



exports.notation_list = async (req, res, next) => {
  console.log("notation_list start");

  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.redirect('/notation');
  }

  var userObject = req.session.user;
  var member_id = req.session.user.member_id;

  var para = req.query.para;

 
    var sql_select = " select * , ";  
    sql_select += " DATE_FORMAT(crdt_date, '%Y-%m-%d') AS formatted_date ";
    sql_select += " from notation_list as a "  
    sql_select += " where a.crdt_id ='"+member_id +"' ";
    sql_select += " order by a.crdt_date desc ";
    
    
    console.log("sql_select:"+sql_select);
    let [rows] = await global.mysqlPool.query(sql_select).catch((e) => {
      throw new Error('처리중 오류가 발생했습니다!');
      console.error(e);
    });
    var retObject = new Object();
    retObject.mylist = rows;
    var member_id = req.session.user.member_id;

    sql_select = "SELECT a.notation_request_seq, a.notation_id, ";
    sql_select += "(select member_name FROM tbl_member WHERE member_id = a.crdt_id) AS member_name,  ";
    sql_select += "(SELECT pic_url FROM notation_list WHERE notation_list_seq = a.notation_list_seq) as pic_url, ";
    sql_select += "(SELECT noti_cnt FROM notation_list WHERE notation_list_seq = a.notation_list_seq) as noti_cnt, ";
    sql_select +="DATE_FORMAT(a.crdt_date, '%Y-%m-%d') AS formatted_date  ";
    sql_select += "FROM notation_request AS a   ";
    sql_select += " WHERE a.notation_id = '"+member_id+"' AND a.status = 0 ";
    sql_select += " order by a.crdt_date desc ";
    
    console.log("sql_select:"+sql_select);
    let [rows0] = await global.mysqlPool.query(sql_select).catch((e) => {
      throw new Error('처리중 오류가 발생했습니다!');
      console.error(e);
    });  
    retObject.myrequestlist = rows0;
 
  console.log("userObject:"+JSON.stringify(userObject))
  return res.render('notation/notation_list',{retObject:retObject, userObject:userObject});    
};

exports.login = async (req, res, next) => {
  console.log("login start");

  var userObject = req.session.user;
  if((req.session.user == null)||(req.session.user == 'undefined')){
    return res.render('notation/login');
  }else{
    return res.redirect('/notation/notation_list');    
  }
};

exports.checkLogIn = async (req, res, next) => {
    console.log("checkLogIn start");
    var email = req.body.email;
    var pwd = req.body.pwd;
    
    console.log("body:"+ JSON.stringify(req.body)+ "email:"+email+" pwd:"+pwd);
    pwd = crypto.createHash('sha256').update(pwd).digest('hex');
    console.log('pwd: ' + pwd);

    var subQuary = " where member_id='"+email+"' and member_pwd = '"+pwd+"'";  
    let sql = "SELECT * ";
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
        
      //로그인 성공한 경우
      req.session.user = {
        email: rows[0].member_email,
        member_seq: rows[0].member_seq,
        member_id: rows[0].member_id,

        member_location: rows[0].member_location,
        member_gubun: rows[0].member_gubun,
        member_mobile:rows[0].member_mobile,                  
        member_name:rows[0].member_name,
        mileage:rows[0].mileage,
        area: rows[0].area2,
        authorized: true
    };
    return res.redirect('/notation/notation_list');    
  }else {
      return res.redirect('/notation');    
  }
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