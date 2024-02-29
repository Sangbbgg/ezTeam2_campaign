import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  {
    currentMonth: 1,
    name: "전기",
    user: 4000,
    average: 2400,
    amt: 1200,
  },
  {
    currentMonth: 1,
    name: "가스",
    user: 4000,
    average: 2400,
    amt: 1200,
  },
  {
    currentMonth: 1,
    name: "수도",
    user: 3000,
    average: 1398,
    amt: 1200,
  },
  {
    currentMonth: 1,
    name: "교통",
    user: 2000,
    average: 9800,
    amt: 1200,
  },
  {
    currentMonth: 1,
    name: "폐기물",
    user: 2000,
    average: 9800,
    amt: 1200,
  },
];

const Example = () => {
  const [mainInitialData, setMainInitialData] = useState(null);

  const [opacity, setOpacity] = useState({ user: 1, average: 1 });

  const handleMouseEnter = (o) => {
    const { dataKey } = o;
    setOpacity({ ...opacity, [dataKey]: 0.5 });
  };

  const handleMouseLeave = (o) => {
    const { dataKey } = o;
    setOpacity({ ...opacity, [dataKey]: 1 });
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/carbonFootprint/main`);
        const data = await response.json();
        setMainInitialData(data); // 초기 데이터 상태 업데이트
        // console.log(data);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchInitialData();
  }, []);
  console.log("mainInitialData",mainInitialData);
  return (
    <div style={{ width: "100%" }}>
      <select>
        <option value="11">11월</option>
        <option value="12">12월</option>
        <option value="1">1월</option>
        <option value="2">2월</option>
      </select>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
          <Line type="monotone" dataKey="average" strokeOpacity={opacity.average} stroke="#8884d8" activeDot={{ r: 10 }} />
          <Line type="monotone" dataKey="user" strokeOpacity={opacity.user} stroke="#82ca9d" activeDot={{ r: 10 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Example;
