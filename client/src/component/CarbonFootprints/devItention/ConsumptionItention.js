import React, { useState } from "react";

function ConsumptionItention() {
  const [active, setActive] = useState();

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
        <div className="carbon-consumption">
          <div className="inner">
            <div className="carbon-tap__handle">
              <div className="carbon_tap_alert-wrap">
                <div className="carbon_tap_alert__texbox">
                  <p>#조건 : 사용량(5개항목) 미입력시</p>
                  <p>#결과 : 탭 이동 제한</p>
                  <p>#사용 Hooks : React &#123;"useState , useEffect"&#125;</p>
                </div>
                <img className="carbon_tap_alert" src="/img/carbon_tap_alert.png" />
              </div>
              <div className="carbon-tap__box"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConsumptionItention;
