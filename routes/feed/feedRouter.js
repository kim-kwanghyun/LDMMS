const express = require('express');
const router = express.Router();
const path = require('path');

const multer = require('multer');
const app = express();

const fs = require("fs");
const crypto = require('crypto');

const controller = require('./feedController.js');

// 전처리
router.use(async (req, res, next) => {
    next();
});
router.route('/').get(controller.feed_stat_hour);
router.route('/feed_stat_hour').get(controller.feed_stat_hour);
router.route('/get_feed_stat_hour').get(controller.get_feed_stat_hour);

router.route('/feed_stat_day').get(controller.feed_stat_day);
router.route('/feed_stat_month').get(controller.feed_stat_month);
router.route('/index').get(controller.index);

router.route('/abnormal_donbang_info').get(controller.abnormal_donbang_info);
router.route('/abnormal_livestock_info').get(controller.abnormal_livestock_info);

router.route('/abnormal1').get(controller.abnormal1);
router.route('/abnormal2').get(controller.abnormal2);
router.route('/abnormal3').get(controller.abnormal3);
router.route('/abnormal4').get(controller.abnormal4);
router.route('/abnormal5').get(controller.abnormal5);
router.route('/abnormal6').get(controller.abnormal6);



module.exports = router;
