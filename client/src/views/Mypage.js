import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getPost } from '../store/store';
import axios from 'axios';
import Header from "../component/Header";
import Footer from "../component/Footer";

function Mypage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {id} = useParams();

  const storedUserData = sessionStorage.getItem("userData");
  const userData = JSON.parse(storedUserData);

  // 글 목록
  const [mypostList, setMypostList] = useState([]); // 내가 쓴 글 
  const [myApplication, setmyApplication] = useState([]); // 신청한 캠페인 목록 

  // 현재 선택된 탭 인덱스
  const [activeTab, setActiveTab] = useState(0);
  
  // 캠페인 데이터 불러옴
  useEffect(() => {
    dispatch(getPost())
      .then((res) => {
        if (res.payload) {
          let arrPost = [...res.payload];
          setMypostList(arrPost.reverse());
        }
      })
      .catch((err) => console.log(err));
  }, []);

    // 버튼 탭 클릭 이벤트
    const handleTabClick = (index) => {
      console.log(index)
    
      setActiveTab(index);
      // 클릭한 탭에 active 클래스 추가
      const tabList = document.querySelectorAll(".tab-area .btn-tab");
      tabList.forEach((tab, i) => {
        if (i === index) {
          tab.classList.add("active");
        } else {
          tab.classList.remove("active");
        }
      });
    };

  return (
    <div id="wrap" className="mypage">
      <Header />
      <div className="content-w">
        <div className="inner">
          <div className="tit-wrap">
            <div className="tit"> Mypage</div>
          </div>

          <div className="tab-wrap">
            {/* 탭 버튼 영역 */}
            <div className="tab-area">
              {/* 각 탭 클릭시 handleTabClick 함수 호출 */}
              <button className={`btn-tab ${activeTab === 0 ? 'active' : ''}`} onClick={() => handleTabClick(0)}>내가 쓴 글</button>
              <button className={`btn-tab ${activeTab === 1 ? 'active' : ''}`} onClick={() => handleTabClick(1)}>신청한 캠페인</button>
              <button className={`btn-tab ${activeTab === 2 ? 'active' : ''}`} onClick={() => handleTabClick(2)}>탄소 발자국</button>
            </div>
            {/* 콘텐츠 영역 */}
            <div className="content-area">
              {/* 내가 쓴 캠페인 글 */}
              {activeTab === 0 && (
                <div className="mycont-wrap">
                    <h3 className="title">내가 쓴 글</h3>
                    <div className="cont-area">
                      <div className="post-list">
                        {mypostList.filter(item => item.userid === userData.userid).length > 0 ? (
                          mypostList.filter(item => item.userid === userData.userid).map((post, index) => (
                            <div className="mypost summary-wrap" key={index}>
                              <div className="title-area">
                                <p className="title">{post.title}</p>
                                <div className="regi-info">
                                  {/* <p className="views">{"조회수: " + parseInt(post.views + 1)}</p> */}
                                  <p className="date">{new Date(post.date).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <div className="info-area">
                                <div className="detail-info">
                                  {/* 캠페인 기간 */}
                                  {post.end_date && (
                                    <div className="info-box">
                                      <p className="tit">캠페인 기간</p>
                                      <div className="date-wrap">
                                        {post.start_date && (
                                          <p className="start-date">{new Date(post.start_date).toLocaleDateString()}</p>
                                        )}
                                        <span>~</span>
                                        {post.end_date && (
                                          <p className="end-date">{new Date(post.end_date).toLocaleDateString()}</p>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  {/* 접수 기간 */}
                                  {post.reception_end_date && (
                                    <div className="info-box">
                                      <p className="tit">접수 기간</p>
                                      <div className="date-wrap">
                                        {post.reception_start_date && (
                                          <p className="start-date">{new Date(post.reception_start_date).toLocaleDateString()}</p>
                                        )}
                                        <span>~</span>
                                        {post.reception_end_date && (
                                          <p className="end-date">{new Date(post.reception_end_date).toLocaleDateString()}</p>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  {/* 위치 정보 */}
                                  {post.latitude && (
                                    <div className="info-box">
                                      <p className="tit">캠페인 장소</p>
                                      <div className="txt-w">
                                        <p className="txt">{post.address}</p>
                                        <p className="detail-txt">{post.address_detail}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <button className="btn-view" onClick={() => {navigate(`/campaign/detail/${post.id}`)}}>보러가기</button>
                            </div>
                          ))
                        ) : (
                          <p className='no-data'>내가 쓴 글이 없습니다.</p>
                        )}
                      </div>
                    </div>
                </div>
              )}
              {/* 신청한 캠페인 */}
              {activeTab === 1 && (
                <div  className="mycont-wrap">
                  {/* 내가 신청한 캠페인 */}
                    <h3 className="title">신청한 캠페인</h3>
                    <div className="cont-area">
                      {/* {
                        mypostList.filter(item => item.userid === userData.userid).map((post, index) => (
                          console.log(index, post)
                      ))
                      } */}
                    </div>
                </div>
              )}
              {/* 탄소발자국 */}
              {activeTab === 2 && (
                <div  className="mycont-wrap">
                  <h3 className="title">탄소 발자국</h3>
                  <div className="cont-area">
                  </div>
              </div>
              )}
            </div>
          </div>

        
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Mypage;
