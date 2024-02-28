import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../component/Header';
import {getPost} from '../store/store';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Comments from '../component/campaign/Comments';
import DOMPurify from "isomorphic-dompurify"
import "react-quill/dist/quill.core.css"
import Footer from "../component/Footer";

const CampaignDetail = (props) => {
  const navigate = useNavigate();
  const [campaignList, setCampaignList] = useState([]); // 글 리스트
  const {id} = useParams();
  const dispatch = useDispatch();
  
  const storedUserData = sessionStorage.getItem("userData");
  const userData = JSON.parse(storedUserData);

  const { kakao } = window;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 게시물 데이터 요청
        const result = await dispatch(getPost());
        setCampaignList(result.payload);

        // 조회수 증가 요청
        await axios.put(`http://localhost:8000/campaign/increase-views/${id}`);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [id, dispatch]);

  
  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const result = await dispatch(getPost());
  //       setCampaignList(result.payload);
  //     } catch (error) {
  //       console.log('실패:', error);
  //     }
  //   };

  //   getData();
  // }, []);
  
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // 조회수 증가 요청
  //       await axios.put(`http://localhost:8000/campaign/increase-views/${id}`);
  //       // 게시물 데이터 요청
  //       const response = await axios.get(`http://localhost:8000/campaign/detail/${id}`);
  //       setCampaignList([response.data]);
  //       setViews(response.data.views);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };
  
  //   fetchData();
  // }, [id]);
  
  let curList = campaignList.find(function(data){
    return data.id === parseInt(id);
  });


  // console.log()

  const renderModifyBtn = () => {
    if (userData.userid === curList?.userid) {
      return (
        <div className="bottom-area">
          <div className="btn-w">
            <button className="btn-tolist" onClick={()=>{navigate(-1);}}>목록</button>
            <button className="btn-edit" onClick={()=>{navigate(`/campaign/edit/${curList?.id}`);}}>수정</button>
            <button className="btn-delete" onClick={handleDelete}>삭제</button>
          </div>
        </div>
      )
    }
    return (
      <div className="bottom-area">
        <div className="btn-w">
          <button className="btn-tolist" onClick={()=>{navigate(-1);}}>목록</button>
        </div>
      </div>
    )
  };

  // 글 삭제 버튼
  const handleDelete = async () => {
    const confirmDelete = window.confirm("글을 삭제하시겠습니까?");

    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8000/campaign/detail/${id}`);
        navigate(-1);
      } catch (err) {
        console.log(err);
      }
    }
  };


  // const mapRender = () => {
    
  // }

  useEffect(()=>{
    // curList가 존재하고 latitude 및 longitude 속성이 존재하는 경우에만 맵을 생성
    if(curList && curList.latitude && curList.longitude){
      const container = document.getElementById('map');
      const options = {
        center: new kakao.maps.LatLng(curList.latitude, curList.longitude),
        level: 3
      };
  
      const map = new kakao.maps.Map(container, options);
      const markerPosition  = new kakao.maps.LatLng(curList.latitude, curList.longitude); 
      const marker = new kakao.maps.Marker({
        position: markerPosition
      });
      marker.setMap(map);
    }


  }, [curList]);


  return (
    <div id="wrap" className="campaign-detail">
      <Header/>
      <div className="content-w">
        <div className="inner">
          {/* 제목 영역 */}
          <div className="summary-wrap">
            <div className="title-area">
              <p className="title">{curList?.title}</p>
              <div className="regi-info">
              
              <p className="views">{"조회수: " + parseInt(curList?.views + 1)}</p>
              <p className="date">{new Date(curList?.date).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="info-area">
              <div className="detail-info">
                {/* 진행 기간 */}
                {
                  curList?.end_date != null ? (
                    <div className="info-box">
                      <p className='tit'>캠페인 기간</p>
                    
                      <div className="date-wrap">
                        {curList?.start_date != null ? (
                          <p className="start-date">{new Date(curList?.start_date).toLocaleDateString()}</p>
                        ) : null}
                          <span>~</span>
                        {curList?.end_date != null ? (
                          <p className="end-date">{new Date(curList?.end_date).toLocaleDateString()}</p>
                        ) : null}
                      </div>
                    </div>
                  ): null
                }
                {/* 위치 정보 */}
                {
                  curList?.latitude != null ? (
                    <div className="info-box">
                      <p className="tit">캠페인 장소</p>
                        <div className="txt-w">
                          <p className="txt">{curList?.address}</p>
                          <p className="detail-txt">{curList?.address_detail}</p>
                        </div>
                    </div>
                  ):null
                }
              </div>

              {/* 작성자 정보 */}
              <div className="writer-info">
                <div className="info-tit">작성자 정보</div>
                <div className="txt-div">
                  <div className="txt-box">
                    <p className="tit">작성자</p>
                    <p className="txt">{curList?.username}</p>
                  </div>
                  <div className="txt-box">
                    <p className="tit">이메일</p>
                    <p className="txt">{curList?.email}</p>
                  </div>
                  <div className="txt-box">
                    <p className="tit">연락처</p>
                    <p className="txt">{curList?.phonenumber}</p>
                  </div>
                </div>
                <p className="sub-txt">&#8251; 문의사항은 메일 / 전화 / 댓글을 이용해주세요</p>
              </div>
            </div>
            <button className="btn-apply" onClick={()=>{navigate(`/campaign/form/${curList?.id}`)}}>신청하기</button>
          </div>

          {/* 본문 내용 */}
          <div className="body-wrap">
            <p className="body-tit">상세정보</p>
            <div className="body-area" dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(curList?.body),
            }}></div>
          </div>

          {
            curList?.latitude != null ? (
              <div className="map-area vis-map">
                <p className="tit">위치 안내</p>
                  <div id="map"></div>
                  <div className="txt-w">
                    <p className="txt">{curList?.address}</p>
                    <p className="detail-txt">{curList?.address_detail}</p>
                  </div>
              </div>
            ):null
          }

          {/* 하단 버튼 영역 */}
          {renderModifyBtn()}
          {/* <div className="bottom-area">
            <div className="btn-w">
              <button className="btn-tolist" onClick={()=>{navigate(-1);}}>목록</button>
              <button className="btn-edit" onClick={()=>{navigate(`/campaign/edit/${curList?.id}`);}}>수정</button>
              <button className="btn-delete" onClick={handleDelete}>삭제</button>
            </div>
          </div> */}

          {/* 댓글 */}
          <Comments curList={curList}/>
        </div>
          
      </div>
      <Footer/>
    </div>
  );
};

export default CampaignDetail;