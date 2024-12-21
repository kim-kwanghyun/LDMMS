const express = require('express');
const router = express.Router();
const path = require('path');

const multer = require('multer');
const app = express();

const fs = require("fs");
const crypto = require('crypto');

const controller = require('./mgtController.js');

// 전처리
router.use(async (req, res, next) => {
    next();
});
router.route('/email').get(controller.email);
router.route('/email_contents').get(controller.email_contents);
router.route('/emailformat').get(controller.emailformat);

module.exports = router;
