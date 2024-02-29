import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './1.css'


function Register() {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  const handleRegisterClick = () => {
    
    // 회원가입이 성공하면 다음 경로로 이동합니다.
    navigate("/");
  };

  return (
    <div>
      <form className="form">
        <div className="form-Register">
            {/* 각 버튼 클릭 시에 해당 페이지로 이동하는 버튼을 추가합니다 */}
            <button onClick={() => navigateTo("/Register/personal")}>
              개인
            </button>
            <button onClick={() => navigateTo("/Register/corporate")}>
              기업
            </button>
            <button onClick={() => navigateTo("/Register/group")}>
              단체
            </button><br/>
            <div className="Category-Link">
            <Link to="/login">로그인창</Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Register; 