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

  // const [formData, setFormData] = useState();
  const [formWrite, setFormWrite] = useState({
    company: "",
    memo: "",
    userid: userData.userid, 
  });
  // console.log(userData)


  // @@@@@@@@@@@
// const [userInfo, setUserInfo] = useState(null); // 로그인한 사용자 정보를 저장
const [filteredUserInfo, setFilteredUserInfo] = useState(null); // 로그인한 사용자 정보를 저장

// 페이지가 로드될 때 사용자 정보를 가져오는 useEffect
useEffect(() => {
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://localhost:8000/users');
      const userInfo = response.data;
      const filteredInfo = userInfo.find(item => item.username === userData.username);
      setFilteredUserInfo(filteredInfo);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  fetchUserInfo();
}, []);


const [myApplication, setMyApplication] = useState([]);

// 신청한 캠페인 목록 불러옴
useEffect(() => {
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/campaign/form/all`);
      const filteredData =  response.data.filter((item)=>{
        return item.userid === userData.userid
        
      })
      setMyApplication(filteredData);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };
  
  fetchUserInfo();
}, []);
console.log(myApplication)
const test = myApplication.some(item => item.post_id == id);
// const test1 = myApplication.map((item, i)=>{
//   console.log(item.post_id == id)
//   console.log(item.post_id)
//   return item.post_id == id
// });
console.log(test)
// console.log(test1)




  const handleChange = (e) => {
    setFormWrite((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
  
    // myApplication의 각 요소들 중에서 post_id가 입력한 id와 일치하는지 확인합니다.
    const hasMatchingPost = myApplication.some(item => item.post_id === parseInt(id));
  
    // 만약 post_id가 일치하는 요소가 있다면 경고창을 띄웁니다.
    if (hasMatchingPost) {
      alert("이미 해당 캠페인에 신청한 내역이 있습니다.");
      navigate(-1);
    } else {
      // post_id가 일치하는 요소가 없다면 신청서를 제출합니다.
      let submitData = {
        company: formWrite.company,
        memo: formWrite.memo,
        userid: formWrite.userid,
      };
  
      const confirmMsg = window.confirm("신청서를 제출하시겠습니까?");
  
      if (confirmMsg) {
        try {
          await axios.post(`http://localhost:8000/campaign/form/${id}`, submitData);
          alert("신청이 완료되었습니다.");
          navigate(-1);
        } catch (err) {
          console.log(err);
        }
      }
    }
  };
  
  return (
    <div id="wrap" className="application-form">
      <Header/>
      <div className="content-w">
        <div className="inner">
          
        <div className="form-table">
          <table className="vertical">
            <caption></caption>
            <colgroup>
              <col style={{width: "160px"}}/>
              <col style={{width: "auto"}} />
              <col style={{width: "160px"}}/>
              <col style={{width: "auto"}} />
            </colgroup>
            <tbody>
            <tr>
              <th className="user-name" scope="row">이름</th>
              <td className="user-name">
                <span className="value_txt">{filteredUserInfo?.username}</span>
              </td>
              <th className="user-email" scope="row">이메일</th>
              <td className="user-email">
                <span className="value_txt">{filteredUserInfo?.email}</span>
              </td>
            </tr>

              <tr>
                <th className="user-name" scope="row">전화번호</th>
                <td className="user-name">
                  <span className="value_txt">{filteredUserInfo?.phonenumber}</span>
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
