import "./App.css";
import { Routes, Route } from "react-router-dom";
// import { useState, useEffect } from "react";
import Main from "./views/Main";
import Campaign from "./views/Campaign";
import CampaignWrite from "./views/CampaignWrite";
import CampaignDetail from "./views/CampaignDetail";
import CampaignEdit from "./views/CampaignEdit";

// 김민호(임시)-----------------
import LoginPage from "./component/Logins/Login";
import Modify from "./component/Logins/Modify";
import Regester from "./component/Logins/Regester";
import RegesterPersonal from "./component/Logins/RegesterPersonal";
import RegesterGroup from "./component/Logins/RegisterGroup";
import RegesterCorporate from "./component/Logins/RegisterCorporate";

import CarbonFootprint from "./views/CarbonFootprint";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main />}></Route>
        {/* 김지수 */}
        <Route path="/campaign" element={<Campaign />}></Route>
        <Route path="/campaign/write" element={<CampaignWrite />}></Route>
        <Route path="/campaign/edit/:id" element={<CampaignEdit />}></Route>
        <Route path="/campaign/detail/:id" element={<CampaignDetail />}></Route>
        {/* 상호형 */}
        <Route exact path="/carbonFootprint" element={<CarbonFootprint />} />
        {/* 김민호 */}
        <Route path="/Login" element={<LoginPage />}></Route>
        <Route path="/Modify" element={<Modify />}></Route>
        <Route path="/Regester" element={<Regester />}></Route>
        <Route path="/Regester/personal" element={<RegesterPersonal />}></Route>
        <Route path="/Regester/corporate" element={<RegesterCorporate />}></Route>
        <Route path="/Regester/group" element={<RegesterGroup />}></Route>
      </Routes>
    </div>
  );
}

export default App;
