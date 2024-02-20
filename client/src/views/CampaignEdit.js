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
    body: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/campaign/detail/${id}`);
        const { title, body, address, latitude, longitude } = response.data;
        console.log(response.data)
        setWrite({ title, body, address, latitude, longitude });
        initializeMap(latitude, longitude); // 데이터를 받아온 후에 지도를 초기화
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const initializeMap = (latitude, longitude) => {
    const mapContainer = document.getElementById("map"); // 지도를 표시할 div
    const mapOption = {
      center: new window.daum.maps.LatLng(latitude, longitude), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
    };

    // 지도를 미리 생성
    const map = new window.daum.maps.Map(mapContainer, mapOption);
    // 주소-좌표 변환 객체를 생성
    const geocoder = new window.daum.maps.services.Geocoder();
    // 마커를 미리 생성
    const marker = new window.daum.maps.Marker({
      position: new window.daum.maps.LatLng(latitude, longitude),
      map: map,
    });

    function sample5_execDaumPostcode() {
      new window.daum.Postcode({
        oncomplete: function (data) {
          const addr = data.address; // 최종 주소 변수

          // 주소 정보를 해당 필드에 넣는다.
          document.getElementById("sample5_address").value = addr;

          // 주소로 상세 정보를 검색
          geocoder.addressSearch(data.address, function (results, status) {
            // 정상적으로 검색이 완료됐으면
            if (status === window.daum.maps.services.Status.OK) {
              const result = results[0]; //첫번째 결과의 값을 활용
              console.log(result)
              // 해당 주소에 대한 좌표를 받아서
              const coords = new window.daum.maps.LatLng(result.y, result.x);
              // 지도를 보여준다.
              mapContainer.style.display = "block";
              map.relayout();
              // 지도 중심을 변경한다.
              map.setCenter(coords);
              marker.setPosition(coords);

              setWrite(prev => ({ ...prev, latitude: result.y, longitude: result.x }));
            }
          });
        },
      }).open();
    }

    document.getElementById('searchButton').addEventListener('click', sample5_execDaumPostcode);
  };

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

  const [selOpt, setSelOpt] = useState("오프라인");

  const onChangeRadio = (e) => {
    setSelOpt(e.target.value);
    console.log(e.target.value);
  };

  const renderAddrDiv = () => {
    if(selOpt === "장소없음"){
      return null;
    }

    return (
      <div className='addr-div'>
        <div className="search-w">
          <input className="address-txt" type="text" id="sample5_address" value={write.address} placeholder="주소를 입력하세요." />
          <input className="btn-search" type="button" id="searchButton" value="주소 검색" />
        </div>
        <input className="addr-detail" type="text" id=""  placeholder="상세주소를 입력하세요." />
      </div>
    )
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

            {/* // @@@@@@@@@@@@@@@@@@@@ 지도 @@@@@@@@@@@@@@@@@@@@  */}
            <div className='address-area'>
              <div className="addr-tit">주소</div>

              {/* 주소 라디오 버튼 */}
              <div className="form-group">
                <div className="form-radio">
                  <input type="radio" id="offline" name="addr-radio" value="오프라인" checked={selOpt === "오프라인"} onChange={onChangeRadio}/>
                  <label htmlFor="offline">오프라인</label>
                </div>
                <div className="form-radio">
                  <input type="radio" id="noaddress" name="addr-radio" value="장소없음" checked={selOpt === "장소없음"} onChange={onChangeRadio}/>
                  <label htmlFor="noaddress">장소없음</label>
                </div>
              </div>
                {/* selOpt이 해당 라디오 버튼의 value와 일치한다면, 해당 버튼에 체크 */}

                {renderAddrDiv()}
                {console.log(write)}
              
              <div id="map" style={{ width: '300px', height: '300px', marginTop: '10px'}}></div>
            </div>
            {/* // @@@@@@@@@@@@@@@@@@@@ 지도 @@@@@@@@@@@@@@@@@@@@  */}

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
