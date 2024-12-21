const express = require('express');
const router = express.Router();

const db  = require('../../utils/database2')

/* GET ID. */
router.get('/:memberId', async function profile_get$memberId(req, res, next) {

    var retObject = new Object();
    retObject.retcode = "success";
    try{
        let memberId = req.params.memberId
        console.log("memberId:"+memberId)
        rows = await db.getUserProfile(memberId)
        if(rows.length == 0){
            retObject.retcode = "fail1";
        }else{
                
            //response.successRes(res,2002211152217,"Success",rows[0])
            retObject.data = rows;
        }
        res.json(retObject);
    } catch (E){
       // await response.catchAndRes(E, req, res, ticket)
       retObject.retcode = "fail";
       retObject.msg = E;
       res.json(retObject);
    }
});

module.exports = router;
