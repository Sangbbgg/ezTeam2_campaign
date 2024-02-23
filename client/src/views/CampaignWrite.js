import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../component/Header";
import axios from "axios";
import WriteEditor from "../component/campaign/WriteEditor";
import DatePicker from "react-datepicker";
import DaumPostcode from "react-daum-postcode";

import "react-datepicker/dist/react-datepicker.css";

const CampaignWrite = () => {
  // 상호형 작성
  const storedUserData = sessionStorage.getItem("userData");
  const userData = JSON.parse(storedUserData);
  console.log("유저아이디:", userData.userid);

  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(new Date("2024/01/01"));
  const [endDate, setEndDate] = useState(new Date("2024/01/01"));

  // 지도
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  // 주소 라디오 버튼
  const [selOpt, setSelOpt] = useState("오프라인");
  const onChangeRadio = (e) => {
    setSelOpt(e.target.value);
    console.log(e.target.value);
  };

  const renderAddrDiv = () => {
    if (selOpt === "장소없음") {
      return null;
    }

    return (
      <div className="addr-div">
        <div className="search-w">
          <input
            className="address-txt"
            type="text"
            id="sample5_address"
            placeholder="주소를 입력하세요."
          />
          <input
            className="btn-search"
            type="button"
            id="searchButton"
            value="주소 검색"
          />
        </div>
        <input
          className="addr-detail"
          value={addressDetail}
          onChange={(e) => setAddressDetail(e.target.value)}
          type="text"
          id=""
          placeholder="상세주소를 입력하세요."
        />
      </div>
    );
  };

  useEffect(() => {
    setWrite((prev) => ({
      ...prev,
      start_date: startDate,
      end_date: endDate,
      address: address,
      address_detail: addressDetail,
      latitude: latitude,
      longitude: longitude,
    }));
  }, [startDate, endDate, address, addressDetail, latitude, longitude]);

  const [write, setWrite] = useState({
    title: "",
    body: "",
    userid: userData.userid, // 회원번호
    start_date: startDate,
    end_date: endDate,
    address: address,
    address_detail: addressDetail,
    latitude: latitude,
    longitude: longitude,
  });

  const handleChange = (e) => {
    setWrite((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChangeQuill = (value) => {
    setWrite((prev) => ({ ...prev, body: value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const confirmCreate = window.confirm("글을 등록하시겠습니까?");
  
    if (confirmCreate) {
      let postData = {
        title: write.title,
        body: write.body,
        userid: write.userid,
        start_date: startDate,
        end_date: endDate,
      };
  
      // "장소없음"이 선택되었을 때만 주소 관련 필드를 null로 설정
      if (selOpt === "장소없음" || address === "") {
        postData = {
          ...postData,
          address: null,
          address_detail: null,
          latitude: null,
          longitude: null,
        };
      } else {
        postData = {
          ...postData,
          address: write.address,
          address_detail: write.address_detail, // 수정된 부분
          latitude: write.latitude,
          longitude: write.longitude,
        };
      }
  
      try {
        await axios.post("http://localhost:8000/campaign", postData);
        navigate(-1);
      } catch (err) {
        console.log(err);
      }
    }
  };
  

  useEffect(() => {
    const mapContainer = document.getElementById("map"); // 지도를 표시할 div
    const mapOption = {
      center: new window.daum.maps.LatLng(37.537187, 127.005476), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
    };

    //지도를 미리 생성
    const map = new window.daum.maps.Map(mapContainer, mapOption);
    //주소-좌표 변환 객체를 생성
    const geocoder = new window.daum.maps.services.Geocoder();
    //마커를 미리 생성
    const marker = new window.daum.maps.Marker({
      position: new window.daum.maps.LatLng(37.537187, 127.005476),
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
              // 해당 주소에 대한 좌표를 받아서
              const coords = new window.daum.maps.LatLng(result.y, result.x);
              // 지도를 보여준다.
              mapContainer.style.display = "block";
              map.relayout();
              // 지도 중심을 변경한다.
              map.setCenter(coords);
              marker.setPosition(coords);
              console.log(data);

              setAddress(addr);
              setLatitude(coords.Ma);
              setLongitude(coords.La);

              // Ma 위도 La경도
            }
          });
        },
      }).open();
    }

    document
      .getElementById("searchButton")
      .addEventListener("click", sample5_execDaumPostcode);

    // Cleanup event listener on unmount
    // return () => {
    //   document.getElementById('searchButton').removeEventListener('click', sample5_execDaumPostcode);
    // };
  }, []);

  // console.log(address)
  // console.log(latitude, longitude)
  // @@@@@@@@@@@@@@@@@@@@ 지도 @@@@@@@@@@@@@@@@@@@@

  return (
    <div className="campaign-write">
      <Header />
      <h2>캠페인(글쓰기) 페이지입니다.</h2>
      <div className="content-wrap">
        <form>
          <div className="body-area">
            <input
              className="title"
              type="text"
              name="title"
              value={write.title}
              placeholder="제목을 입력하세요"
              onChange={handleChange}
            />

            <div className="calendar-area">
              <p className="cal-tit">진행기간</p>
              <div className="calendar">
                <DatePicker
                  className="start-date"
                  dateFormat="yyyy.MM.dd"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                />
                <DatePicker
                  className="end-date"
                  dateFormat="yyyy.MM.dd"
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                />
              </div>
            </div>

            {/* // @@@@@@@@@@@@@@@@@@@@ 지도 @@@@@@@@@@@@@@@@@@@@  */}
            <div className="address-area">
              <div className="addr-tit">주소</div>

              {/* 주소 라디오 버튼 */}
              <div className="form-group">
                <div className="form-radio">
                  <input
                    type="radio"
                    id="offline"
                    name="addr-radio"
                    value="오프라인"
                    checked={selOpt === "오프라인"}
                    onChange={onChangeRadio}
                  />
                  <label htmlFor="offline">오프라인</label>
                </div>
                <div className="form-radio">
                  <input
                    type="radio"
                    id="noaddress"
                    name="addr-radio"
                    value="장소없음"
                    checked={selOpt === "장소없음"}
                    onChange={onChangeRadio}
                  />
                  <label htmlFor="noaddress">장소없음</label>
                </div>
              </div>
              {/* selOpt이 해당 라디오 버튼의 value와 일치한다면, 해당 버튼에 체크 */}

              {renderAddrDiv()}

              <div
                id="map"
                style={{
                  width: "300px",
                  height: "300px",
                  marginTop: "10px",
                  display: "none",
                }}
              ></div>
            </div>
            {/* // @@@@@@@@@@@@@@@@@@@@ 지도 @@@@@@@@@@@@@@@@@@@@  */}

            <WriteEditor
              handleChangeQuill={handleChangeQuill}
              value={write.body}
            />

            <input
              className="author-id"
              type="number"
              name="userid"
              value={write.userid}
              onChange={handleChange}
            />
          </div>
          <div className="bottom-area">
            <button className="btn-submit" type="submit" onClick={handleClick}>
              등록
            </button>{" "}
            <br></br>
          </div>
        </form>
        <button
          type="text"
          className="btn-tolist pos-right"
          onClick={() => {
            navigate(-1);
          }}
        >
          목록
        </button>
      </div>
    </div>
  );
};

export default CampaignWrite;