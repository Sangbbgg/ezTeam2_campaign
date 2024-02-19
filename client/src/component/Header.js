import React, { useEffect, useState } from 'react';
import '../component/Header.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header>
      {/* <h1 className="logo"><button onClick={()=>{navigate('/')}}></button></h1> */}
      <nav>
        <div className="for-bg">
          <div className="gnb-wrap">
            <ul className="gnb">
              <li>
                <button className="one-link" onClick={()=>{navigate('/carbonNeutrality')}}>탄소 중립이란?</button>
              </li>
              <li>
                <a className="one-link" href=""><button className="one-link" onClick={()=>{navigate('/campaign')}}>캠페인</button></a>
              </li>
              <li>
                <a className="one-link" href=""><button className="one-link" onClick={()=>{navigate('/carbonFootprint')}}>탄소발자국</button></a>
              </li>
            </ul>
          </div>
          {/* <button type="button" className="btn-menu-mo" title="메뉴 열기">햄버거버튼</button>
          <button type="button" className="btn-close-mo" title="메뉴 닫기"></button> */}
        </div>
      </nav>
    </header>
  );
};

export default Header;