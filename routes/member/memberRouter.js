const express = require('express');
const router = express.Router();
const path = require('path');

const multer = require('multer');
const app = express();

const fs = require("fs");

const controller = require('./memberController.js');

// 전처리
router.use(async (req, res, next) => {
    next();
});
router.route('/').get(controller.login);
router.route('/login').get(controller.login);
router.route('/postLogin').post(controller.postLogin);
router.route('/ajaxpostLogin').post(controller.ajaxpostLogin);
router.route('/logout').get(controller.logout);
router.route('/regmember').post(controller.regmember);


router.route('/pagesregister').get(controller.pagesregister);
router.route('/resetpassword').get(controller.resetpassword);

module.exports = router;
