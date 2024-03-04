import React, { useEffect, useState } from 'react';
import { getPost } from '../store/store';
import { useDispatch } from 'react-redux';
import Header from "../component/Header";
import Footer from "../component/Footer";
function Mypage() {
  const dispatch = useDispatch();
  const storedUserData = sessionStorage.getItem("userData");
  const userData = JSON.parse(storedUserData);


  // 글 목록
  const [campaignList, setCampaignList] = useState([]); // 캠페인 목록을 저장 
  // 캠페인 데이터 불러옴
  useEffect(() => {
    // 포스트 데이터를 불러와서 campaignList state에 저장
    dispatch(getPost())
      .then((res) => {
        if (res.payload) {
          let arrPost = [...res.payload];
          setCampaignList(arrPost.reverse());
        }
      })
      .catch((err) => console.log(err));
  }, []);

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
