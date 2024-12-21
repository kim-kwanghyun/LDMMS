const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mysql2 = require('mysql2');
const dotenv = require('dotenv');
var expressSession = require('express-session');
var serveStatic = require('serve-static');
const bodyParser = require('body-parser');
var http = require('http');
const nodemailer = require('nodemailer');
const multer = require("multer");
const fs = require("fs");
const crypto = require('crypto');
const axios = require('axios');


const app = express();

//const { host, port, user, password } = require('./config/mysql.js');
// env 설정
if (process.env.NODE_ENV === 'production') dotenv.config({ path: './.env.prod' });
if (process.env.NODE_ENV === 'development') dotenv.config({ path: './.env.dev' });
if (process.env.NODE_ENV === 'testing') dotenv.config({ path: './.env.test' });

//쿠키와 세션을 미들웨어로 등록한다
app.use(cookieParser());
app.use(
    expressSession({
        secret: 'sessionKey', //이때의 옵션은 세션에 세이브 정보를 저장할때 할때 파일을 만들꺼냐
        //아니면 미리 만들어 놓을꺼냐 등에 대한 옵션들임
        resave: true,
        saveUninitialized: true,
        //cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
    })
);

app.use(cookieParser());

app.get(function (req, res) {
    // Set cookie with SameSite='None' as needed
    res.cookie('cookie1', 'value1', { sameSite: 'none', secure: true });
    res.send(req.cookies);
    //res.end();
});

app.disable('x-powered-by');

//app.use('/upload', express.static(path.join(__dirname + 'public/upload')));
app.use(cors());


// mysql 설정
global.mysqlPool = mysql2.createPool(require('./config/mysql.js')).promise();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

logger.token('ko-time', () => new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }));
app.use(
    logger([':method', ':url', ':status', ':remote-addr', ':ko-time'].join('\t| '), {
        skip: (req) => req.originalUrl.includes('/static/') || req.originalUrl.includes('/assets/') || req.originalUrl.includes('/public/'),
    })
);

// 사용자 session setting
app.use((req, res, next) => {
    res.locals.userInfo = req.session.user;
    res.locals.socialUser = req.user;
    // console.log(res.locals);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/robots.txt', (req, res, next) => {
    res.type('text/plain');
    res.send(`
  User-agent: Googlebot
  Disallow:
  
  User-agent: Googlebot-image
  Disallow:
  `);
});

app.use('/static', express.static(path.resolve('public')));

app.use('/', require('./routes/donbang/donbangRouter.js'));
app.use('/donbang', require('./routes/donbang/donbangRouter.js'));
app.use('/user', require('./routes/user/userRouter.js'));
app.use('/feed', require('./routes/feed/feedRouter.js'));
app.use('/member', require('./routes/member/memberRouter.js'));
app.use('/perlivestock', require('./routes/perlivestock/perlivestockRouter.js'));
app.use('/todolist', require('./routes/todolist/todolistRouter.js'));
app.use('/notice', require('./routes/notice/noticeRouter.js'));
app.use('/feedstuff', require('./routes/feedstuff/feedstuffRouter.js'));
app.use('/livestock', require('./routes/livestock/livestockRouter.js'));



const imageDirectory = path.join(__dirname, 'public', 'uploads');

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
