import React, {useRef, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../component/Header';
import {gsap} from "gsap";

const Main = () => {
  const navigate = useNavigate();
  
  const app = useRef();  // 범위 지정용 ref 생성
  const circle = useRef();
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.to(".box", { rotation: 360 });
      gsap.to(circle.current, { rotation: 360 }); // 
    }, app); // <- * 생성한 ref 이름을 써줘야 한다 * 
    
    
    return () => ctx.revert();
  }, []);

  useEffect(()=>{
    document.querySelector(".main-visual").style.height = window.innerHeight + "px";

    gsap.to(".main-visual .txt", { duration: 0.8, y: 0, opacity: 1, delay: 0.4, ease: "power2.out" });
    gsap.to(".main-visual .sub-txt", { duration: 0.8, y: 0, opacity: 1, delay: 0.5, ease: "power2.out" });
    gsap.to(".main-visual .btn_more", { duration: 0.8, y: 0, opacity: 1, delay: 0.7, ease: "power2.out" });
  })


  return (
    <div id="wrap" className='main'>
      {/* <div ref={app} className="App">
        <div className="box">selector</div>
        <div className="circle" ref={circle}>Ref</div>
      </div> */}

      <Header />
      <section className="main-visual">
        <div className="img-wrap">
          <img src={process.env.PUBLIC_URL + '/img/bg-key-visual2.jpg'} alt="Default Campaign Image" />
        </div>

        <div className="txt-wrap">
          <p className="txt">나의 행동이 <br/>지구를 위한 발걸음이 되도록</p>
          <p className="sub-txt">탄소 중립을 향한 여정을 함께하세요.</p>
        </div>

        <div className="scroll-mark">
          <div className="bar">
            <div className="move-bar"></div>
          </div>
          <div className="text">Scroll Down</div>
        </div>
      </section>
    </div>
  );
};

export default Main;