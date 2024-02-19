import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Main from './views/Main';
import Campaign from './views/Campaign';
import CampaignWrite from './views/CampaignWrite';
import CampaignDetail from './views/CampaignDetail';
import CampaignEdit from './views/CampaignEdit';

import CarbonFootprint from "./views/CarbonFootprint";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Main />}></Route>

        <Route path='/campaign' element={<Campaign />}></Route>
        <Route path='/campaign/write' element={<CampaignWrite />}></Route>
        <Route path='/campaign/edit/:id' element={<CampaignEdit />}></Route>
        <Route path='/campaign/detail/:id' element={<CampaignDetail />}></Route>
        <Route exact path="/carbonFootprint" element={<CarbonFootprint />} />
      </Routes>
    </div>
  );
}

export default App;
