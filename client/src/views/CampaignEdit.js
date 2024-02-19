import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../component/Header';
import WriteEditor from '../component/campaign/WriteEditor';

const CampaignEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [write, setWrite] = useState({
    title: "",
    body: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/campaign/detail/${id}`);
        const { title, body } = response.data;
        setWrite({ title, body });
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setWrite((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChangeQuill = (value) => {
    setWrite((prev) => ({ ...prev, body: value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const confirmUpdate = window.confirm("글을 수정하시겠습니까?");
    if (confirmUpdate){
      try {
        await axios.put(`http://localhost:8000/campaign/edit/${id}`, write);
        navigate(-1);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="campaign-write edit">
      <Header/>
      <h2>캠페인(수정) 페이지입니다.</h2>
      <div className="content-wrap">
        <form>
          <div className="content-wrap">
            <input className="title" type="text" name="title" value={write.title} placeholder="제목을 입력하세요" onChange={handleChange} />
            
            <WriteEditor value={write.body} handleChangeQuill={handleChangeQuill} />

            <div className="bottom-area">
              <button className="btn-cancel" type="button" onClick={()=>{navigate(-1)}}>취소</button> 
              <button className="btn-edit" type="submit" onClick={handleClick}>수정</button> 
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampaignEdit;
