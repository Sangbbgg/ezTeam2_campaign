// 공통 
import express from "express";
import cors from "cors";
import mysql from "mysql2";

import bodyParser from "body-parser";

const app = express();
const port = 8000;

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

// 김지수















































































































































































// 상호형











app.listen(port, () => console.log(`port${port}`));