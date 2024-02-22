import React, { useEffect, useState } from 'react';
import Header from '../component/Header';
import { useNavigate } from 'react-router-dom';
import './campaign.css';
import { getPost } from '../store/store';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../component/campaign/Pagination';
import TextList from '../component/campaign/TextList';

const Campaign = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // 글 목록
  const [campaignList, setCampaignList] = useState([]);

  // 페이지네이션
  const [page, setPage] = useState(1); 
  const listLimit = 10; // 페이지당 글 갯수
  const offset = (page - 1) * listLimit; // 시작점과 끝점을 구하는 offset

  // 검색 인풋  
  const [searchInput, setSearchInput] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [isSearchClicked, setIsSearchClicked] = useState(false);

  // 데이터 불러옴
  useEffect(() => {
    dispatch(getPost())
      .then((res) => {
        if (res.payload) {
          let arrPost = [...res.payload];
          
          setCampaignList(arrPost.reverse());
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    // 필터링된 결과가 변경될 때마다 화면을 다시 렌더링
  }, [filteredResults]);
  

  // 검색 함수
  const searchPosts = () => {
    const filteredData = campaignList.filter((item) => {
      return Object.values(item).join('').toLowerCase().includes(searchInput.toLowerCase());
    });
    setFilteredResults(filteredData);
    setIsSearchClicked(true);
  };

  // 검색 버튼 클릭 이벤트 핸들러
  const handleSearchButtonClick = () => {
    searchPosts();
  };

  // 포스트 목록을 페이지에 따라 잘라내 반환하는 함수
  const postsData = (posts) => {
    if (!posts || posts.length === 0) {
      return [];
    }

    let result = posts.slice(offset, offset + listLimit);
    return result;
  };

  // 버튼 탭 클릭 이벤트
  const handleTabClick = (index) => {
    let filteredUsertype;
    if (index === 0) {
      // 전체 보기 버튼을 클릭한 경우 
      filteredUsertype = campaignList;
    } else {
      // 클릭한 탭의 usertype과 동일한 데이터만 필터링
      filteredUsertype = campaignList.filter((item) => parseInt(item.usertype) === index);
    }

    // console.log(filteredUsertype);
    setFilteredResults(filteredUsertype);

    const tabList = document.querySelectorAll(".tab-area .btn-tab");
    tabList.forEach((tab, i) => {
      if (i === index) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });
  };

  return (
    <div className="campaign">
      <Header/>
      {/* <h2>캠페인(메인) 페이지입니다</h2> */}

      <div className="inner">
        <button className="btn-link" onClick={()=>{navigate('/campaign/write')}}>글쓰기</button>
        
        {/* 검색 인풋 */}
        <div className="search-wrap">
          <input type="text" placeholder="검색어를 입력하세요" onChange={(e) => setSearchInput(e.target.value)} />
          <button className="btn-search" onClick={handleSearchButtonClick}>검색</button>
        </div>
        
        <div className="campaign-wrap">
          <div className="tab-area">
            <button className='btn-tab active' onClick={() => handleTabClick(0)}>전체</button>
            <button className='btn-tab' onClick={() => handleTabClick(1)}>개인</button>
            <button className='btn-tab' onClick={() => handleTabClick(2)}>기업</button>
            <button className='btn-tab' onClick={() => handleTabClick(3)}>단체</button>
          </div>
          
          <div className="container">
            {/* 검색 결과에 따라 글목록 나열 */}
            {isSearchClicked ? (
              filteredResults.map((data, i) => (
                <TextList campaignList={data} key={i} />
              ))
            ) : (
              postsData(filteredResults.length > 0 ? filteredResults : campaignList).map((data, i) => (
                <TextList campaignList={data} key={i} />
              ))
            )}
            {/* {isSearchClicked ? (
              filteredResults.map((data, i) => (
                <TextList campaignList={data} key={i} />
              ))
            ) : (
              postsData(filteredResults.length > 0 ? filteredResults : campaignList.filter((item) => parseInt(item.usertype) === 1)).map((data, i) => (
                <TextList campaignList={data} key={i} />
              )) // 초기에는 개인 탭에 해당하는 캠페인만 노출
            )} */}

            {/* {isSearchClicked ? (
              filteredResults.map((data, i) => (
                <TextList campaignList={data} key={i} />
              ))
            ) : (
              postsData(campaignList).map((data, i) => (
                <TextList campaignList={data} key={i} />
              ))
            )} */}

          </div>
        </div>
      </div>
      
      {/* 페이지네이션 */}
      <Pagination listLimit={listLimit} page={page} setPage={setPage} totalPosts={isSearchClicked ? filteredResults.length : campaignList.length} />
    </div>
  );
};

export default Campaign;
