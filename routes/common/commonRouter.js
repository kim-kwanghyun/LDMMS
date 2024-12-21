const express = require('express');
const router = express.Router();

const controller = require('./commonController.js');

router.use(async (req, res, next) => {
    next();
});


router.route('/getMachine').get(controller.getMachine);

router.route('/getManufactor').get(controller.getManufactor);

router.route('/email_format_com').get(controller.email_format_com);




module.exports = router;
