const express = require('express');
const router = express.Router();
const path = require('path');

const multer = require('multer');
const app = express();

const fs = require("fs");
const crypto = require('crypto');

const controller = require('./perlivestockController.js');

// 전처리
router.use(async (req, res, next) => {
    next();
});
router.route('/').get(controller.perlivestock_hour);
router.route('/perlivestock_hour').get(controller.perlivestock_hour);
router.route('/get_feed_per_hour').get(controller.get_feed_per_hour);
router.route('/get_feed_per_livestock_hour').get(controller.get_feed_per_livestock_hour);


router.route('/perlivestock_day').get(controller.perlivestock_day);
router.route('/perlivestock_month').get(controller.perlivestock_month);


module.exports = router;
