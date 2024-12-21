//https://devhints.io/knex
const mysql = require("mysql2/promise");
//const config = require("../config/config");

const db = {
  host: "14.63.227.88",
  port: 3306,
  user: "conpower_user",
  password: "P0ck3t72@",
  database: "LDMMS",
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
}


//connecting the database.
const knexConfig = {
  client: "mysql2",
  connection: db,
  debug: false,
  pool: {
    max: 100,
  },
  acquireConnectionTimeout: 60000,
};
const knex = require("knex")(knexConfig);

const { attachPaginate } = require("knex-paginate");
attachPaginate();
// const result = await knex('persons')
//    .paginate({ perPage: 10, currentPage: 2 });

exports.user_post = async function (insert) {
  ret = await knex("dummy_user").insert(insert);
  return ret;
};

exports.user_delete = async function (memberId) {
  ret = await knex("dummy_user").delete().where("id", memberId);
  return ret;
};

exports.user_get = async function (memberId, currentPage, perPage) {
  if (memberId) {
    ret = await knex("dummy_user").where("id", memberId);
  } else {
    ret = await knex("dummy_user").paginate({
      currentPage: currentPage,
      perPage: perPage,
      isLengthAware: true,
    });
  }
  return ret;
};

exports.approve_state_get = async function () {
  ret = await knex("switch_approve");
  return ret;
};
exports.approve_state_update = async function (state) {
  ret = await knex("switch_approve").update({ approve: state });
  return ret;
};

exports.txid_get = async function (txid) {
  ret = await knex.select("*").from("txid").where({
    txid: txid,
    symbol: _SYMBOL,
    network: _NETWORK,
  });
  return ret;
};

exports.user_getFreeMintingStatus = async function (id) {
  ret = await knex("dummy_user").where({ id: id });
  return ret;
};

//we update the user freeminting status whether
exports.user_updateFreeMintingStatus = async function (
  id,
  status,
  freeCount = 0
) {
  ret = await knex("dummy_user")
    .update({
      free: status,
      freeCount: freeCount,
    })
    .where({ id: id });
  return ret;
};

exports.user_updateFCM = async function (id, fcm) {
  ret = await knex("dummy_user").update({ fcm: fcm }).where({ id: id });
  return ret;
};

exports.getUserProfile = async (id) => {
  ret = await knex("dummy_user")
    .select("id", "nickName", "profile")
    .where("id", id);
    console.log("ret:"+ret)
  return ret;
};


exports.getLog = async (where) => {
  ret = await knex("error_log").where(where);
  return ret;
};

exports.putUserProfile = async (id, update) => {
  ret = await knex("dummy_user").update(update).where("id", id);
  return ret;
};


exports.switch_status = async function () {
  const [result] = await knex("switch_approve").select("approve");
  return result.approve;
};


//logs error
exports.error_log = async function (insertJSON) {
  ret = await knex("error_log").insert(insertJSON);
  return ret;
};


exports.getDonBangList = async function (member_id) { 

  ret = await  knex('livestock_room as a')
  .select('*')
  .select( knex.raw('DATE_FORMAT(crdt_date, "%Y-%m-%d") AS CRDT_DATE'))
  .select(knex.raw('(SELECT COUNT(*) FROM livestock WHERE gwid = a.gwid) as livestock_cnt'))
  .where('a.member_id', member_id)

  return ret;
};


exports.getDonList = async function (gwid) {
  ret = await knex.select("*").from("livestock").where("gwid",gwid); 
    //knex.raw('DATE_FORMAT(crdt_date, "%Y%m%d%H") AS formatted_datetime'),"*").from("livestock_room");
  return ret;
};
exports.getSensorList = async function (gwid) {
  ret = await  knex('sensor as a')
  .select('a.*')
  .select(knex.raw('(SELECT cd_type_desc FROM tbl_cd_val WHERE cd_id = "sensor_type" and cd_type = a.sensor_type) as SENSOR_TYPE'))
  .select(knex.raw('(SELECT livestock_room_nm FROM livestock_room WHERE gwid = a.gwid) as livestock_room_nm'))
  .select( knex.raw('DATE_FORMAT(crdt_date, "%Y-%m-%d") AS CRDT_DATE'))
  .where("gwid",gwid); 
   
  return ret;
};


exports.insertDonBang = async function (insert) {
  ret = await knex("livestock_room").insert(insert);
  return ret;
};
exports.insertDon = async function (insert) {
  ret = await knex("livestock").insert(insert);
  return ret;
};

exports.updatetDonBang = async function (id, update) {
  ret = await knex("livestock_room").update(update).where("id", id);
  return ret;
};
/***
 * 시세
 */
exports.getLiveStockPriceList = async function (livestock_type) {
  var ret = await knex.select("*").from("livestock_price")
  .where("livestock_type",livestock_type)
  .orderBy("month");
  
  let price = ret.map(row => row.price);    
  let month = ret.map(row => row.month);
  let year = ret.map(row => row.year);
  return {
      all: ret,
      price: JSON.stringify(price),     
      month: JSON.stringify(month),
      year: JSON.stringify(year)
  };
};
/***
 * 평균 돈의 무게 조회
 * select AVG(weight) as weight, rcvtime from tb_weight group by rcvtime, gwid
 */
exports.get_avg_weight = async function ( strday,endday) {
  var ret = await knex("tb_weight").select(
     'devid', 'gwid',
     knex.raw('AVG(weight) as weight'), 'rcvtime')
     .where(knex.raw("rcvtime"), '>=', knex.raw('?', [strday]))
     .where(knex.raw("rcvtime"), '<=', knex.raw('?', [endday]))
    // .orderBy("rcvtime");
     .groupBy("rcvtime",  "gwid");

    let rcvtime = ret.map(row => row.rcvtime);  
    let weight = ret.map(row => row.weight);
    return {
        all: ret,
        rcvtime: (rcvtime),
        weight: (weight)
    };
 };

/***
 * 축사의 사육가축정보
 */
exports.getLiveStockList = async function (gwid) {
  ret = await knex.select("*").from("livestock").where("gwid",gwid).orderBy("livestock_type", "month");
  return ret;
};

exports.insert_stat_minute_livestock = async function (insert) {
  ret = await knex("stat_minute_livestock").insert(insert);
  return ret;
};

exports.insert_stat_hour_livestock = async function (insert) {
  ret = await knex("stat_hour_livestock").insert(insert);
  return ret;
};

exports.insert_stat_day_livestock = async function (insert) {
  ret = await knex("stat_day_livestock").insert(insert);
  return ret;
};

exports.insert_stat_month_livestock = async function (insert) {
  ret = await knex("stat_month_livestock").insert(insert);
  return ret;
};

exports.insert_stat_month_livestock = async function (insert) {
  ret = await knex("stat_month_livestock").insert(insert);
  return ret;
};
exports.select_bbs_all = async function () {
  //var ret = await knex.select("*").from("bbs");
  var ret = await knex('bbs').select(
    knex.raw('DATE_FORMAT(crdt_date, "%Y-%m-%d-%H") AS CRDT_DATE'),
    knex.raw('DATE_FORMAT(mdfy_date, "%Y-%m-%d-%H") AS MDFY_DATE')
    ,"bbs_seq","title","contents","reply","reply_id","mdfy_id","mdfy_date","crdt_id").orderBy('mdfy_date','desc');
  return ret;
}
exports.select_bbs_detail = async function (bbs_seq) {
  var ret = await knex.select("*").from("bbs").where("bbs_seq", bbs_seq);
  return ret;
}
exports.insert_bbs = async function (insert) {
  ret = await knex("bbs").insert(insert);
  return ret;
};

exports.update_bbs = async function (bbs_seq, reply,member_id) {
  ret = await knex("bbs").update({    
    reply:reply,mdfy_id: member_id
  }).where({bbs_seq:bbs_seq});
  return ret;
};

exports.select_calender = async function (bbs_seq) {
  var ret = await knex.select("*").from("calender");
  
  const events = await knex('calender')
  .select('id', 'title', 'start_date', 'end_date', 'url')
  .whereNotNull('start_date');  // start_date가 NULL이 아닌 데이터만 가져옴

  const formattedEvents = events.map(event => {
    // 기본적인 구조로 변환
    let formattedEvent = {
      id: event.id,
      title: event.title,
      //start: event.start_date.toISOString().split('T')[0],  // 'YYYY-MM-DD' 형식으로 변환
      start:event.start_date
    };
  
    // end_date가 존재하는 경우 추가
    if (event.end_date) {
      //formattedEvent.end = event.end_date.toISOString().split('T')[0];
      formattedEvent.end = event.end_date;
    }
  
    // URL이 존재하는 경우 추가
    if (event.url) {
      formattedEvent.url = event.url;
    }
    console.log("formattedEvent:"+JSON.stringify(formattedEvent))
    return formattedEvent;
  });

  return formattedEvents

  //return ret;
}

exports.insert_calender = async function (insert) {
  ret = await knex("calender").insert(insert);
  return ret;
};

exports.update_calender = async function (update) {
  ret = await knex("calender").update({    
    title:update.title,
    start:update.start,
    end:update.end,
    url:update.url
    }).where({id:update.id});
  return ret;
};

exports.delete_calender = async function (id) {
  ret = await knex("calender").delete().where("id", id);
  return ret;
};

exports.select_feed_all = async function () {
  //var ret = await knex.select("*").from("bbs");
  var ret = await knex('feed').select(
    knex.raw('DATE_FORMAT(crdt_date, "%Y-%m-%d-%H") AS CRDT_DATE'),
    knex.raw('DATE_FORMAT(mdfy_date, "%Y-%m-%d-%H") AS MDFY_DATE')
    ,"feed_stock_seq","cum_weight","use_weight","remaind","feed_model","livestock_type","crdt_id").orderBy('crdt_date','desc');
  return ret;
}
exports.select_feed_trans_all = async function () {
  //var ret = await knex.select("*").from("bbs");
  var ret = await knex('feed_trans').select(
    knex.raw('DATE_FORMAT(crdt_date, "%Y-%m-%d-%H") AS CRDT_DATE')
    ,"feed_trans_seq","feed_model","feed_stock_type","amount","crdt_id").orderBy('crdt_date');
  return ret;
}

exports.insert_FeedTrans = async function (insert) {
  ret = await knex("feed_trans").insert(insert);
  return ret;
};

/***
 * 코드테이블에서 cd_id 을 조회
 */
exports.select_code = async function (cd_id) {
  var ret = await knex.select("*").from("tbl_cd_val").where("cd_id", cd_id);
  return ret;
}

exports.select_sum_stat_hour_livestock = async function (hour) {
 var ret = await knex("stat_minute_livestock").select(
    'stat_minute_seq',
    'devid',
    'gwid',
    'tagnum',
    'mngnum',
    //knex.raw('SUM(eatfeed) AS eatfeed'),
    //knex.raw('SUM(eatwater) AS eatwater'),
    knex.raw('AVG(temp) AS temp'),
    knex.raw('MIN(temp) AS temp_min'),
    knex.raw('MAX(temp) AS temp_max'),
    knex.raw('AVG(humi) AS humi'),
    knex.raw('MIN(humi) AS humi_min'),
    knex.raw('MAX(humi) AS humi_max'),
    knex.raw('SUM(co2) AS co2'),
    knex.raw('MIN(co2) AS co2_min'),
    knex.raw('MAX(co2) AS co2_max'),
    knex.raw('SUM(nh3) AS nh3'),
    knex.raw('MIN(nh3) AS nh3_min'),
    knex.raw('MAX(nh3) AS nh3_max'),
    knex.raw('SUM(h2s) AS h2s'),
    knex.raw('MIN(h2s) AS h2s_min'),
    knex.raw('MAX(h2s) AS h2s_max'))
    .where('rcvdayhour', '=', hour)
    .groupBy('devid', 'rcvdayhour');
    
    return ret;
};

/***
 * 돈수
 */
exports.getCountLivestock = async function (member_id) {
  var ret = await knex('livestock')
  .select(knex.raw('count(tagnum) AS cnt'))
  .where('member_id', member_id)  
  return ret;
 };


/***
 * 개별 평균 몸무제
 */
exports.getAVGweight = async function (member_id,gwid) {
  var ret = await knex('tb_weight')
  .select('tagnum', 'weight')
  .where('gwid',gwid)
  .where('rcvtime', knex('tb_weight').max('rcvtime')) // 서브쿼리로 MAX(rcvtime) 조건 추가
  .groupBy('tagnum')     
  return ret;
 };

 exports.getAllAVGweight = async function (member_id) {
  var ret = await knex('tb_weight')
  .select('tagnum')
  .avg('weight as AVG')
  .where('rcvtime', knex('tb_weight').max('rcvtime')) // 서브쿼리로 MAX(rcvtime) 조건 추가
  .groupBy('tagnum')
     
     return ret;
 };


exports.select_sum_stat_day_livestock = async function (day) {
  var ret = await knex("stat_hour_livestock").select(
    'stat_hour_seq',
     'devid',
     'gwid',
     'tagnum',
     'mngnum',
     //knex.raw('AVG(eatfeed) AS eatfeed'),
     //knex.raw('AVG(eatwater) AS eatwater'),
     knex.raw('AVG(temp) AS temp'),
     knex.raw('MIN(temp) AS temp_min'),
     knex.raw('MAX(temp) AS temp_max'),
     knex.raw('AVG(humi) AS humi'),
     knex.raw('MAX(humi) AS humi_max'),
     knex.raw('MIN(humi) AS humi_min'),
     knex.raw('AVG(co2) AS co2'),
     knex.raw('MAX(co2) AS co2_max'),
     knex.raw('MIN(co2) AS co2_min'),     
     knex.raw('AVG(nh3) AS nh3'),
     knex.raw('MAX(nh3) AS nh3_max'),
     knex.raw('MIN(nh3) AS nh3_min'),
     knex.raw('AVG(h2s) AS h2s'),
     knex.raw('MAX(h2s) AS h2s_max'),
     knex.raw('MIN(h2s) AS h2s_min'))
     .where('rcvday', '=', day)
     .groupBy('devid', 'rcvday');
     
     return ret;
 };

 
exports.select_sum_stat_month_livestock = async function (day) {
  var ret = await knex("stat_day_livestock").select(
    'stat_day_seq',
     'devid',
     'gwid',
     'tagnum',
     'mngnum',
     knex.raw('AVG(temp) AS temp'),
     knex.raw('MIN(temp) AS temp_min'),
     knex.raw('MAX(temp) AS temp_max'),
     knex.raw('AVG(humi) AS humi'),
     knex.raw('MAX(humi) AS humi_max'),
     knex.raw('MIN(humi) AS humi_min'),
     knex.raw('AVG(co2) AS co2'),
     knex.raw('MAX(co2) AS co2_max'),
     knex.raw('MIN(co2) AS co2_min'),     
     knex.raw('AVG(nh3) AS nh3'),
     knex.raw('MAX(nh3) AS nh3_max'),
     knex.raw('MIN(nh3) AS nh3_min'),
     knex.raw('AVG(h2s) AS h2s'),
     knex.raw('MAX(h2s) AS h2s_max'),
     knex.raw('MIN(h2s) AS h2s_min'))
     .where('rcvmonth', '=', day)
     .groupBy('devid', 'rcvmonth');
     
     return ret;
 };
 /***
  * 환경
  */
 exports.get_feed_stat_hour = async function (gwid,strday,strhour,endday,endhour) {
  var ret = await knex("tb_env").select('tb_env_seq', 'devid',  'gwid',  'rcvtime',  'time',
     knex.raw('temp'),     knex.raw('humi'),     knex.raw('co2'),     knex.raw('nh3'),
    'crdt_date')
    .where(knex.raw("datetime"), '>=', `${strday} ${strhour}`)
    .andWhere(knex.raw("datetime"), '<=', `${endday} ${endhour}`)
    .andWhere("gwid", gwid);

    let rcvdayArray = ret.map(row => row.rcvtime);    
    let tempArray = ret.map(row => row.temp);
    let humiArray = ret.map(row => row.humi);
    let co2Array = ret.map(row => row.co2);
    let nh3Array = ret.map(row => row.nh3);
    //console.log("ret:" + JSON.stringify(ret))
    //console.log("rcvdayArray:" + JSON.stringify(rcvdayArray))
    //console.log("tempArray:" + JSON.stringify(tempArray))
    return {
        all:ret,
        rcvday:rcvdayArray,
        temp: tempArray,
        humi: humiArray,
        co2: co2Array,
        nh3: nh3Array
    };
 };

 exports.get_feed_per_hour = async function (strday,strhour,endday,endhour) {
  var ret = await knex("stat_per_hour_livestock").select(
     'devid',
     'gwid',
     'tagnum',
     'mngnum',
     knex.raw('eatfeed'),
     knex.raw('eatwater'),
     knex.raw('weight'),
    'rcvday',
    'rcvhour')
     .where(knex.raw("CONCAT(rcvday, rcvhour)"), '>=', knex.raw('?', [strday + strhour]))
     .where(knex.raw("CONCAT(rcvday, rcvhour)"), '<=', knex.raw('?', [endday + endhour]));

    let rcvdayArray = ret.map(row => row.rcvday);    
    let eatfeedArray = ret.map(row => row.eatfeed);
    let eatwaterArray = ret.map(row => row.eatwater);
    let weightArray = ret.map(row => row.weight);

    return {
        all:ret,
        rcvday:rcvdayArray,
        eatfeed: eatfeedArray,
        eatwater: eatwaterArray,
        weight: weightArray
    };

 };
/***
 * 개별 돈의 무게 조회
 */
 exports.get_feed_per_livestock_hour = async function (tagnum, strday,endday) {
  var ret = await knex("tb_weight").select(
    'tb_weight_seq',
     'devid',
     'gwid',
     'tagnum',
     knex.raw('weight'),
    'rcvtime',
    'crdt_date')
    .where("tagnum", tagnum)
     .where(knex.raw("rcvtime"), '>=', knex.raw('?', [strday]))
     .where(knex.raw("rcvtime"), '<=', knex.raw('?', [endday]));

    let rcvdayArray = ret.map(row => row.rcvtime);  
    let weightArray = ret.map(row => row.weight);

    return {
        all:ret,
        rcvday:rcvdayArray,
        weight: weightArray
    };
 };

 

 
 
 /***
  * 돈 목록 조회
  */
 exports.get_perlivestock = async function (member_id) {
  var ret = await knex("livestock").select("*").where("member_id", member_id);
  return ret;
 };

 exports.get_livestock = async function (member_id,gwid) {
  //0: 등록, 1: 입고, 2: 출고, 3: 판매
  var ret = await knex("livestock").select(
    "*",
    knex.raw('DATE_FORMAT(crdt_date, "%Y-%m-%d-%H") AS CRDT_DATE')
  )
  .where("member_id", member_id)
  //.where("status", 1)
  .where("gwid", gwid)
  .orderBy("gwid");//. groupBy("gwid");
  return ret;
 };

 
/***
  * 돈 입출고 내역 조회
  */
exports.get_livestock_trans = async function (livestock_seq) {

  const result = await knex("livestock_trans as lt")
  .join("livestock as ot", "lt.livestock_seq", "ot.livestock_seq")
  .select("ot.mngnum", 
    "ot.gwid",
    "ot.tagnum",
    "ot.livestock_last_weight",
    "lt.livestock_trans_seq",
     "lt.livestock_seq",
      "lt.status",
       "lt.crdt_date",
       knex.raw('DATE_FORMAT(lt.crdt_date, "%Y-%m-%d-%H") AS CRDT_DATE'))
    .where("lt.livestock_seq", livestock_seq)
    .orderBy("lt.crdt_date","desc");

  return result;
 };

 exports.get_livestock = async function (member_id,gwid) {
  //0: 등록, 1: 입고, 2: 출고, 3: 판매
  var ret = await knex("livestock").select(
    "*",
    knex.raw('DATE_FORMAT(crdt_date, "%Y-%m-%d-%H") AS CRDT_DATE')
  )
  .where("member_id", member_id)
  //.where("status", 1)
  .where("gwid", gwid)
  .orderBy("gwid");//. groupBy("gwid");
  return ret;
 };


 exports.set_outlivestock = async function (livestock_seq,status) {
  var ret = await knex("livestock").update({ status: state }).where("livestock_seq", livestock_seq);

  var ret = await knex("livestock_trans").insert({
    livestock_seq: livestock_seq, 
    status:status});
  
  return ret;
 };
 /*************
  * 돈 
  * ********** */
 exports.insert_per_minute_livestock = async function (insert, weight_plus) {  
  const previousWeight = await knex('stat_per_minute_livestock')
      .select('weight').where('tagnum', insert.tagnum)
      .orderBy('stat_per_minute_seq', 'desc')
      .first();

      insert.weight = Number(Number(previousWeight.weight) + Number(weight_plus/8000)); 

  ret = await knex("stat_per_minute_livestock") .insert(insert)
  return ret;  
};


exports.select_sum_per_hour_livestock = async function (hour) {
  var ret = await knex("stat_per_minute_livestock").select(
     'stat_per_minute_seq',
     'devid',
     'gwid',
     'tagnum',
     'mngnum',
     knex.raw('AVG(eatfeed) AS eatfeed'),
     knex.raw('AVG(eatwater) AS eatwater'),
     knex.raw('AVG(weight) AS weight')
    )
     .where('rcvdayhour', '=', hour)
     .groupBy('devid', 'rcvdayhour');
     
     return ret;
 };
 
 exports.select_sum_per_day_livestock = async function (day) {
   var ret = await knex("stat_per_hour_livestock").select(
     'stat_per_hour_seq',
      'devid',
      'gwid',
      'tagnum',
      'mngnum',
      knex.raw('AVG(eatfeed) AS eatfeed'),
      knex.raw('AVG(eatwater) AS eatwater'),
      knex.raw('AVG(weight) AS weight'))
      .where('rcvday', '=', day)
      .groupBy('devid', 'rcvday');
      
      return ret;
  };
 
  
 exports.select_sum_per_month_livestock = async function (day) {
   var ret = await knex("stat_per_day_livestock").select(
     'stat_per_day_seq',
      'devid',
      'gwid',
      'tagnum',
      'mngnum',
      knex.raw('AVG(eatfeed) AS eatfeed'),
      knex.raw('AVG(eatwater) AS eatwater'),
      knex.raw('AVG(weight) AS weight'))
      .where('rcvmonth', '=', day)
      .groupBy('devid', 'rcvmonth');
      
      return ret;
  };
  exports.insert_per_hour_livestock = async function (insert) {
    ret = await knex("stat_per_hour_livestock").insert(insert);
    return ret;
  };
  
  exports.insert_per_day_livestock = async function (insert) {
    ret = await knex("stat_per_day_livestock").insert(insert);
    return ret;
  };
  
  exports.insert_per_month_livestock = async function (insert) {
    ret = await knex("stat_per_month_livestock").insert(insert);
    return ret;
  };

  exports.insert_member =  async function (insert) {
    ret = await knex("tbl_member").insert(insert);
    return ret;
  };

  exports.select_normal =  async function (email,gwid) {
    const query = "      SELECT "
     +" (SELECT COUNT(*) FROM abnormal1 AS a WHERE a.rcvtime = (SELECT MAX(rcvtime) FROM abnormal1) and  a.gwid="+gwid+") AS abnormal1_count, "
     +"  (SELECT COUNT(*) FROM abnormal2 AS a2 ) AS abnormal2_count, "
      +" (SELECT COUNT(*) FROM abnormal3 AS a3 WHERE a3.rcvtime = (SELECT MAX(rcvtime) FROM abnormal3) and  a3.gwid="+gwid+") AS abnormal3_count,"
      +" (SELECT COUNT(*) FROM abnormal4 AS a4 WHERE a4.rcvtime = DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s') and a4.gwid="+gwid+") AS abnormal4_count,"
      +" (SELECT COUNT(*) FROM abnormal5 AS a5 WHERE a5.rcvtime = DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s') and  a5.gwid="+gwid+") AS abnormal5_count, "       
      +" (SELECT count(tagnum) AS cnt from livestock WHERE member_id= '"+email+"' and gwid="+gwid+") AS livestock_cnt; ";
  
    ret = await knex.raw(query);
    return ret;
  };


