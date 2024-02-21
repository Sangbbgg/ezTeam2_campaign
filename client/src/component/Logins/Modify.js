import React, { useState, useEffect } from "react";
import axios from "axios";

function Modify() {
  const [userData, setUserData] = useState({}); // 사용자 데이터를 저장할 상태
  
  useEffect(() => {
    axios.get("http://localhost:8000/edit-profile", { withCredentials: true })
      .then(response => {
        setUserData(response.data);
        console.log(response.data)
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          window.location.href = "/login";
        } else {
          console.error('회원 정보 수정 실패:', error);
        }
      });
  }, []);

  return (
    <div>
      <h2>정보 수정 페이지</h2>
      <p>회원번호: {userData.userid}</p>
      <p>회원이름: {userData.usertype}</p>
      {/* 기타 사용자 정보 표시 */}
    </div>
  );
}

export default Modify;