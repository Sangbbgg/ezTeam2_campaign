import React, { useState } from "react";
import axios from "axios";
import "./1.css"

function Find() {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const handleFindClick = async () => {
    try {
      // 서버의 회원 찾기 API 엔드포인트로 요청을 보냅니다.
      const response = await axios.post("http://localhost:8000/find", {
        username,
        phonenumber: phoneNumber,
      });

      // 응답으로 받은 이메일을 설정합니다.
      setEmail(response.data.email);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // 사용자를 찾지 못했을 때의 처리
      setEmail("일치하는 사용자가 없습니다.");
    } else {
      console.error("사용자 찾기 오류:", error);
    }
  }
};

  return (
    <div>
      <h1>회원 찾기</h1>
      <label>
        이름:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <br />
      <label>
        핸드폰 번호:
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleFindClick}>찾기</button>
      <br />
      {email && <p>가입된 이메일: {email}</p>}
    </div>
  );
}

export default Find;;