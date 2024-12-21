// 필요한 모듈 가져오기
const express = require('express');
const mysql = require('mysql2');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// SQLite 메모리 모드로 DB 생성
const sqlite3_db = new sqlite3.Database(':memory:');

const CONST_DB_DATABASE="ISTAM_TEST"
const CONST_DB_HOST="211.253.30.7";
const CONST_DB_PORT=3306
const CONST_DB_USER="root"
const CONST_DB_PASSWORD='Vk6XIPZdZ9Gg'


// MySQL 연결 설정
const db = mysql.createConnection({
    host: CONST_DB_HOST,       // MySQL 서버 주소 (localhost 또는 IP 주소)
    user: CONST_DB_USER,            // MySQL 사용자 이름
    password: CONST_DB_PASSWORD,    // MySQL 사용자 비밀번호
    database: CONST_DB_DATABASE       // 사용할 데이터베이스 이름
  });
  
  // MySQL 연결
  db.connect((err) => {
    if (err) {
      console.error('MySQL 연결 실패:', err);
    } else {
      console.log('MySQL에 연결되었습니다.');
    }
  });
  

// 데이터베이스 초기화
sqlite3_db.serialize(() => {
    // 테이블 생성
    sqlite3_db.run('CREATE TABLE notes (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT)');
    
    // 초기 데이터 삽입
    //sqlite3_db.run('INSERT INTO notes (content) VALUES (?)', ['첫 번째 메모']);
    //sqlite3_db.run('INSERT INTO notes (content) VALUES (?)', ['두 번째 메모']);
   
  });

function initializeServerApp(){
    console.log("initializeServerApp start");

    db.query('SELECT * FROM tbl_member', (err, results) => {
        if (err) {
          console.error('데이터베이스 조회 오류:', err);
         
        } else {
          // 조회된 데이터를 응답으로 전송
          console.log('데이터베이스 조회 성공:');
           // 조회된 데이터를 'records' 변수에 저장
           const records = results;
           
           // 각 레코드를 순회하며 원하는 작업 수행 가능
           const stmt = sqlite3_db.prepare('INSERT INTO notes (content) VALUES (?)');
           records.forEach((record) => {
               console.log(`Member ID: ${record.member_id}, Name: ${record.member_name}`);
               
               stmt.run(record.member_id);
               
           });
           stmt.finalize();
        }
    });
}





// 메모 추가 라우트
app.post('/addNote', express.json(), (req, res) => {
  const { content } = req.body;
  sqlite3_db.run('INSERT INTO notes (content) VALUES (?)', [content], function(err) {
    if (err) {
      return res.status(500).json({ error: '메모 추가 중 오류 발생' });
    }
    res.json({ id: this.lastID, content });
  });
});


// 기본 라우트 (HTTP GET 요청)
app.get('/', (req, res) => {
    console.log('기본 라우트 (HTTP GET 요청)');
  // MySQL 데이터베이스에서 데이터 조회
  sqlite3_db.all('SELECT * FROM notes', (err, rows) => {
    if (err) {
      console.error('데이터베이스 조회 오류:', err);
    } else {
      
      rows.forEach((row) => {
        console.log(`ID: ${row.id}, Name: ${row.content}`);
      });
      console.log('데이터베이스 조회 성공:');
    }
  });
});

// 서버 시작
app.listen(3000, () => {
  console.log('서버가 http://localhost:3000 에서 실행 중입니다.');
});

initializeServerApp();
