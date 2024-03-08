import React, { useState, useEffect, forwardRef } from "react";
import { PieChart, Pie, Sector, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
const COLORS = {
  electricity: "#316EE6",
  gas: "#FE7713",
  water: "#A364FF",
  transportation: "#FE5A82",
  waste: "#4ACC9C",
  total: "#FF8042",
};
const labels = {
  electricity: "전기",
  gas: "가스",
  water: "수도",
  transportation: "교통",
  waste: "폐기물",
  total: "전체",
};
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

function UserMonthChart() {
  const storedUserData = sessionStorage.getItem("userData"); // 세션접근
  const userData = JSON.parse(storedUserData); // 세션 userData 획득
  const [mypageInitialData, setMypageInitialData] = useState([]); //mypage data
  const [calculationAdviceData, setCalculationAdviceData] = useState([]); //
  const [resultDataSet, setResultDataSet] = useState([]);

  const [activeIndex, setActiveIndex] = useState(0); // 차트 상태관리
  const [currentMonthchartData, setCurrentMonthchartData] = useState([]);
  const [previousMonthchartData, setPreviousMonthchartData] = useState([
    {
      category: "electricity",
      label: "전기",
      value: 0.0,
    },
    {
      category: "gas",
      label: "가스",
      value: 0.0,
    },
    {
      category: "water",
      label: "수도",
      value: 0.0,
    },
    {
      category: "transportation",
      label: "교통",
      value: 0.0,
    },
    {
      category: "waste",
      label: "폐기물",
      value: 0.0,
    },
  ]);

  const [startDate, setStartDate] = useState(new Date());
console.log("startDate :",startDate)
  const [beforeYear, setBeforeYear] = useState(startDate.getFullYear());
  const [checkYear, setCheckYear] = useState(startDate.getFullYear());
  const [beforeMonth, setBeforeMonth] = useState(1);
  const [checkMonth, setCheckMonth] = useState(startDate.getMonth() + 1);

  const [isDataCheck, setIsDataCheck] = useState(false);

  const [isActive, setIsActive] = useState(true);

  // 데이터 피커
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [buttonCSS, setButtonCSS] = useState();

  // 
  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <button
      className={`example-custom-input ${buttonCSS}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      onClick={(e) => {
        onClick(e);
        setIsClicked(true);
        setButtonCSS("active");
      }}
      ref={ref}
    >
      {value}
    </button>
  ));

  useEffect(() => {
    setCheckYear(startDate.getFullYear());
    setCheckMonth(startDate.getMonth() + 1);
  }, [startDate]);

  // 에니메이면 클래스 추가
  useEffect(() => {
    // 컴포넌트가 마운트된 후 1.8초 후에 클래스를 제거
    const timer = setTimeout(() => {
      setIsActive(false);
    }, 1800);

    // 컴포넌트가 언마운트될 때 타이머를 정리
    return () => clearTimeout(timer);
  }, []);

  // 데이터 획득
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/carbonFootprint/mypage/${userData.userid}`);
        const data = await response.json();
        setMypageInitialData(data.mypageInitialData); // 초기 데이터 상태 업데이트
        setCalculationAdviceData(data.calculationAdviceData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchInitialData();
  }, []);

  // 획득 데이터 확인시 데이터 전달
  useEffect(() => {
    if (mypageInitialData) {
      // mypageInitialData가 설정되었을 때만 transformData를 호출
      setResultDataSet(transformData(mypageInitialData));
      // setChartData(resultDataSet[0].months[0]);
    }
  }, [mypageInitialData]); // mypageInitialData가 변경될 때마다 이 useEffect 실행

  // 데이터 포멧변경 함수
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

  // 이전 작성된 최근의 월 데이터 획득 함수 / 최초 자료 2023년 12월
  function findPreviousMonthData(dataSet, currentMonth) {
    // 현재 연도와 월을 정수로 변환
    let year = parseInt(startDate.getFullYear());
    let month = currentMonth

    // 2023년 이후 데이터만 처리
    while (year >= 2023) {
      // 현재 월에서 이전 월로 이동
      while (month > 1) {
        month -= 1; // 한 달 감소
        const yearData = dataSet.find((d) => parseInt(d.year) === year);
        
        if (yearData) {
          // 해당 연도에서 월 데이터 찾기
          const monthData = yearData.months.find((m) => parseInt(m.month) === month);
          if (monthData) {
            return (setBeforeYear(yearData.year),setBeforeMonth(monthData)) // 데이터 반환
          }
        }
      }

      // 2023년 1월에 도달했을 경우 종료
      if (year === 2023 && month <= 1) {
        break;
      }

      // 1월에 도달하면 이전 연도로 이동
      if (month === 1) {
        year -= 1; // 연도 감소
        month = 13; // 12월로 설정하기 위해 13에서 시작
      }
    }

    return null; // 데이터를 찾지 못했을 경우 null 반환
  }

  useEffect(() => {
    findPreviousMonthData(resultDataSet, checkMonth);
    console.log("전월데이터 년도 :",beforeYear);
    console.log("최근월 데이터 :",beforeMonth);
    // 현재 선택된 년도를 기준 월별 데이터를 추출
    const selectedYearData = resultDataSet.find((d) => d.year === checkYear.toString());
    // console.log("월별데이터추출:", selectedYearData);
    // 지정된 년도에 선택된 월 데이터 유무 확인
    // 선택년도가 정상이라면
    if (selectedYearData !== undefined) {
      // 정상적인 년도 기준 월별데이터에서 지정 월 데이터를 추출
      const selectedMonthData = selectedYearData.months.find((m) => m.month === checkMonth);
      console.log(`선택월 : ${checkMonth}월 / 출력 데이터:`, selectedMonthData);
      // 추출된 월 데이터가 정상이며
      if (selectedMonthData !== undefined) {
      }
    }

    // setIsDataCheck(selectedYearData);

    if (selectedYearData !== undefined) {
      const checkData = selectedYearData.months.find((m) => m.month === checkMonth);
      const checkData1 = selectedYearData.months.find((m) => m.month === (checkMonth - 1 === 0 ? 12 : 1));

      if (checkData && checkData1) {
        // setIsMonthCheck(true);

        const filteredCurrentMonthData = checkData.details.filter((item) => item.category !== "total");
        setCurrentMonthchartData(filteredCurrentMonthData);

        const filteredPreviousMonthData = checkData1.details.filter((item) => item.category !== "total");
        setPreviousMonthchartData(filteredPreviousMonthData);
      } else {
        // setIsMonthCheck(false);
      }
    }
    // const checkData = selectedYearData.months.find((m) => m.month === checkMonth - 1);
    // console.log("ll",selectedYearData.month)
    // if (resultDataSet && resultDataSet.length > 0) {
    //   const selectedYearData = resultDataSet.find((d) => d.year === year.toString());
    //   const checkData = selectedYearData.months.find((m) => m.month === checkMonth - 1);
    //   const isMonthCheck = checkData === undefined;
    //   console.log("해당월", checkMonth);
    //   console.log("data체크", checkData);
    //   console.log("확인", isMonthCheck);
    //   if (isMonthCheck) {
    //     const selectedCurrentMonthData = selectedYearData.months.find((m) => m.month === checkMonth);
    //     const filteredCurrentMonthData = selectedCurrentMonthData.details.filter((item) => item.category !== "total");
    //     setCurrentMonthchartData(filteredCurrentMonthData);
    //   } else {
    //     const selectedCurrentMonthData = selectedYearData.months.find((m) => m.month === checkMonth);
    //     const selectedPreviousMonthData = selectedYearData.months.find((m) => m.month === checkMonth - 1);
    //     if (selectedCurrentMonthData && selectedPreviousMonthData) {
    //       const filteredCurrentMonthData = selectedCurrentMonthData.details.filter((item) => item.category !== "total");
    //       const filteredPreviousMonthData = selectedPreviousMonthData.details.filter(
    //         (item) => item.category !== "total"
    //       );
    //       setCurrentMonthchartData(filteredCurrentMonthData);
    //       setPreviousMonthchartData(filteredPreviousMonthData);
    //     }
    //   }
    // }
  }, [resultDataSet, checkYear, checkMonth, isDataCheck]);

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
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius + 5}
          outerRadius={outerRadius + 5}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={innerRadius - 10}
          outerRadius={innerRadius - 3}
          fill={fill}
        />
        <text
          x={cx + 5}
          y={cy + 20}
          textAnchor="middle"
          fill="#333"
          style={{ fontSize: "18px", fontWeight: 700 }}
        >{`${value} kg`}</text>
      </g>
    );
  };

  const renderActiveShape1 = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, value } = props;
    return (
      <g>
        <text style={{ fontSize: "20px" }} x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="#AAC">
          {`${beforeMonth} 월`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={1}
        />
        <text
          x={cx + 5}
          y={cy + 20}
          textAnchor="middle"
          fill="#333"
          style={{ fontSize: "16px", fontWeight: 700 }}
        >{`${value} kg`}</text>
      </g>
    );
  };

  const CustomLegend = (props) => {
    // 목록 커스텀
    const { payload } = props;
    // console.log(payload);

    const currentMonthfilteredPayload = currentMonthchartData.filter((entry) =>
      payload.some((data) => data.value === entry.label)
    );
    const previousMonthfilteredPayload = previousMonthchartData.filter((entry) =>
      payload.some((data) => data.value === entry.label)
    );
    // console.log("a:", currentMonthfilteredPayload);
    // console.log("b:", previousMonthfilteredPayload);
    // console.log("c:", previousMonthchartData);
    return (
      <ul className={`mypage-left-chart__ul ${isActive ? "load" : ""}`}>
        <li>{beforeMonth}월 대비 저감량</li>
        {currentMonthfilteredPayload.map((entry, index) => (
          <li key={`item-${index}`}>
            <div>
              <svg width="14" height="14" style={{ marginRight: 10 }}>
                <rect width="14" height="14" fill={COLORS[entry.category]} />
              </svg>
              <span>{entry.label}</span>
              {entry.value - previousMonthfilteredPayload[index].value > 0 ? (
                <span style={{ color: "red" }}>
                  +{(entry.value - previousMonthfilteredPayload[index].value).toFixed(1)} kg
                </span>
              ) : (
                <span style={{ color: "#0095ff" }}>
                  {(entry.value - previousMonthfilteredPayload[index].value).toFixed(1)} kg
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  // 콘솔 확인
  // console.log("userId:", userData.userid);
  // console.log("초기 mypageInitialData: ", mypageInitialData);
  // console.log("초기 calculationAdviceData: ", calculationAdviceData);
  // console.log("resultDataSet :", resultDataSet);

  // console.log("fill", COLORS["electricity"]);
  // console.log("현재 년", year);
  // console.log("현재 월", month);
  // console.log("현재 월데이터", currentMonthchartData);
  // console.log("전 월데이터", previousMonthchartData);

  const undefinedDataRender = (
    <div className="mypage-userchart">
      <div className="no-data-w">
        <div className="no-data">
          <p className="tit">계산 결과가 없습니다.</p>
        </div>
      </div>
    </div>
  );
  const userChartRender = (
    <div>
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
                  nameKey="label"
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
          <div className={`mypage-userchart__title ${isActive ? "load" : ""}`}>
            <h2>
              <span className="forest_green_text">{checkMonth}</span>월 결과안내
            </h2>
          </div>
        </div>
        <div className="mypage-userchart__right"></div>
      </div>
    </div>
  );
  return (
    <>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        dateFormat="yyyy년 MM월"
        showMonthYearPicker
        showFullMonthYearPicker
        open={isHovered || isClicked}
        customInput={<ExampleCustomInput />}
        onClickOutside={() => setIsClicked(false)}
      />
      {!isDataCheck ? undefinedDataRender : userChartRender}
    </>
  );
}

export default UserMonthChart;