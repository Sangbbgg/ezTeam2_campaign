import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
// import './1.css'

import Header from "../Header";

function Register() {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  const [isPage, setIsPage] = useState();
  const [handlePage, setHandlePage] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsPage(location.pathname);
    console.log("page", isPage);
    if (isPage === "/Login") {
      setHandlePage(true);
    }
    console.log("handlePage", handlePage);
  });

  const addClass = () => {
    const addclass = "render-register";
    return handlePage ? "" : addclass;
  };

  const registerRenderReturn = () => {
    return (
      <>
        <div id="wrap">
          <Header />
          <div className="content-w">
            <div className="inner">
              {loginRenderpage()}
              <div className="login-Link">
                
                <Link to="/Login">로그인창</Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const loginRenderpage = () => {
    return (
      <>
        <form className="form-register">
          <h3 className="title">REGISTER</h3>
          <p>BBANG끗과 함께 탄소중립을 실천해주세요</p>
          <div className="register-botton-wrap">
            {/* 각 버튼 클릭 시에 해당 페이지로 이동하는 버튼을 추가합니다 */}
            <button className={`register-botton ${addClass()}`} onClick={() => navigateTo("/Register/personal")}>
              <img src="" alt="개인아이콘" />
              <br />
              개인
            </button>
            <button className={`register-botton ${addClass()}`} onClick={() => navigateTo("/Register/corporate")}>
              <img src="" alt="기업아이콘" />
              <br />
              기업
            </button>
            <button className={`register-botton ${addClass()}`} onClick={() => navigateTo("/Register/group")}>
              <img src="" alt="단체아이콘" />
              <br />
              단체
            </button>
          </div>
        </form>
      </>
    );
  };

  console.log(addClass());
  return <>{handlePage ? loginRenderpage() : registerRenderReturn()}</>;
}

export default Register;
