const express = require('express');
const router = express.Router();
const path = require('path');

const multer = require('multer');
const app = express();

const fs = require("fs");
const crypto = require('crypto');

const controller = require('./payController.js');

// 전처리
router.use(async (req, res, next) => {
    next();
}); 


router.route('/pay').get(controller.pay);
router.route('/istam_pay').get(controller.istam_pay);
router.route('/istam_pay_paypal').get(controller.istam_pay_paypal);
router.route('/istam_pay_success_return').get(controller.istam_pay_success_return);
router.route('/istam_pay_fail_return').get(controller.istam_pay_fail_return);
router.route('/istam_pay_intro').get(controller.istam_pay_intro);
router.route('/pre_pay').post(controller.pre_pay);

router.route('/istam_mypay_list').get(controller.istam_mypay_list);

router.route('/googleapy_payment_callback').get(controller.googleapy_payment_callback);

router.route('/verifyPurchase').get(controller.verifyPurchase);


module.exports = router;


