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
      {/* <div className="key-visual">
        <div className="img-w">
          <img src={process.env.PUBLIC_URL + '/img/bg-key-visual2.jpg'} alt="Default Campaign Image" />
        </div>  
        <div className="txt-w">
          <p className="txt">나의 행동이 지구를 위한 발걸음이 되도록, 탄소 중립을 향한 여정을 함께하세요.</p>
        </div>
      </div>   */}
      <section className="main-visual">
          <div className="img-wrap">
            <img src={process.env.PUBLIC_URL + '/img/bg-key-visual2.jpg'} alt="Default Campaign Image" />
          </div>

          <div className="txt_area">
            <p className="txt">나의 행동이 <br/>지구를 위한 발걸음이 되도록</p>
            <p className="sub-txt">탄소 중립을 향한 여정을 함께하세요.</p>
            {/* <a className="btn_more">더보기</a> */}
          </div>


      </section>
      {/* <h2 style={{position: 'absolute', top: '30%'}}>메인 페이지입니다.</h2> */}
      {/* <button onClick={()=>{navigate('./login')}}>로그인</button>
      <button onClick={()=>{navigate('./register')}}>회원가입</button> */}
    </div>
  );
};

export default Main;