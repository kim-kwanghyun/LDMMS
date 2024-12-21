//example
/*
    try{
        // --- 뭔가 어떤 로직 처리 --- 
        // logic()
        // 리턴 결과에 문제가 있는 경우, 에러를 던져서 응답 
        if(err == 1) throwErr(200, 9991, "Error")
        else if (err == 2) throwErr(400, "Undefined Error")
        else if (err >= 3) throwErr(500)
        
        if(success == 1) return successRes(res, 8881, "Success with data", {user : "abc", job : "programmer"}) 
        else if (success == 2) return successRes(res, "Good")
        return successRes(res, 8882, "Good")
    } catch (E) {
        //이렇게 하게 된 이유
        // 1. 앞단 로직에서 에러가 나는 경우에 try catch 를 놓쳐도 알아서 잡아서 응답함.
        // 2. 에러가 없어도 문제가 있는 경우 throw 하면 됨
        // 3. success를 보내다가도 에러가 날 수 있는데, 이렇게하면 무조건 응답은 할 수 있음.
        // 4. 모든 에러 상황을 catchAndRes 함수로 연결하고 로깅처리를 하면, 에러를 놓치지 않고 리포팅 할 수 있음.
        await catchAndRes(E, req, res, ticket)
    }

*/

//This code consists of three functions that are responsible for handling errors and returning responses to clients 

const tools = require('../utils/tools')
const db = require('../utils/')


const throwErr = (httpCode, bodyCode, message) => { // 순위 : http코드(int) || 코드(str) / (메시지)
  let args = []
  let defaultHttpCode = 444; //if http code is not provide it defults to this error.
  
  for(var i in arguments){
    args.push(arguments[i])
  }
  
  if(arguments.length == 2){ // 코드, 메시지
    httpCode = args[0];
    bodyCode = args[0];
    message = args[1];
    if (typeof arg[0] === 'string' || arg[0] instanceof String){
      httpCode = defaultHttpCode;
    }
  } else if(arguments.length == 1){ // http코드 또는 메시지
    if (typeof arg[0] === 'string' || arg[0] instanceof String){
      httpCode = defaultHttpCode;
      bodyCode = defaultHttpCode;
      message = args[0];
    } else { //http 코드인 경우
      httpCode = args[0];
      bodyCode = args[0];
      message = "No message"
    }
  } else if(arguments.length == 0){
    httpCode = defaultHttpCode;
    bodyCode = defaultHttpCode;
    message = "No message"
  }

  //todo : logging
  e = new Error();
  let frame = e.stack.split("\n")[2]; // change to 3 for grandparent func
  let lineNumber = frame.split(":").reverse()[1];
  let functionName = frame.split(" ")[5];
  console.log("["+functionName+":"+lineNumber+"]"+"["+bodyCode+"] "+message);
  e.statusCode = httpCode
  e.code = bodyCode;
  e.message = message;
  throw(e)
}

//The second function named catchAndRes is responsible for catching an error thrown by a function and returning 
//a response to the client with an error code, message, and HTTP status code
//clientIP, serverIP, statusCode, bodyCode, message, file, line, func
const catchAndRes = async(E, req, res, ticket = "NO_TICKET") =>{ //E error thrown by a function. ticket a string containing a unique identifier for the error.
try {
  let statusCode = E.statusCode || 444
  let code = E.code || 444
  if(!isInt(code)) code = 444
  let message = E.message || E.toString()
  let clientIP = tools.getClientIP(req)
  let serverIP = await tools.getServerIP()

  let e = new Error();
  let frame = e.stack.split("\n")[3] || e.stack.split("\n")[2]// change to 3 for grandparent func
  let lineNumber = frame.split(":").reverse()[1];
  let functionName = frame.split(" ")[6];
  let fileName = frame.split(" ")[7];
  //The function catches the error, logs it in the database, 
  //and returns a response to the client with the error code, message, and HTTP status code.
  if(ticket != ""){
    db.error_log({ //async
      clientIP:clientIP, 
      req_url:req.url,
      req_params:req.params,
      req_body:req.body,
      serverIP:serverIP, 
      statusCode:statusCode, 
      bodyCode:code, 
      message:message, 
      file:fileName, 
      line:lineNumber, 
      func:functionName,
      ticket:ticket
    })
  }
  return res.status(statusCode).json({
    code: code,
    message: message,
    ticket: ticket
  });
}catch(E){
  try{
    let e = new Error();
    let frame = e.stack.split("\n")[3]; // change to 3 for grandparent func
    let lineNumber = frame.split(":").reverse()[1];
    let functionName = frame.split(" ")[6];
    let fileName = frame.split(" ")[7];
    db.LOG({ //async
      statusCode:555, 
      bodyCode:555, 
      message:"CRITICAL ERROR : in catchAndRes", 
      file:fileName, 
      line:lineNumber, 
      func:functionName
    })
  } catch(E){
    return res.status(666).json({
      code: 666,
      message: "REAL CRITICAL ERROR : in catchAndRes",
    });
  }
  return res.status(555).json({
    code: 555,
    message: "CRITICAL ERROR : in catchAndRes",
  });
} 
}

//HTTPS STATUS 200
//code : 
//The third function named successRes is responsible for returning a successful response to the client 
//with an HTTP status code of 200
const successRes = (res, bodyCode, message, data, info) =>{ // 순위 {res} / (message) / (bodyCode) / (data)
try{

  let args = []
  
  for(var i in arguments){
    args.push(arguments[i])
  }
  if(arguments.length == 3){ // res, bodyCode, message
    bodyCode = args[1];
    message =  args[2];
  } else if(arguments.length == 2){ // res, message
    bodyCode = 200;
    message = args[1];
  } else if(arguments.length == 1){ // res
    bodyCode = 200;
    message = "No message"
  }

  if(typeof bodyCode == "undefined") bodyCode = 200
  if(typeof message == "undefined") message = "Success"
  
  let result = {
    code: bodyCode,
    message: message,
  }

  if(typeof data != "undefined"){
    result.data = data
  }

  if(typeof info != "undefined"){
    result.info = info
  }

  return res.status(200).json(result); 
} catch (E){
  return res.status(544).json({
    code : 544,
    message : "CRITICAL ERROR : in successRes"
  }); 
}
}

function isInt(value) {
  var x;
  ret = isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x);
  if(ret == false) {
    return Number.isInteger(value)
  } else {
    return true
  }
  
}

//The getTicket function ensures that each request made to the API has a unique ticket number, 
//which can be used for tracking and monitoring purposes.
const getTicket = () => {
  ret = Math.floor(new Date().getTime());
  max        = Math.pow(10, 11);
  var min    = max/10; // Math.pow(10, n) basically
  var number = Math.floor( Math.random() * (max - min + 1) ) + min;
  let pin10 = ("" + number).substring(1); 
  ret += pin10
  return ret
}


module.exports = {
  throwErr,catchAndRes,successRes,getTicket
}