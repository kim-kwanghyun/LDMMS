const express = require('express');
const router = express.Router();
const path = require('path');

const multer = require('multer');
const app = express();

const fs = require("fs");
const crypto = require('crypto');

const controller = require('./feedstuffController.js');

// 전처리
router.use(async (req, res, next) => {
    next();
});
router.route('/').get(controller.feedstufflist);
router.route('/feedstufflist').get(controller.feedstufflist);
router.route('/feedstuff_insert').get(controller.feedstuff_insert);
router.route('/AjaxFeedTransInsert').post(controller.AjaxFeedTransInsert);


module.exports = router;
