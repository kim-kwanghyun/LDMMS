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

//const { attachPaginate } = require("knex-paginate");
//attachPaginate();
// const result = await knex('persons')
//    .paginate({ perPage: 10, currentPage: 2 });


exports.abnormal1 = async function () {
    // Step 1: weight_diff
    const weightDiff = knex
      .select(
        'w.tagnum',
        'w.gwid',
        'w.devid',        
        'w.rcvtime',
        'w.weight',
        knex.raw('LAG(w.weight) OVER (PARTITION BY w.tagnum ORDER BY w.rcvtime) AS prev_weight')
      )
      .from('tb_weight AS w');

    // Step 2: increase_rate
    const increaseRate = knex
      .select(
        'wd.tagnum',
        'wd.gwid',
        'wd.devid',
        'wd.rcvtime',
        'wd.weight',
        'wd.prev_weight',
        knex.raw(`
          CASE 
            WHEN wd.prev_weight IS NOT NULL 
              AND (wd.weight / wd.prev_weight - 1) < 0.03 THEN 1
            ELSE 0
          END AS below_3_percent_increase
        `)
      )
      .from(weightDiff.as('wd'));

    // Step 3: consecutive_days
    const consecutiveDays = knex
      .select(
        'ir.tagnum',
        'ir.gwid',
        'ir.devid',
        'ir.rcvtime',
        'ir.below_3_percent_increase',
        knex.raw(`
          ROW_NUMBER() OVER (PARTITION BY ir.tagnum ORDER BY ir.rcvtime) - 
          ROW_NUMBER() OVER (PARTITION BY ir.tagnum, ir.below_3_percent_increase ORDER BY ir.rcvtime) AS group_id
        `)
      )
      .from(increaseRate.as('ir'))
      .where('ir.below_3_percent_increase', 1);

    // Step 4: consecutive_counts
    const consecutiveCounts = knex
      .select('cd.tagnum', 'cd.gwid',
        'cd.devid','cd.group_id', knex.raw('COUNT(*) AS consecutive_days'))
      .from(consecutiveDays.as('cd'))
      .groupBy('cd.tagnum', 'cd.group_id');

    // Step 5: event_dates
    const eventDates = knex
      .select('cc.tagnum','cc.gwid',
        'cc.devid' , 'tw.rcvtime', 'cc.consecutive_days')
      .from(consecutiveCounts.as('cc'))
      .join('tb_weight AS tw', 'cc.tagnum', 'tw.tagnum')
      .where('cc.consecutive_days', '>=', 3);

    // Final query
    const result = await knex
      .select('ed.tagnum', 'ed.rcvtime', 'ed.gwid',
        'ed.devid')
      .from(eventDates.as('ed'))
      .distinct()
      .orderBy(['ed.rcvtime', 'ed.tagnum']);

 console.log(result);


  // var result = new Object();
  return result;
};


exports.abnormal2 = async function () {
   // Step 1: gwid_avg_weight
   const gwidAvgWeight = knex('livestock')
   .select('gwid')
   .avg('livestock_last_weight as avg_weight')
   .groupBy('gwid')
   .as('gwid_avg_weight');

 // Step 2: low_weight_animals
 const lowWeightAnimals = knex
   .select(
     'l.tagnum',
     'l.gwid',
     'l.livestock_last_weight',
     'g.avg_weight',
     knex.raw(`
       CASE
         WHEN l.livestock_last_weight <= g.avg_weight * 0.1 THEN '10% 이하'
         WHEN l.livestock_last_weight <= g.avg_weight * 0.2 THEN '20% 이하'
         ELSE '기타'
       END AS weight_category
     `)
   )
   .from('livestock AS l')
   .join(gwidAvgWeight.as('g'), 'l.gwid', 'g.gwid')
   .as('low_weight_animals');

 // Step 3: 최종 결과
 const result = await knex
   .select(
     'tagnum',
     'gwid',
     'livestock_last_weight',
     'avg_weight',
     'weight_category'
   )
   .from(lowWeightAnimals)
   .whereIn('weight_category', ['10% 이하', '20% 이하'])
   .orderBy(['gwid', 'weight_category']);

console.log(result);


// var result = new Object();
return result;
};



exports.abnormal3 = async function () {
   // Step 1: gwid_avg_eatfeed
   const gwidAvgEatfeed = knex('tb_water')
   .select('gwid')
   .avg('eatfeed AS avg_eatfeed')
   .groupBy('gwid')
   .as('gwid_avg_eatfeed');

 // Step 2: low_eatfeed_animals
 const lowEatfeedAnimals = knex
   .select(
     't.tagnum',
     't.gwid',
     't.rcvtime',
     't.eatfeed',
     'g.avg_eatfeed',
     knex.raw(`
       CASE
         WHEN t.eatfeed <= g.avg_eatfeed * 0.1 THEN '10% 이하'
         WHEN t.eatfeed <= g.avg_eatfeed * 0.2 THEN '20% 이하'
         ELSE NULL
       END AS eatfeed_category
     `)
   )
   .from('tb_water AS t')
   .join(gwidAvgEatfeed.as('g'), 't.gwid', 'g.gwid')
   .as('low_eatfeed_animals');

 // Step 3: 최종 결과
 const result = await knex
   .select(
     'tagnum',
     'gwid',
     'rcvtime',
     'eatfeed',
     'avg_eatfeed',
     'eatfeed_category'
   )
   .from(lowEatfeedAnimals)
   .whereNotNull('eatfeed_category')
   .orderBy([{ column: 'gwid' }, { column: 'eatfeed_category' }, { column: 'rcvtime' }]);


console.log(result);


// var result = new Object();
return result;
};



exports.abnormal4 = async function () {
    // Query to fetch records where temp >= 35 or temp <= 0
    const result = await knex('tb_env')
      .select('gwid', 'rcvtime', 'temp')
      .where('temp', '>=', 35)
      .orWhere('temp', '<=', 0)
      .orderBy('rcvtime');
  console.log(result);


  // var result = new Object();
  return result;
};

exports.abnormal5 = async function () {
   // Step 1: abnormal_humidity
   const abnormalHumidity = knex('tb_env')
   .select(
     'gwid',
     'rcvtime',
     'humi',
     knex.raw('DATE(rcvtime) AS date')
   )
   .where('humi', '>=', 80)
   .orWhere('humi', '<=', 20)
   .as('abnormal_humidity');

 // Step 2: consecutive_days
 const consecutiveDays = knex
   .select(
     'gwid',
     'date',
     'humi',
     knex.raw(`
       ROW_NUMBER() OVER (PARTITION BY gwid ORDER BY date) - 
       ROW_NUMBER() OVER (PARTITION BY gwid, humi ORDER BY date) AS group_id
     `)
   )
   .from(abnormalHumidity)
   .as('consecutive_days');

 // Step 3: grouped_days
 const groupedDays = knex
   .select(
     'gwid',
     'group_id',
     knex.raw('COUNT(DISTINCT date) AS consecutive_days'),
     knex.raw('MIN(date) AS start_date'),
     knex.raw('MAX(date) AS end_date')
   )
   .from(consecutiveDays)
   .groupBy('gwid', 'group_id')
   .as('grouped_days');

 // Step 4: result
 const result = knex
   .select(
     'ad.gwid',
     'ad.rcvtime',
     'ad.humi'
   )
   .from(abnormalHumidity.as('ad'))
   .join(groupedDays.as('gd'), 'ad.gwid', 'gd.gwid')
   .where('gd.consecutive_days', '>=', 3)
   .as('result');

 // Step 5: 최종 쿼리
 const finalQuery = await knex
   .select('gwid', 'rcvtime', 'humi')
   .from(result)
   .distinct()
   .orderBy([{ column: 'gwid' }, { column: 'rcvtime' }]);

  console.log(finalQuery);


// var result = new Object();
return result;
};



exports.abnormal6 = async function (type, co2,nh3 ) {
    // Query to fetch records where temp >= 35 or temp <= 0

    var result = "";
    if(type == "co2"){
      result = await knex('tb_env')
      .select('gwid', 'rcvtime', 'temp', 'humi', 'co2', 'nh3')
      .where('co2', '>=', co2)
      .orderBy('rcvtime');
    }else if(type == "nh3"){
      result = await knex('tb_env')
      .select('gwid', 'rcvtime', 'temp', 'humi', 'co2', 'nh3')
      .where('nh3', '>=', nh3)
      .orderBy('rcvtime');
    }else if(type == "co2nh3"){
      result = await knex('tb_env')
      .select('gwid', 'rcvtime', 'temp', 'humi', 'co2', 'nh3')
      .where('co2', '>=', co2)
      .andWhere('nh3', '>=', nh3)
      .orderBy('rcvtime');
    }

  console.log(result);

// var result = new Object();
return result;
};
