const express = require('express');
const router = express.Router();
const path = require('path');

const multer = require('multer');
const app = express();

const fs = require("fs");
const crypto = require('crypto');

const controller = require('./stamoryController.js');

// 전처리
router.use(async (req, res, next) => {
    next();
}); 
router.route('/').get(controller.intro);
router.route('/home').get(controller.home);
router.route('/download').get(controller.download);
router.route('/edit').get(controller.edit);
router.route('/index').get(controller.index);

router.route('/intro').get(controller.intro);
//구매자 채팅방
router.route('/my_chat').get(controller.my_chat);
//판매자 채팅방
router.route('/my_chat_sell').get(controller.my_chat_sell);

router.route('/my_chatroomlist').get(controller.my_chatroomlist);


router.route('/my_comment').get(controller.my_comment);
router.route('/my_istam_comment').get(controller.my_istam_comment);

router.route('/my_main').get(controller.my_main);
router.route('/my_more').get(controller.my_more);

router.route('/my_reservation').get(controller.my_reservation);
router.route('/order').get(controller.order);

router.route('/email_login').get(controller.email_login);

router.route('/profile_01').get(controller.profile_01);
router.route('/profile_02').get(controller.profile_02);
router.route('/register_01').get(controller.register_01);
router.route('/register_02').get(controller.register_02);
router.route('/register_03').get(controller.register_03);

router.route('/checktempcode').post(controller.checktempcode);

router.route('/register_04').get(controller.register_04);
router.route('/regmember').post(controller.regmember);

router.route('/register_05').get(controller.register_05);
router.route('/tutorial').get(controller.tutorial);
router.route('/upload_ui').get(controller.upload_ui);
router.route('/upload').get(controller.upload);
router.route('/upload_intro').get(controller.upload_intro);

router.route('/reloadwinodw').get(controller.reloadwinodw);
router.route('/checkLogIn_istam').post(controller.checkLogIn_istam);
router.route('/getReply').post(controller.getReply);
router.route('/setlike').post(controller.setlike);
router.route('/setlikeSTAM').post(controller.setlikeSTAM);

router.route('/writeComments').post(controller.writeComments);

router.route('/updatemember_nickname').post(controller.updatemember_nickname);

router.route('/logout').get(controller.logout);
router.route('/member_reg_email_contents').get(controller.member_reg_email_contents);

router.route('/getAllChatDia').get(controller.getAllChatDia);
router.route('/setDigData').get(controller.setDigData);

router.route('/getAllSellChatDia').get(controller.getAllSellChatDia);
router.route('/setDigSellData').get(controller.setDigSellData);




router.route('/google_login').get(controller.google_login);

router.route('/afterGooglelogin').post(controller.afterGooglelogin);


module.exports = router;
