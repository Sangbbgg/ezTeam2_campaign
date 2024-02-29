import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Example = () => {
  const [mainInitialData, setMainInitialData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 현재 월을 기본값으로 설정
  const [opacity, setOpacity] = useState({ user: 1, average: 1 });

  const handleMouseEnter = (o) => {
    const { dataKey } = o;
    setOpacity({ ...opacity, [dataKey]: 0.5 });
  };

  const handleMouseLeave = (o) => {
    const { dataKey } = o;
    setOpacity({ ...opacity, [dataKey]: 1 });
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(Number(e.target.value));
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

  const averageData = {
    // 평균 데이터
    electricity: 32.5,
    gas: 38.9,
    water: 1.6,
    transportation: 270.8,
    waste: 0.6,
    total: 344.4,
  };

  const labels = {
    electricity: "전기",
    gas: "가스",
    water: "수도",
    transportation: "교통",
    waste: "폐기물",
    total: "total",
  };

  const colors = ["#316EE6", "#FE7713", "#A364FF", "#FE5A82", "#4ACC9C", "#FF8042"];

  // user data set
  console.log("mainInitialData", mainInitialData);
  // 평균 data set
  console.log("averageData", averageData);

  // user data 변경
  // 조건 : 1)년도는 1개년도 고정, 2)항목(5개)별 평균값

  // 변경 data-----------------
  // const data = [
  //   {
  //     currentMonth: mainInitialData.calculation_month의 월만
  //     name: labels의 값,
  //     user: labels별 mainInitialData의 평균,
  //     average: labels별 averageData 값,
  //     usertotal: mainInitialData.total의 평균,
  //     averagetotal: averageData.total값,
  //   }];

  // 함수작성 부분
  const transformData = (mainInitialData) => {
    if (!mainInitialData || mainInitialData.length === 0) {
      return [];
    }

    const groupedByMonth = {};

    // 월별로 데이터 그룹화
    mainInitialData.forEach((item) => {
      const month = new Date(item.calculation_month).getMonth() + 1;
      if (!groupedByMonth[month]) {
        groupedByMonth[month] = [];
      }
      groupedByMonth[month].push(item);
    });

    // 각 월별로 데이터 변환
    const transformed = Object.keys(groupedByMonth).flatMap((month) => {
      const items = groupedByMonth[month];
      const sum = {};
      const count = {};

      // 데이터 초기화 및 합계 계산
      Object.keys(labels).forEach((key) => {
        sum[key] = 0;
        count[key] = 0;

        items.forEach((item) => {
          if (key !== "total") {
            sum[key] += parseFloat(item[key]);
            count[key]++;
          }
        });

        sum["total"] += parseFloat(items[0]["total"]);
        count["total"]++;
      });

      // 평균 계산 및 데이터 구조 생성
      return Object.keys(labels).map((key) => ({
        currentMonth: parseInt(month, 10),
        name: labels[key],
        user: parseFloat((sum[key] / count[key]).toFixed(1)) || 0,
        average: averageData[key] || 0,
        usertotal: sum["total"] / count["total"] || 0,
        averagetotal: averageData["total"] || 0,
      }));
    });

    return transformed;
  };

  const transformedData = transformData(mainInitialData);
  console.log("transformedData", transformedData);

  // 변환된 데이터를 현재 선택된 월에 따라 필터링
  const filteredData = transformedData.filter((data) => data.currentMonth === selectedMonth);
  console.log("filteredData", filteredData);

  return (
    <div style={{ width: "100%" }}>
      <div className="mainchart_wrap">
        <select onChange={handleMonthChange} value={selectedMonth}>
          <option value="1">1월</option>
          <option value="2">2월</option>
          <option value="11">11월</option>
          <option value="12">12월</option>
        </select>
        {filteredData.length !== 0 ? (
          <div>
            여러분의 {selectedMonth}월의 평균 탄소배출 총량은 {filteredData[0].usertotal}kg/월 입니다.
          </div>
        ) : (
          <div>아직 {selectedMonth}월의 평균 탄소배출 총량은 집계 되지 않았어요</div>
        )}
      </div>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          width={500}
          height={300}
          data={filteredData}
          margin={{
            top: 50,
            right: 50,
            left: 0,
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
