const express = require('express');
const router = express.Router();
const path = require('path');

const multer = require('multer');
const app = express();

const fs = require("fs");
const crypto = require('crypto');

const controller = require('./donbangController.js');

// 전처리
router.use(async (req, res, next) => {
    next();
});
router.route('/').get(controller.dash);
router.route('/donbanglist').get(controller.donbanglist);
router.route('/donlist').get(controller.donlist);
router.route('/senserlist').get(controller.senserlist);
router.route('/donbang_insert').get(controller.donbang_insert);
router.route('/senser_insert').get(controller.senser_insert);
router.route('/don_insert').get(controller.don_insert);
router.route('/dash').get(controller.dash);

router.route('/Ajaxdonbang_insert').post(controller.Ajaxdonbang_insert);
router.route('/Ajaxdon_insert').post(controller.Ajaxdon_insert);
router.route('/AjaxMemberUpdate').post(controller.AjaxMemberUpdate);

router.route('/livestock_info').get(controller.livestock_info);



module.exports = router;
