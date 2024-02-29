import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../component/Header';
import {getPost} from '../store/store';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Footer from "../component/Footer";

const CampaignForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {id} = useParams();
  const storedUserData = sessionStorage.getItem("userData");
  const userData = JSON.parse(storedUserData);

  const [formWrite, setFormWrite] = useState({
    company: "",
    memo: "",
    userid: userData.userid, 
  });
  console.log(id)

  const handleChange = (e) => {
    setFormWrite((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    let submitData = {
      company: formWrite.company,
      memo: formWrite.memo,
      userid: formWrite.userid,
    };

    try {
      await axios.post(`http://localhost:8000/campaign/detail/${id}/form`, submitData);
      // 요청 성공 시 적절한 작업 수행
      // navigate(-1);
    } catch (err) {
      console.log(err);
      // 요청 실패 시 에러 처리
    }
  };
  console.log(`http://localhost:8000/campaign/detail/${id}/form`)

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
                  <span className="value_txt">{userData.phonenumber}</span>
                </td>
                <th className="user-email" scope="row">소속</th>
                <td className="user-company">
                  <input type="text" name="company" value={formWrite.company} onChange={handleChange} />
                </td>
              </tr>
              <tr>
                <th>신청자 메모</th>
                <td colSpan="3">
                  <textarea value={formWrite.memo} placeholder="내용을 입력하세요" onChange={(e) => setFormWrite({...formWrite, memo: e.target.value})} />
                </td>
                {console.log(formWrite)}
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
            <button className="btn-submit" onClick={handleClick}>신청</button>

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