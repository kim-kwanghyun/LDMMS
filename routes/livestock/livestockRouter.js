const express = require('express');
const router = express.Router();
const path = require('path');

const multer = require('multer');
const app = express();

const fs = require("fs");
const crypto = require('crypto');

const controller = require('./livestockController.js');

// 전처리
router.use(async (req, res, next) => {
    next();
});
router.route('/').get(controller.livestock);
router.route('/livestock').get(controller.livestock);
router.route('/set_outlivestock').get(controller.set_outlivestock);

router.route('/livestock_perlist').get(controller.livestock_perlist);



module.exports = router;
