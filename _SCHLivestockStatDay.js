const cron = require('node-cron');
const axios = require('axios');
const mysql = require('mysql2');
const xml2js = require('xml2js');

const db1  = require('./utils/database2')

// MySQL 연결 설정
const db = mysql.createConnection({
    host: '14.63.227.88',
    user: 'conpower_user',
    password: 'P0ck3t72@',
    database: 'LDMMS'
});

// MySQL 연결
db.connect((err) => {
    if (err) {
        console.error('MySQL 연결 오류:', err);
        return;
    }
    console.log('MySQL에 연결되었습니다.');
});


// 스케줄러 설정: 매시간마다 실행 (cron format: '*/1 * * * *')
cron.schedule('0 * * * *', () => {
    console.log('API 호출 시작...');
    //fetchDataAndSaveToDB();
    fetchRawDataAndSaveToDB();
});


// 테스트데이터생성
async function fetchRawDataAndSaveToDB() {
    var retObject = new Object();
    try {
        
        var aaa  = getDate();

        var rows = await db1.select_sum_stat_hour_livestock(aaa.yyyymmddhh_1)
        console.log(JSON.stringify(rows))
        retObject.data = rows;
        rows[0].rcvday = aaa.yyyymmdd;
        rows[0].rcvhour = aaa.hours;
        rows[0].crdt_id = 'scheduler';

        var rows = await db1.insert_stat_hour_livestock(rows[0])
     
    } catch (error) {
        console.error('API 호출 오류:', error);
    }
}

function getDate(){
    var aaa = new Object();
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 해줍니다.
    const day = String(today.getDate()).padStart(2, '0');
    const hours = String(today.getHours()).padStart(2, '0');
    const minute = String(today.getMinutes());

    const yyyymmdd = `${year}${month}${day}`;
    aaa.yyyymm = `${year}${month}`;
    aaa.yyyymmdd = `${year}${month}${day}`;
    aaa.yyyymmddhh = `${year}${month}${day}${hours}`;
    aaa.yyyymmddhh_1 = `${year}${month}${day}${hours-1}`;
    aaa.day = day;
    aaa.hours = hours;
    aaa.minute = minute;

   return aaa;
}