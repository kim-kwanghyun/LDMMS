const express = require('express');
const router = express.Router();
const path = require('path');

const multer = require('multer');
const app = express();

const fs = require("fs");
const crypto = require('crypto');

const controller = require('./shareController.js');

// 전처리
router.use(async (req, res, next) => {
    next();
}); 

router.route('/istam_share').get(controller.istam_share);
router.route('/istam_share_email').get(controller.istam_share_email);

router.route('/request_sale').get(controller.request_sale);
router.route('/reg_sale').post(controller.reg_sale);



module.exports = router;


