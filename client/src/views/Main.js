import React, { useEffect, useState, useRef } from 'react';
import Header from '../component/Header';
import { useNavigate } from 'react-router-dom';
import { getPost } from '../store/store';
import { useDispatch } from 'react-redux';
import TextList from '../component/campaign/TextList';
import Footer from '../component/Footer';
import {gsap} from "gsap";

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';


// import required modules
import { Navigation } from 'swiper/modules';


const Main = () => {
  const dispatch = useDispatch();

  const [swiper, setSwiper] = useState(null);

  useEffect(() => {
    if (swiper) {
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, [swiper]);
  
  // 글 목록
  const [campaignList, setCampaignList] = useState([]); // 캠페인 목록을 저장 
  const [mainCampaignList, setmainCampaignList] = useState([]); // 캠페인 목록을 저장 


  useEffect(()=>{
    document.querySelector(".main-visual").style.height = window.innerHeight + "px";

    gsap.to(".main-visual .txt", { duration: 1, y: 0, opacity: 1, delay: 0.4, ease: "power2.out" });
    gsap.to(".main-visual .sub-txt", { duration: 1, y: 0, opacity: 1, delay: 0.5, ease: "power2.out" });
  });

  // 데이터 불러옴
  useEffect(() => {
    // 포스트 데이터를 불러와서 campaignList state에 저장
    dispatch(getPost())
      .then((res) => {
        if (res.payload) {
          let arrPost = [...res.payload];
          // 새로운 데이터가 불러와졌을 때 역순으로 정렬하여 최신 글이 위로 오도록 함
          setCampaignList(arrPost.reverse());
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (campaignList.length > 0) {
      const firstThreeItems = MainCampaignList(); 
      setmainCampaignList(firstThreeItems);
    }
  }, [campaignList]);
  
  const MainCampaignList = () => {
    const firstThreeItems = campaignList.slice(0, 6); 
    return firstThreeItems;
  };

//   let arrSclAniEleY = [];
//   let sclElement = document.querySelectorAll(".scroll-motion");

//   function _getScrollObjY() {
//     Array.prototype.forEach.call(sclElement, function(el, i) {
//       arrSclAniEleY.push(parseInt(el.offsetTop) + 150);
//       arrSclAniEleY.push(parseInt(el.offsetTop) + 90);
//     });
//   }

// _getScrollObjY();

var _getScrollObjY = function() {
  var _arrY = [];
  var scrollMotions = document.querySelectorAll(".scroll-motion");

  scrollMotions.forEach(function(el) {
    var offsetTop = el.getBoundingClientRect().top + window.pageYOffset;
    _arrY.push(parseInt(offsetTop));
  });

  return _arrY;
};

window.addEventListener("scroll", function() {
  var scrollMotions = document.querySelectorAll(".scroll-motion");
  var scrollY = window.scrollY || window.pageYOffset;

  scrollMotions.forEach(function(el, q) {
    if (scrollY + window.innerHeight > _getScrollObjY()[q]) {
      el.classList.add("active");
    }
  });
});

  
  return (
    <div id="wrap" className='main'>
      <Header />
      {/* 키비주얼 영역 */}
      <section className="main-visual">
        <div className="img-wrap">
          {/* <video id="main_video0" src={process.env.PUBLIC_URL + '/img/main-video.mp4'} autoPlay loop muted preload="auto" playsInline></video> */}
          <img src={process.env.PUBLIC_URL + '/img/bg-key-visual5.jpg'} alt="Default Campaign Image" />
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

      {/* 캠페인 소개 */}
      <section className="campaign">
      <div className="inner">
        <div className="txt-area scroll-motion">
          <p className="sec-tit">캠페인</p>
          <p className="sec-txt">우리는 탄소 중립 난제를 해결하고 녹색 성장을 이끌어내기 위해 모이고 있습니다.</p>
        </div>

      

        <div className="cont-area scroll-motion">
          <Swiper loop={true} slidesPerView={3} spaceBetween={20} className="mySwiper" onSwiper={setSwiper} modules={[Navigation]} 
            navigation={{ // navigation 활성화
              prevEl: '.swiper-button-prev',
              nextEl: '.swiper-button-next'
            }}
          >
            {mainCampaignList.map((data, i) => (
              <SwiperSlide key={i}>
                <TextList campaignList={data} />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="custom-swiper-navigation">
            <button className="swiper-button-prev"></button>
            <button className="swiper-button-next"></button>
          </div>
        </div>
      </div>
    </section>


      <section className='carbon'>
      <div className="inner">
          <div className="txt-area">
            <p className="sec-tit">탄소발자국</p>
            <p className="sec-txt">내가 생활 속에서 배출하는 이산화탄소의 양은 얼마일까요?</p>
          </div>

          <div className="cont-area">
            
          </div>
          
        </div>

      </section>
      <Footer/>
    </div>
  );
};

export default Main;