const express = require('express');
const router = express.Router();
const path = require('path');

const multer = require('multer');
const app = express();

const fs = require("fs");

const controller = require('./notationController.js');

// 전처리
router.use(async (req, res, next) => {
    next();
});
router.route('/').get(controller.login);
router.route('/login').get(controller.login);
router.route('/checkLogIn').post(controller.checkLogIn);

router.route('/notation_complete').get(controller.notation_complete);

router.route('/index').get(controller.notation_list);
router.route('/notation_list').get(controller.notation_list);
router.route('/notation_alllist').get(controller.notation_alllist);
router.route('/notation_view').get(controller.notation_view);

router.route('/setnotation').get(controller.setnotation);
router.route('/callNotation').get(controller.callNotation);


router.route('/info').get(controller.info);
router.route('/transfer').get(controller.transfer);
router.route('/uploadipfs').get(controller.uploadipfs);

router.route('/mintFile').get(controller.mintFile);



async function runSQL(sql_insert) {
  try {
    let rows = await global.mysqlPool.query(sql_insert);
    console.log(JSON.stringify(rows));
    return "success";
    // Process rows here
} catch (error) {
    console.error(error);
    return "DB Error"; // Or handle the error in another appropriate way
}
}
module.exports = router;
