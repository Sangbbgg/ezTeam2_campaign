import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../component/Header';
import {getPost} from '../store/store';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Footer from "../component/Footer";

const CampaignForm = () => {
  const navigate = useNavigate();
  const [campaignList, setCampaignList] = useState([]); // 글 리스트
  const {id} = useParams();
  const dispatch = useDispatch();
  
  const storedUserData = sessionStorage.getItem("userData");
  const userData = JSON.parse(storedUserData);
  console.log(userData)

  // console.log(campaignList)


  useEffect(() => {
    const fetchData = async () => {
      try {
        // 게시물 데이터 요청
        const result = await dispatch(getPost());
        setCampaignList(result.payload);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [id, dispatch]);

  

  return (
    <div id="wrap" className="application-form">
      <Header/>
      <div className="content-w">
        <div className="inner">
          
        <div className="form-table">
          <table className="vertical">
            <caption></caption>
            <colgroup>
              <col style={{width: "110px"}}/>
              <col style={{width: "auto"}} />
            </colgroup>
            <tbody>
            <tr>
              <th className="user-name" scope="row">이름</th>
              <td className="user-name">
                <span className="value_txt">{userData.username}</span>
              </td>
              <th className="user-email" scope="row">이메일</th>
              <td className="user-email">
                <span className="value_txt">{userData.email}</span>
              </td>
            </tr>

              <tr>
                <th className="user-name" scope="row">전화번호</th>
                <td className="user-name">
                  <span className="value_txt">010-1234-1234</span>
                </td>
                <th className="user-email" scope="row">소속</th>
                <td className="user-company">
                  <input type="text" />
                </td>
              </tr>
              <tr>
                <th>신청자 메모</th>
                <td colSpan="3">
                  <textarea name="" id="" cols="30" rows="10"></textarea>
                </td>
              </tr>
              {/* <tr>
                <th scope="row">제목</th>
                <td>내용</td>
              </tr> */}
            </tbody>
          </table>
        </div>

        <div className="bottom-area">
          <div className="btn-w">
            <button className="btn-edit" type="submit">신청</button> 
            <button className="btn-cancel" type="button" onClick={()=>{navigate(-1)}}>취소</button> 
          </div>
        </div>

        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default CampaignForm;