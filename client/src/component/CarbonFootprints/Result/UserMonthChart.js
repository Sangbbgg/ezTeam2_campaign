import React, { useState } from "react";
import { PieChart, Pie, Sector, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "전기", value: 400 },
  { name: "가스", value: 300 },
  { name: "수도", value: 300 },
  { name: "교통", value: 200 },
  { name: "폐기물", value: 2 },
];
const data01 = [
  { name: "전기", value: 300 },
  { name: "가스", value: 280 },
  { name: "수도", value: 100 },
  { name: "교통", value: 160 },
  { name: "폐기물", value: 1.6 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#0C8972"];

function UserMonthChart() {
  const [activeIndex, setActiveIndex] = useState(null);

  // 배출량 차트
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value, name } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        {/* <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}> */}
        <text x={cx - 50} y={cy - 50} dy={8} fill={fill}>{payload.name}</text>
        <text x={cx - 50} y={cy - 100} dy={8} >{`${value} kg/월`}</text>
        <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
        <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={innerRadius - 10} outerRadius={innerRadius - 5} fill={fill} />
        {/* <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" /> */}
        {/* <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" /> */}
        {/* <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${name}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#333">{`${value} kg/월`}</text> */}
        {/* <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={36} textAnchor={textAnchor} fill="#999">
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text> */}
      </g>
    );
  };

  // 저감 목표 차트
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="middle">
        {`${value} kg`}
      </text>
    );
  };

  return (
    <>
      <div className="carbon-mypage-userchart__wrap">
        {/* 요구사항 정리용 */}
        <div className="sang">
          1. 처음 화면에 당월 데이터가 있다면 당월 계산 내역이 출력
          <br />
          1-1. 왼쪽: total pi차트 + 하단 목표 배출량 왼쪽에서 오른쪽으로 var 차트 / 오른쪽: 월별 탭형식의 세부 전월 목표량, 당월 배출량 비교 가능한 bar형 차트 제공 + 꺽은선 추이 추가
          <br />
          2.
        </div>
        <div className="carbon-mypage__userchart">
          <div className="carbon-mypage-userchart-title__wrap">
            <h2>{}월 탄소 배출량</h2>
          </div>
          <div className="carbon-mypage__chart-wrap">
            <div className="carbon-mypage__pichart">
              <div className="carbon-mypage__pichart-title">
                <p>당월 탄소 배출량</p>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart width={800} height={800}>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={120}
                    outerRadius={200}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* <div className="carbon-mypage__subpichart">
                <div className="carbon-mypage__subpichart-title">
                  <p>전월 저감 목표</p>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart
                    width={400}
                    height={400}
                    margin={{
                      top: 0,
                      right: 0,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <Pie data={data01} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={80} fill="#8884d8" dataKey="value">
                      {data01.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserMonthChart;
