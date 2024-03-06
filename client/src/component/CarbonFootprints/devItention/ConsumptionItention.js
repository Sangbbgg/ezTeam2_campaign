import React, { useState } from "react";

function ConsumptionItention() {
  const [active, setActive] = useState(false);

  const buttonHandle = () => {
    setActive(!active); // 상태를 토글합니다
    return "active";
  };

  return (
    <>
      <div className="carbon-intention-check">
        <button className={`carbon-intention-check__button ${active ? "active" : ""}`} onClick={buttonHandle}>
          개발의도
        </button>
      </div>
      <div className={`carbon-intention-wrap ${active ? "active" : ""}`}>
        <div className="carbon-box">
          <div className="content-box">
            <div className="text-box">
              <p># 조건 : 사용량(5개항목) 입력</p>
              <p># 결과 : 미입력 사용량 존재시 탭이동 제한</p>
              <p># 사용 Hooks : React &#123;"useState , useEffect"&#125;</p>
            </div>
            <img className="carbon-tap__alert" src="/img/carbon_tap_alert.png"  alt="alert이미지"/>
          </div>
          <div className="img-box">
            <img src="/img/free-icon-exclamation-mark-179386.png" alt="느낌표 아이콘" />
          </div>
        </div>
        <div className="carbon-box">2</div>
        <div className="carbon-box">3</div>
        <div className="carbon-box">4</div>
      </div>
    </>
  );
}

export default ConsumptionItention;
