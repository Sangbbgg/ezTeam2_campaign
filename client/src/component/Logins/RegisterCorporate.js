import { Link } from "react-router-dom";
import React, { useState } from "react";
import DaumPostcode from "react-daum-postcode";
import { handlePostcode } from "./Handle/Postcodehandle";
import axios from 'axios';
import './1.css'

function RegesterCorporate() {
  const [username, setUsername] = useState('');//이름
  const [email, setEmail] = useState('');//이메일
  const [password, setPassword] = useState('');//비밀번호
  const [confirmPassword, setConfirmPassword] = useState('');//비밀번호확인
  const [openPostcode, setOpenPostcode] = useState(false);//주소
  const [address, setAddress] = useState('');//주소
  const [detailedaddress, setdetailedaddress] = useState('');//상세주소
  const [phonenumber, setphonenumber] = useState('');//핸드폰번호
  const [businessnumber,setBusinessNumber] = useState('');//사업자번호
  // const [businessnumberDuplication, setbusinessnumberDuplication] = useState(true);//사업자번호 유효성
  const [emailDuplication, setEmailDuplication] = useState(true);//이메일 유효성
  // 이메일 유효성 검사 02/14 김민호
  const handle = handlePostcode(openPostcode, setOpenPostcode, setAddress);

  const setPasswordMatch = (match) => {
    // setPasswordMatch(true) 또는 setPasswordMatch(false) 등으로 사용
  };
// 이메일 유효성 검사 02/14 김민호
const handleEmailDuplicationCheck = () => {
  if (!email) {
    alert('이메일을 입력해주세요!');
    return;
  }
  

  // 클라이언트가 서버에 이메일 중복 확인을 요청합니다./0214 김민호
  axios.post('http://localhost:8000/checkEmailDuplication', { email })
    .then(response => {
      console.log('서버 응답:', response.data);
      setEmailDuplication(response.data.success);
      alert(response.data.message);
    })
    .catch(error => {
      console.error('이메일 중복 확인 중 오류:', error);
      alert('이메일 중복 확인 중 오류가 발생했습니다.');
    });
    
    
};
const handlebusinessnumberCheck = () => {
  if (!businessnumber) {
    alert('사업자을 입력해주세요!');
    return;
  }
  

  // 클라이언트가 서버에 이메일 중복 확인을 요청합니다./0214 김민호
  // axios.post('http://localhost:8000/checkbusinessnumber', { email })
  //   .then(response => {
  //     console.log('서버 응답:', response.data);
  //     setbusinessnumberDuplication(response.data.success);
  //     alert(response.data.message);
  //   })
  //   .catch(error => {
  //     console.error('사업자 중복 확인 중 오류:', error);
  //     alert('사업자 중복 확인 중 오류가 발생했습니다.');
  //   });
    
    
};

  const handleRegesterClick = () => {
    if (!username || !email || !password || !confirmPassword || !address) {
      alert('정보를 모두 입력해주세요!');
      return;
    }
  
    if (!email) {
      alert('이메일을 입력해주세요!');
      return;
    }
    // if (!email.includes('@')) {
    //   alert('이메일을 입력해주세요!');
    //   return;
    // }

  
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      setPasswordMatch(false);
      return;
    }

      // 이메일이 중복되었는지 확인합니다.
      // 이메일 유효성 검사 02/14 김민호
      if (!emailDuplication) {
        alert('이미 등록된 이메일입니다.');
        return;
      }
      // if (!businessnumberDuplication) {
      //   alert('이미 등록된 사업자입니다.');
      //   return;
      // }
  
    // if (password.length < 10 || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    //   alert('비밀번호는 최소 10글자 이상이어야 하며, 특수문자를 포함해야 합니다.');
    //   return;
    // }
    // if (businessnumber.length !== 10) {
    //   alert('사업자번호는 10자리로 입력해주세요.');
    //   return;
    // }
  
// 클라이언트에서 서버로 회원가입 요청
axios.post('http://localhost:8000/regester', {
  username,
  password,
  email,
  address,
  detailedaddress,
  phonenumber,
  usertype: 'business',
  businessnumber
})
  .then(response => {
    console.log('서버 응답:', response.data);
    alert('회원가입이 완료되었습니다.');
    if (response.data.userType === 1) {
      // 개인 사용자 처리
    } 
    window.location.href = '/'; // 홈 페이지 또는 다른 페이지로 리디렉션
  })
  .catch(error => {
    if (error.response) {
      // 서버가 응답한 상태 코드가 2xx가 아닌 경우
      console.error('서버 응답 오류:', error.response.status, error.response.data);
    } else if (error.request) {
      // 서버로 요청이 전송되었지만 응답이 없는 경우
      console.error('서버 응답이 없음:', error.request);
    } else {
      // 요청을 설정하는 중에 에러가 발생한 경우
      console.error('요청 설정 중 오류:', error.message);
    }
    alert('서버와의 통신 중 오류가 발생했습니다.');
  });
  };
  

  return (
    <div>
      <input
        type="text"
        placeholder="사용자명"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br/>

      <input
        type="password"
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <br />
      <input
      type="text"
      placeholder="사업자번호"
      value={businessnumber}
      onChange={(e) => setBusinessNumber(e.target.value)}
      />
       {/* <button onClick={handlebusinessnumberCheck}>확인</button> */}
      {/* 사업자 유효성 검사 02/14 김민호 */}
      <br/>
      <input
        type="text"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleEmailDuplicationCheck}>확인</button>
      {/* 이메일 유효성 검사 02/14 김민호 */}
      <br />

       <input
        type="text"
        placeholder="핸드폰번호"
        value={phonenumber}
        onChange={(e) => setphonenumber(e.target.value)}
      />

      <br />
      <input
        type="text"
        placeholder="주소"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
    
      <button onClick={handle.clickButton}>선택</button>
      {openPostcode && (
        <DaumPostcode
          onComplete={handle.selectAddress}
          autoClose={false}
          defaultQuery=""
        />
      )}
      <br/>
      <input
        type="text"
        placeholder="상세주소"
        value={detailedaddress}
        onChange={(e) => setdetailedaddress(e.target.value)}
      />
      <br/>
      <button className="RegesterBtn" onClick={handleRegesterClick}>
        가입완료
      </button>
      <div>
        <Link to="/login">로그인창</Link>
      </div>
    </div>
  );
}

export default RegesterCorporate; 