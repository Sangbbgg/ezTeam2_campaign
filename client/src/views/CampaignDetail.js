import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../component/Header';
import {getPost} from '../store/store';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Comments from '../component/campaign/Comments';
import DOMPurify from "isomorphic-dompurify"
import "react-quill/dist/quill.core.css"

const CampaignDetail = (props) => {
  const navigate = useNavigate();
  const {id} = useParams();
  const dispatch = useDispatch();
  const [campaignList, setCampaignList] = useState([]); // 글 리스트
  const [views, setViews] = useState(0); // 조회수

  const { kakao } = window;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 게시물 데이터 요청
        const result = await dispatch(getPost());
        setCampaignList(result.payload);
        console.log(result)

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
    <div className="campaign-detail">
      <Header/>
      {/* 제목 영역 */}
      <div className="title-area">
        <p className="title">{curList?.title}</p>
        <div className="regi-info">
          
          <p className="views">{"조회수: " +curList?.views}</p>
        </div>
      </div>

      {/* 작성자 정보 */}
      <div className="writer-info">
        {/* <p className="author-id">{"회원번호: " + curList?.userid}</p> */}
        <p className="author-id">{curList?.username}</p>
        {/* <p className="date">{curList?.date.slice(0, 10).replace("T", "")}</p> */}
        <p className="date">{new Date(curList?.date).toLocaleDateString()}</p>
      </div>
      
      {/* 진행 기간 */}
        {
          curList?.end_date != null ? (
            <div className="period-area">
              <p className='period-tit'>진행기간</p>
            
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


      {/* 본문 내용 */}
      <div className="body-area" dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(curList?.body),
      }}></div>

      {
        curList?.latitude != null ? (
          <div className="map-area">
            <p className="tit">위치 안내</p>
              <div id="map" style={{width:"500px", height:"400px"}}></div>
              <div className="txt-w">
                <p className="txt">{curList?.address}</p>
                <p className="detail-txt">{curList?.address_detail}</p>
              </div>
          </div>
        ):null
      }
      

      {/* 하단 버튼 영역 */}
      <div className="bottom-area">
        <button className="btn-tolist" onClick={()=>{navigate(-1);}}>목록</button>
        <div className="btn-w">
          <button className="btn-edit" onClick={()=>{navigate(`/campaign/edit/${curList?.id}`);}}>수정</button>
          <button className="btn-delete" onClick={handleDelete}>삭제</button>
        </div>
      </div>


      {/* 댓글 */}
      <Comments curList={curList}/>
    </div>
  );
};

export default CampaignDetail;