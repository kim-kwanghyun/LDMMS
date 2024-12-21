const express = require('express');
const router = express.Router();
const path = require('path');

const multer = require('multer');
const app = express();

const fs = require("fs");
const crypto = require('crypto');

const controller = require('./todolistController.js');

// 전처리
router.use(async (req, res, next) => {
    next();
});
router.route('/').get(controller.calender_basic);
router.route('/calender_basic').get(controller.calender_basic);
router.route('/calender_list').get(controller.calender_list);

router.route('/bbs_list').get(controller.bbs_list);
router.route('/bbs_update').get(controller.bbs_update);
router.route('/bbs_insert').get(controller.bbs_insert);
router.route('/AjaxBBSInsert').post(controller.AjaxBBSInsert);
router.route('/AjaxBBSUpdate').post(controller.AjaxBBSUpdate);

router.route('/AjaxCalenderInsert').post(controller.AjaxCalenderInsert);
router.route('/AjaxCalenderDelete').post(controller.AjaxCalenderDelete);



module.exports = router;
