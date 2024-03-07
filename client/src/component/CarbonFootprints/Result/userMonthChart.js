import React, { useState, useEffect } from "react";
import { PieChart, Pie, Sector, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "전기", value: 400 },
  { name: "가스", value: 300 },
  { name: "수도", value: 300 },
  { name: "교통", value: 200 },
  { name: "폐기물", value: 2 },
];
const data01 = [
  { label: "전기", value: 300 },
  { label: "가스", value: 280 },
  { label: "수도", value: 100 },
  { label: "교통", value: 160 },
  { label: "폐기물", value: 1.6 },
];
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@_DATA 형상_(목적)@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// const userData = [
//   {
//     year: "2024",
//     months: [
//       {
//         month: "1",
//         details: [
//           { category: "electricity", label: "전기", value: "95.6" },
//           { category: "gas", label: "가스", value: "435.2" },
//           { category: "water", label: "수도", value: "6.7" },
//           { category: "transportation", label: "교통", value: "91.5" },
//           { category: "waste", label: "폐기물", value: "6.7" },
//           { category: "total", label: "전체", value: "652.7" },
//         ],
//       },
//       {
//         month: "2",
//         details: [
//           { category: "electricity", label: "전기", value: "95.6" },
//           { category: "gas", label: "가스", value: "435.2" },
//           { category: "water", label: "수도", value: "6.7" },
//           { category: "transportation", label: "교통", value: "91.5" },
//           { category: "waste", label: "폐기물", value: "6.7" },
//           { category: "total", label: "전체", value: "652.7" },
//         ],
//       },
//       {
//         month: "3",
//         details: [
//           { category: "electricity", label: "전기", value: "95.6" },
//           { category: "gas", label: "가스", value: "435.2" },
//           { category: "water", label: "수도", value: "6.7" },
//           { category: "transportation", label: "교통", value: "91.5" },
//           { category: "waste", label: "폐기물", value: "6.7" },
//           { category: "total", label: "전체", value: "652.7" },
//         ],
//       },
//     ],
//   },
// ];

// 전기, 가스, 수도, 교통, 폐기물, total
// const COLORS = ["#316EE6", "#FE7713", "#A364FF", "#FE5A82", "#4ACC9C", "#FF8042"];
const COLORS = { electricity: "#316EE6", gas: "#FE7713", water: "#A364FF", transportation: "#FE5A82", waste: "#4ACC9C", total: "#FF8042" };
const LABELS = [{ electricity: "전기", gas: "가스", water: "수도", transportation: "교통", waste: "폐기물", total: "전체" }];
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

function UserMonthChart() {
  const storedUserData = sessionStorage.getItem("userData"); // 세션접근
  const userData = JSON.parse(storedUserData); // 세션 userData 획득
  const [mypageInitialData, setMypageInitialData] = useState(null); //mypage data
  const [resultDataSet, setResultDataSet] = useState([]);

  const [activeIndex, setActiveIndex] = useState(0); // 차트 상태관리
  const [currentMonthchartData, setCurrentMonthchartData] = useState([]);
  const [previousMonthchartData, setPreviousMonthchartData] = useState([]);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth()는 0에서 시작하므로 1을 더해줍니다.

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);

  // 데이터 획득
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/carbonFootprint/mypage/${userData.userid}`);
        const data = await response.json();
        setMypageInitialData(data); // 초기 데이터 상태 업데이트
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (mypageInitialData) {
      // mypageInitialData가 설정되었을 때만 transformData를 호출
      setResultDataSet(transformData(mypageInitialData));
      // setChartData(resultDataSet[0].months[0]);
    }
  }, [mypageInitialData]); // mypageInitialData가 변경될 때마다 이 useEffect 실행

  const transformData = (data) => {
    // 데이터베이스 획득 데이터 년[{월[{...}]}] 형식 변경
    if (!data) {
      // data가 null이면 빈 배열을 반환
      return [];
    }

    const groupedData = {};

    data.forEach((entry) => {
      const date = new Date(entry.calculation_month);
      const year = date.getFullYear().toString();
      const month = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더해준다.

      const details = [
        { category: "electricity", label: "전기", value: parseFloat(entry.electricity) },
        { category: "gas", label: "가스", value: parseFloat(entry.gas) },
        { category: "water", label: "수도", value: parseFloat(entry.water) },
        { category: "transportation", label: "교통", value: parseFloat(entry.transportation) },
        { category: "waste", label: "폐기물", value: parseFloat(entry.waste) },
        { category: "total", label: "전체", value: parseFloat(entry.total) },
      ];

      if (!groupedData[year]) {
        groupedData[year] = [];
      }

      groupedData[year].push({ month, details });
    });

    return Object.keys(groupedData).map((year) => ({
      year,
      months: groupedData[year],
    }));
  };

  // 차트 작성 구역
  // useEffect(() => {
  //   if (resultDataSet && resultDataSet.length > 0) {
  //     const dataSet = resultDataSet[0].months[0];
  //     const filteredChartData = dataSet.details.filter((item) => item.category !== "total");
  //     setChartData(filteredChartData);
  //   }
  // }, [resultDataSet]);

  useEffect(() => {
    if (resultDataSet && resultDataSet.length > 0) {
      const selectedYearData = resultDataSet.find((d) => d.year === year.toString());
      console.log("2024 : ", selectedYearData);
      if (selectedYearData) {
        const selectedCurrentMonthData = selectedYearData.months.find((m) => m.month === month);
        const selectedPreviousMonthData = selectedYearData.months.find((m) => m.month === month - 1);
        if (selectedCurrentMonthData) {
          const filteredCurrentMonthData = selectedCurrentMonthData.details.filter((item) => item.category !== "total");
          const filteredPreviousMonthData = selectedPreviousMonthData.details.filter((item) => item.category !== "total");
          setCurrentMonthchartData(filteredCurrentMonthData);
          setPreviousMonthchartData(filteredPreviousMonthData);
        }
      }
    }
  }, [resultDataSet, year, month]);

  const onPieEnter = (_, index) => {
    setActiveIndex(index); // 활성 인덱스 업데이트
  };

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
    return (
      <g>
        <text style={{ fontSize: "20px", fontWeight: 900 }} x={cx} y={cy - 20} dy={8} textAnchor="middle" fill={fill}>
          {payload.label}
        </text>
        <Sector cx={cx} cy={cy} innerRadius={innerRadius + 5} outerRadius={outerRadius + 5} startAngle={startAngle} endAngle={endAngle} fill={fill} />
        <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={innerRadius - 10} outerRadius={innerRadius - 3} fill={fill} />
        <text x={cx + 5} y={cy + 20} textAnchor="middle" fill="#333" style={{ fontSize: "18px", fontWeight: 700 }}>{`${value} kg`}</text>
      </g>
    );
  };

  const renderActiveShape1 = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, value } = props;
    return (
      <g>
        <text style={{ fontSize: "20px" }} x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="#AAC">
          {`${month - 1} 월`}
        </text>
        <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} opacity={1} />
        {/* <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={innerRadius - 10} outerRadius={innerRadius - 3} fill={fill} /> */}
        <text x={cx + 5} y={cy + 20} textAnchor="middle" fill="#333" style={{ fontSize: "16px", fontWeight: 700 }}>{`${value} kg`}</text>
      </g>
    );
  };

  const CustomLegend = (props) => {
    const { payload } = props;
    console.log(payload)
    return (
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {payload.map((entry, index) => (
          <li key={`item-${index}`} style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
            <svg width="14" height="14" style={{ marginRight: 10 }}>
              <rect width="14" height="14" fill={entry.color} />
            </svg>
            <span>{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  // 콘솔 확인
  // console.log("userId:", userData.userid);
  // console.log("초기 mypageInitialData: ", mypageInitialData);
  // console.log("resultDataSet :", resultDataSet);
  // console.log("chartData", chartData);
  // console.log("fill", COLORS["electricity"]);
  // console.log("현재 년", year);
  // console.log("현재 월", month);
  console.log("현재 월", currentMonthchartData);
  console.log("전 월", previousMonthchartData);
  return (
    <>
      <div className="mypage-userchart">
        <div className="mypage-userchart__left">
          <div className="mypage-userchart-left__chartarea">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={currentMonthchartData}
                  nameKey="label"
                  cx="center"
                  cy={160}
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                >
                  {currentMonthchartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.category]} />
                  ))}
                </Pie>
                <Legend content={<CustomLegend />} />
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape1}
                  data={previousMonthchartData}
                  cx={90}
                  cy={90}
                  innerRadius={45}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                >
                  {previousMonthchartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.category]} opacity={0.5} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mypage-userchart__title">
            <h2>
              <span className="forest_green_text">{month}</span>월 결과안내
            </h2>
          </div>
        </div>
        <div className="mypage-userchart__right">12313</div>
      </div>
    </>
  );
}

export default UserMonthChart;
