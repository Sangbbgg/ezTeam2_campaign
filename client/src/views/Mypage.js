import React from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";
function Mypage() {
  return (
    <div id="wrap">
      <Header />
      <div className="content-w">
        <div className="inner">
          <div className="tit-wrap">
            <div className="tit"> Mypage</div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Mypage;
