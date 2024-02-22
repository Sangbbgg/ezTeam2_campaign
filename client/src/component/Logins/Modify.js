import React, { useState, useEffect } from "react";
import axios from "axios";

function Modify() {
  const [userData, setUserData] = useState({}); // 사용자 데이터를 저장할 상태

  // 상호형
  const storedUserData = sessionStorage.getItem("userData"); // 클라이언트단에서 세션값을 획득하는 부분
  const storedUserType = sessionStorage.getItem("usertype");
  const userId= JSON.parse(storedUserData).userid;
  const usertype = JSON.parse(storedUserType);

  console.log(userId);
  useEffect(() => {
    axios.get(`http://localhost:8000/edit-profile/${userId}/${usertype}`) // 클라이언트에서 파라미터에 세션안의 값을 요청으로 전달
      .then(response => {
        setUserData(response.data.userData);
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          window.location.href = "/login";
        } else {
          console.error('회원 정보 수정 실패:', error);
        }
      });
  }, [userId, usertype]);

  console.log(userData);// 상호형
  return (
    <div>
      <h2>정보 수정 페이지</h2>
      <p>회원번호: {userData.userid}</p>
      <p>회원이름: {userData.username}</p>
      {/* 기타 사용자 정보 표시 */}
    </div>
  );
}

export default Modify;