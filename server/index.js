// 공통 
import express from "express";
import cors from "cors";
import mysql from "mysql2";

import bodyParser from "body-parser";
import multer from "multer"; // 이미지 저장 관련
import path from "path"; // 이미지 저장 관련

import { fileURLToPath } from "url"; 

const app = express();
const port = 8000;
const __dirname = fileURLToPath(new URL(".", import.meta.url)); // 이미지 저장 관련


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS 설정
app.use(cors({ origin: "http://localhost:3000" }));

const connection = mysql.createConnection({
  host: "1.243.246.15",
  user: "root",
  password: "1234",
  database: "ezteam2",
  port: 5005,
});

// MySQL 연결
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + connection.threadId);
});

app.get("/", (req, res) => res.send(`Hell'o World!`));






// ------------------- 김지수 -------------------

// app.use(express.json()); // json 데이터 파서
// app.use(cors());
// app.use(express.urlencoded({ extended: true }))

// 정적 파일 제공을 위한 미들웨어 추가
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.get("/", (req, res) => {
  res.json("hello this is the server");
});

// 캠페인 글 목록 가져오기
app.get("/campaign", (req, res) => {
  const q = "SELECT * FROM campaign.posts";
  connection.query(q, (err, data) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      return res.json(err);
    }
    return res.json(data);
  });
});

// 글쓰기 페이지에서 사용자가 입력한 정보가 들어가도록 요청
app.post("/campaign", (req, res) => {
  // MySQL의 NOW() 함수를 사용하여 현재 시간을 삽입
  const q = 'INSERT INTO posts (title, body, date, author_id, start_date, end_date, address, latitude, longitude) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?)';

  // 시작날짜
  const startDateOffset = new Date(req.body.start_date);
  const formattedStartDate = new Date(startDateOffset.getTime() - (startDateOffset.getTimezoneOffset() * 60000)).toISOString().slice(0, 19).replace('T', ' '); // ISO 형식의 날짜를 MySQL이 인식할 수 있는 형식으로 변환
  
  // 종료날짜
  const endDateOffset = new Date(req.body.end_date);
  const formattedEndDate = new Date(endDateOffset.getTime() - (endDateOffset.getTimezoneOffset() * 60000)).toISOString().slice(0, 19).replace('T', ' '); // ISO 형식의 날짜를 MySQL이 인식할 수 있는 형식으로 변환

  const values = [req.body.title, req.body.body, req.body.author_id, formattedStartDate, formattedEndDate, req.body.address, req.body.latitude, req.body.longitude];
  console.log(req.body)

  connection.query(q, values, (err, data) => { 
    if(err) return res.json(err);
    return res.json("Message has been sent successfully");
  });
});

// 글 삭제
// app.delete("/campaign/detail/:id", (req, res) => {
//   const campaignId = req.params.id;
//   const q = "DELETE FROM posts WHERE id = ?";

//   connection.query(q, [campaignId], (err, data) => {
//     if (err) return res.json(err);
//     return res.json("Message has been deleted successfully");
//   });
// });
// 글 삭제
app.delete("/campaign/detail/:id", (req, res) => {
  const campaignId = req.params.id;
  const qDeleteComments = "DELETE FROM comments WHERE post_id = ?"; // 특정 post_id에 해당하는 모든 댓글을 삭제
  const qDeletePost = "DELETE FROM posts WHERE id = ?"; // 게시물의 ID 값을 사용하여 특정 게시물을 삭제

  // 댓글 먼저 삭제
  connection.query(qDeleteComments, campaignId, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }

    // 댓글 삭제가 성공하면 게시물 삭제
    connection.query(qDeletePost, campaignId, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      return res.json("Message and comments have been deleted successfully");
    });
  });
});


// 글 수정
app.get("/campaign/detail/:id", (req, res) => {
  const campaignId = req.params.id;
  const q = "SELECT * FROM posts WHERE id = ?";
  connection.query(q, campaignId, (err, data) => {
    if(err) return res.status(500).json(err);
    if(data.length === 0) return res.status(404).json({ message: "글을 찾을 수 없습니다." });
    return res.json(data[0]); 
  });
});
app.put("/campaign/edit/:id", (req, res) => {
  const campaignId = req.params.id;
  const q = "UPDATE posts SET `title` = ?, `body` = ? WHERE id = ?";
  const values = [req.body.title, req.body.body, campaignId];
  connection.query(q, values, (err, data) => {
    if(err) return res.json(err);
    return res.json("Message has been updated successfully");
  });
});



// 사용자 정보를 가져옴
app.get("/userinfo", (req, res) => {
  // 여기에 사용자 정보를 가져오는 코드를 작성 (예: 세션을 통해 사용자 정보를 가져오는 코드)
  // 예시로 사용자 정보를 하드코딩하여 전송
  const userInfo = {
    author_id: 1, // 예시로 author_id를 하드코딩하여 전송 (실제로는 세션 등을 통해 가져옴)
    // 다른 사용자 정보도 필요한 경우 추가
  };
  res.json(userInfo); // 사용자 정보를 클라이언트에게 전송
});

// -------------- 댓글 --------------
// 댓글 등록
app.post("/campaign/detail/:id/comments", (req, res) => {
  const postId = req.params.id;
  const { author_id, comment_text } = req.body; 
  
  const values = [postId, author_id, comment_text];
  const q = 'INSERT INTO comments (post_id, author_id, comment_text, date) VALUES (?, ?, ?, NOW())';
  
  connection.query(q, values, (err, data) => { 
    if(err) {
      console.error(err);
      return res.status(500).json(err);
    }
    // 새로 추가된 댓글의 commentId를 응답 데이터에 추가하여 전송
    const commentId = data.insertId;
    return res.status(201).json({ 
      message: "Comment has been sent successfully",
      commentId: commentId, // 새로 추가된 댓글의 commentId를 클라이언트로 전송
      date: new Date(),
    });
  });

  //   connection.query(q, values, (err, data) => { 
  //     if(err) {
  //       console.error(err);
  //       return res.status(500).json(err);
  //     }
      
  //     return res.status(201).json({ message: "Comment has been sent successfully" });
  //   });
});

// 댓글을 가져오는 API 엔드포인트
app.get("/campaign/detail/:id/comments", (req, res) => {
  const postId = req.params.id;
  const q = "SELECT * FROM comments WHERE post_id = ?";
  
  connection.query(q, [postId], (err, data) => { 
    if(err) return res.status(500).json(err);
    return res.status(200).json(data); // 댓글 데이터를 반환합니다.
  });
});

//http://localhost:8000/campaign/detail/${curList.id}/comments
// 댓글 삭제
app.delete("/campaign/detail/:id/comments/:commentId", (req, res) => {
  const postId = req.params.id;
  const commentId = req.params.commentId;
  const q = "DELETE FROM comments WHERE post_id = ? AND id = ?";

  connection.query(q, [postId, commentId], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    return res.status(200).json({ message: "댓글이 성공적으로 삭제되었습니다." });
  });
});

// 댓글 수정
app.get("/campaign/detail/:id/comments/:commentId", (req, res) => {
  const postId = req.params.id;
  const commentId = req.params.commentId;
  console.log(postId);
  console.log(commentId);

  const q = "SELECT * FROM comments WHERE post_id = ? AND id = ?";

  connection.query(q, [postId, commentId], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    const selectedComment = data[0]; // 첫 번째로 선택된 댓글을 가져옴
    return res.status(200).json({ message: "test", selectedComment });
  });

  console.log(commentId); // 올바른 위치에 console.log(commentId);를 이동
});

// app.get("/campaign/detail/:id", (req, res) => {
//   const campaignId = req.params.id;
//   const q = "SELECT * FROM posts WHERE id = ?";
//   connection.query(q, campaignId, (err, data) => {
//     if(err) return res.status(500).json(err);
//     if(data.length === 0) return res.status(404).json({ message: "글을 찾을 수 없습니다." });
//     return res.json(data[0]); 
//   });
// });

// app.put("/campaign/detail/:id/comments/:commentId", (req, res) => {
//   const campaignId = req.params.id;
//   const q = "UPDATE posts SET `title` = ?, `body` = ? WHERE id = ?";
//   const values = [req.body.title, req.body.body, campaignId];
//   connection.query(q, values, (err, data) => {
//     if(err) return res.json(err);
//     return res.json("Message has been updated successfully");
//   });
// });



// -------------- 댓글 --------------



// -------------- 이미지 저장 관련 --------------
// multer 설정
const upload = multer({
  storage: multer.diskStorage({
    // 저장할 장소
    destination(req, file, cb) {
      cb(null, path.join(__dirname, "public/uploads"))
    },
    // 저장할 이미지의 파일명
    filename(req, file, cb) {
      const ext = path.extname(file.originalname); // 파일의 확장자
      console.log('file.originalname', file.originalname);
      // 파일명이 절대 겹치지 않도록 해줘야한다.
      // 파일이름 + 현재시간밀리초 + 파일확장자명
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  // limits: { fileSize: 5 * 1024 * 1024 } // 파일 크기 제한
});

// 하나의 이미지 파일만 가져온다.
app.post('/img', upload.single('img'), (req, res) => {
  // 해당 라우터가 정상적으로 작동하면 public/uploads에 이미지가 업로드된다.
  // 업로드된 이미지의 URL 경로를 프론트엔드로 반환한다.
  console.log('전달받은 파일', req.file);
  console.log('저장된 파일의 이름', req.file.filename);

  // 파일이 저장된 경로를 클라이언트에게 반환해준다.
  const IMG_URL = `http://localhost:8000/uploads/${req.file.filename}`;
  console.log(IMG_URL);
  res.json({ url: IMG_URL });
});
// -------------- 이미지 저장 관련 --------------















































































































































































// 상호형











app.listen(port, () => console.log(`port${port}`));