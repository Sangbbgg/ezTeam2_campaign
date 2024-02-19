import React, { useState, useEffect } from "react";
import axios from "axios";

function Modify() {
  const [userData, setUserData] = useState({}); // 사용자 데이터를 저장할 상태

  useEffect(() => {
    // 서버에서 토큰을 얻어와서 요청 헤더에 포함
    axios.get("http://localhost:8000/user", { withCredentials: true })
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => {
        console.error('데이터 불러오기 실패:', error);
      });
  }, []);

  return (
    <div>
      <h2>정보 수정 페이지</h2>
      <p>회원번호: {userData.userid}</p>
      <p>회원이름: {userData.username}</p>
      <p>비밀번호: {userData.password}</p>
      <p>핸드폰번호: {userData.phonenumber}</p>
      <p>주소: {userData.address}</p>
      <p>상세주소: {userData.detailedaddress}</p>
      <p>이메일: {userData.email}</p>
      {/* 기타 사용자 정보 표시 */}
    </div>
  );
}

export default Modify;