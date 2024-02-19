import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../component/Header';

const Main = () => {
  const navigate = useNavigate();
  const headerHover = ()=> {
    console.log("test")
  }

  return (
    <div>
      <Header />

      <h2 style={{position: 'absolute', top: '30%'}}>메인 페이지입니다.</h2>
      {/* <button onClick={()=>{navigate('./login')}}>로그인</button>
      <button onClick={()=>{navigate('./register')}}>회원가입</button> */}
    </div>
  );
};

export default Main;