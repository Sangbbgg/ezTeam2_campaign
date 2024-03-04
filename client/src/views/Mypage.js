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
  const [mypostList, setMypostList] = useState([]); // 캠페인 목록을 저장 

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

  return (
    <div id="wrap">
      {/* 내가 쓴 캠페인 글 */}
      <div className="mypost">
        <ul>
          {mypostList.filter(item => item.userid === userData.userid).map((post, index) => (
            <li key={index}>{post.title}</li>
          ))}
        </ul>
      </div>

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
