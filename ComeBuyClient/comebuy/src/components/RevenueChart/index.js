import React, { useCallback, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import invoiceAPI from "../../api/invoiceAPI";
import productAPI from "../../api/productAPI";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { getAllInvoice } from "../../redux/slices/invoiceSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { DatePicker, Space, TimePicker } from "antd";
import Select from "rc-select";
import moment from "moment";
const { Option } = Select;

// const PickerWithType = ({ type, onChange }) => {
//   if (type === "time") return <TimePicker onChange={onChange} />;
//   if (type === "date") return <DatePicker onChange={onChange} />;
//   return <DatePicker picker={type} onChange={onChange} />;
// };

const handleMouseEnter = () => {};
const CustomizedAxisTick = props => {
  const { x, y, payload, width, maxChars, lineHeight, fontSize, fill } = props;
  const rx = new RegExp(`.{1,${maxChars}}`, "g");
  const chunks = payload.value
    .replace(/-/g, " ")
    .split(" ")
    .map(s => s.match(rx))
    .flat();
  const tspans = chunks.map((s, i) => (
    <tspan key={i} x={0} y={lineHeight} dy={i * lineHeight}>
      {s}
    </tspan>
  ));
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        width={width}
        height="auto"
        textAnchor="middle"
        fontSize={fontSize}
        fill={fill}
      >
        {tspans}
      </text>
    </g>
  );
};

CustomizedAxisTick.defaultProps = {
  width: 50,
  maxChars: 10,
  fontSize: 12,
  lineHeight: 14,
  fill: "#333",
};

const RevenueChart = props => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  async function LoadRevenueData() {
    try {
      const response = await invoiceAPI.RevenueByBranch(props.branchID);
      if (response.status === 200) {
        await UpdateProductForData(response.data);
      } else console.log("error");
    } catch (err) {
      console.log(err);
    }
  }

  const UpdateProductForData = async data => {
    try {
      const response = await productAPI.getAll();
      if (response) {
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < response.length; j++) {
            if (data[i].name === response[j].productID) {
              data[i].name = response[j].name.split("(")[0];
              break;
            }
          }
        }
        setData(data);
        setLoading(true);
      } else console.log("Error");
    } catch (err) {
      console.log(err);
    }
  };

  const dispatch = useDispatch();
  const [invoiceList, setInvoiceList] = useState([]);
  const [invoiceListYear, setInvoiceListYear] = useState([]);
  const [invoiceListMonth, setInvoiceListMonth] = useState([]);

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelelectedMonth] = useState("");
  console.log("🚀 ~ file: index.js:110 ~ RevenueChart ~ selectedMonth:", selectedMonth)
  const [selectedWeek, setSelectedWeek] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const onChangeYear = (date, dateString) => {
    // const formattedDate = moment(dateString).format("DD/MM/YYYY");
    setSelectedYear(dateString);
  };

  const onChangeMonth = (date, dateString) => {
    const formattedDate = moment(dateString).format("MM/YYYY");
    setSelelectedMonth(formattedDate);
  };

  const onChangeWeek = (date, dateString) => {
    const formattedDate = moment(dateString).format("DD/MM/YYYY");
    setSelectedWeek(formattedDate);
  };

  const onChange = (date, dateString) => {
    const formattedDate = moment(dateString).format("DD/MM/YYYY");
    setSelectedDate(formattedDate);
  };

  const handleFetchInvoiceYear = useCallback(async () => {
    let temp = [];
    try {
      const resultAction = await dispatch(getAllInvoice());
      const originalPromiseResult = unwrapResult(resultAction);

      // Tạo một đối tượng để theo dõi tổng của từng ngày
      const dailyTotals = {};

      let tempList = originalPromiseResult?.data?.map(invoice => {
        console.log("🚀 ~ file: index.js:144 ~ tempList ~ invoice:", invoice)
        if (invoice.isPaid) {
          let t = 0;
          invoice.invoiceitem.map(i => {
            t = t + Number(i.total);
          });

          const invoiceDate = invoice.date.split(" ")[0]; // Tách ngày từ chuỗi "date"
          // const year = new Date(invoiceDate).getFullYear().toString();
          const [day, month, year] = invoiceDate.split("/");
          // const formattedDate = `${year}-${month}-${day}`;
          // const parsedDate = new Date(formattedDate);
          // let yearAsString
          // if (!isNaN(parsedDate.getFullYear())) {
          //   yearAsString = parsedDate.getFullYear().toString();
          //   console.log(yearAsString); // Kết quả sẽ là "2023"
          // }
          // console.log(
          //   "🚀 ~ file: index.js:153 ~ tempList ~ year:",
          //   yearAsString
          // );
          if (dailyTotals[year]) {
            dailyTotals[year].total += t;
            dailyTotals[year].amount += invoice.invoiceitem[0]?.amount || 0;
            dailyTotals[year].originPrice += invoice.invoiceitem[0]?.product.colorcoverage || 0;
            dailyTotals[year].revenue += dailyTotals[year].total + dailyTotals[year].originPrice
          } else {
            dailyTotals[year] = {
              total: t,
              amount: invoice.invoiceitem[0]?.amount || 0,
              originPrice: invoice.invoiceitem[0]?.product.colorcoverage || 0,
              revenue: t + (invoice.invoiceitem[0]?.product.colorcoverage || 0),
            };
          }

          return {
            date: year,
            "Lợi nhuận (VND)": t,
            "Số lượng": invoice.invoiceitem[0]?.amount || 0,
          };
        }
        return null; // Trả về null cho các phần tử không thỏa mãn điều kiện
      });

      // Lọc các đối tượng null để loại bỏ các đối tượng không phù hợp
      tempList = tempList.filter(item => item !== null);
      console.log("tempList", dailyTotals);
      let finalList = [];

      if (selectedYear && dailyTotals[selectedYear]) {
        console.log("first");
        finalList.push({
          date: selectedYear,
          "Lợi nhuận (VND)": dailyTotals[selectedYear].total,
          "Số lượng": dailyTotals[selectedYear].amount,
          "Giá vốn (VND)": dailyTotals[selectedYear].originPrice,
          "Doanh thu (VND)": dailyTotals[selectedYear].revenue,
        });
      } else {
        console.log("dailyTotals", dailyTotals);
        finalList = Object.keys(dailyTotals).map(date => ({
          date,
          "Lợi nhuận (VND)": dailyTotals[date].total,
          "Số lượng": dailyTotals[date].amount,
          "Giá vốn (VND)": dailyTotals[date].originPrice,
          "Doanh thu (VND)": dailyTotals[date].revenue,
        }));
      }

      setInvoiceListYear(finalList);
    } catch (rejectedValueOrSerializedError) {
      console.log(rejectedValueOrSerializedError);
    }
  }, [selectedYear]);

  const handleFetchInvoiceMonth = useCallback(async () => {
    try {
      const resultAction = await dispatch(getAllInvoice());
      const originalPromiseResult = unwrapResult(resultAction);

      // Tạo một đối tượng để theo dõi tổng của từng ngày
      const dailyTotals = {};

      let tempList = originalPromiseResult?.data?.map(invoice => {
        if (invoice.isPaid) {
          let t = 0;
          invoice.invoiceitem.map(i => {
            t = t + Number(i.total);
          });

          const invoiceDate = invoice.date.split(" ")[0]; // Tách ngày từ chuỗi "date"
          // const year = new Date(invoiceDate).getFullYear().toString();
          const [day, month, year] = invoiceDate.split("/");
          const monthYearString = `${month}/${year}`;
          console.log(
            "🚀 ~ file: index.js:153 ~ tempList ~ year:",
            invoiceDate, monthYearString
          );
          if (dailyTotals[monthYearString]) {
            dailyTotals[monthYearString].total += t;
            dailyTotals[monthYearString].amount += invoice.invoiceitem[0]?.amount || 0;
            dailyTotals[monthYearString].originPrice += invoice.invoiceitem[0]?.product.colorcoverage || 0;
            dailyTotals[monthYearString].revenue += dailyTotals[monthYearString].total + dailyTotals[monthYearString].originPrice
          } else {
            dailyTotals[monthYearString] = {
              total: t,
              amount: invoice.invoiceitem[0]?.amount || 0,
              originPrice: invoice.invoiceitem[0]?.product.colorcoverage || 0,
              revenue: t + (invoice.invoiceitem[0]?.product.colorcoverage || 0),
            };
          }

          return {
            date: monthYearString,
            "Lợi nhuận (VND)": t,
            "Số lượng": invoice.invoiceitem[0]?.amount || 0,
          };
        }
        return null; // Trả về null cho các phần tử không thỏa mãn điều kiện
      });

      // Lọc các đối tượng null để loại bỏ các đối tượng không phù hợp
      tempList = tempList.filter(item => item !== null);
      console.log("tempList", dailyTotals);
      let finalList = [];

      if (selectedMonth && dailyTotals[selectedMonth]) {
        console.log("first");
        finalList.push({
          date: selectedMonth,
          "Lợi nhuận (VND)": dailyTotals[selectedMonth].total,
          "Số lượng": dailyTotals[selectedMonth].amount,
          "Giá vốn (VND)": dailyTotals[selectedMonth].originPrice,
          "Doanh thu (VND)": dailyTotals[selectedMonth].revenue,
        });
      } else {
        console.log("dailyTotals", dailyTotals);
        finalList = Object.keys(dailyTotals).map(date => ({
          date,
          "Lợi nhuận (VND)": dailyTotals[date].total,
          "Số lượng": dailyTotals[date].amount,
          "Giá vốn (VND)": dailyTotals[date].originPrice,
          "Doanh thu (VND)": dailyTotals[date].revenue,
        }));
      }

      setInvoiceListMonth(finalList);
    } catch (rejectedValueOrSerializedError) {
      console.log(rejectedValueOrSerializedError);
    }
  }, [selectedMonth]);

  const handleFetchInvoice = useCallback(async () => {
    let temp = [];
    try {
      const resultAction = await dispatch(getAllInvoice());
      const originalPromiseResult = unwrapResult(resultAction);

      // Tạo một đối tượng để theo dõi tổng của từng ngày
      const dailyTotals = {};

      let tempList = originalPromiseResult?.data?.map(invoice => {
        if (invoice.isPaid) {
          let t = 0;
          invoice.invoiceitem.map(i => {
            t = t + Number(i.total);
          });

          const invoiceDate = invoice.date.split(" ")[0]; // Tách ngày từ chuỗi "date"
          if (dailyTotals[invoiceDate]) {
            dailyTotals[invoiceDate].total += t;
            dailyTotals[invoiceDate].amount +=
              invoice.invoiceitem[0]?.amount || 0;
            dailyTotals[invoiceDate].originPrice += invoice.invoiceitem[0]?.product.colorcoverage || 0;
            dailyTotals[invoiceDate].revenue += dailyTotals[invoiceDate].total + dailyTotals[invoiceDate].originPrice
          } else {
            dailyTotals[invoiceDate] = {
              total: t,
              amount: invoice.invoiceitem[0]?.amount || 0,
              originPrice: invoice.invoiceitem[0]?.product.colorcoverage || 0,
              revenue: t + (invoice.invoiceitem[0]?.product.colorcoverage || 0),
            };
          }

          return {
            date: invoiceDate,
            "Lợi nhuận (VND)": t,
            "Số lượng": invoice.invoiceitem[0]?.amount || 0,
          };
        }
        return null; // Trả về null cho các phần tử không thỏa mãn điều kiện
      });

      // Lọc các đối tượng null để loại bỏ các đối tượng không phù hợp
      tempList = tempList.filter(item => item !== null);

      let finalList = [];
      let finalListYear = [];

      if (selectedDate && dailyTotals[selectedDate]) {
        finalList.push({
          date: selectedDate,
          "Lợi nhuận (VND)": dailyTotals[selectedDate].total,
          "Số lượng": dailyTotals[selectedDate].amount,
          "Giá vốn (VND)": dailyTotals[selectedDate].originPrice,
          "Doanh thu (VND)": dailyTotals[selectedDate].revenue,
        });
        setInvoiceList(finalList);
      } else {
        finalList = Object.keys(dailyTotals).map(date => ({
          date,
          "Lợi nhuận (VND)": dailyTotals[date].total,
          "Số lượng": dailyTotals[date].amount,
          "Giá vốn (VND)": dailyTotals[date].originPrice,
          "Doanh thu (VND)": dailyTotals[date].revenue,
        }));
        setInvoiceList(finalList);
      }
    } catch (rejectedValueOrSerializedError) {
      console.log(rejectedValueOrSerializedError);
    }
  }, [selectedDate]);

  useEffect(() => {
    handleFetchInvoice();
    return () => {
      setInvoiceList({});
    };
  }, [handleFetchInvoice]);

  useEffect(() => {
    handleFetchInvoiceYear();
    return () => {
      setInvoiceListYear({});
    };
  }, [handleFetchInvoiceYear]);

  useEffect(() => {
    handleFetchInvoiceMonth();
    return () => {
      setInvoiceListMonth({});
    };
  }, [handleFetchInvoiceMonth]);

  useEffect(() => {
    LoadRevenueData();
    return () => setData([]);
  }, []);

  const [type, setType] = useState("date");

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        flexWrap: "wrap",
        gap: '20px'
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Space>
          <DatePicker
            onChange={onChangeYear}
            placeholder="Chọn năm"
            picker="year"
          />
        </Space>
        <div
          style={{
            width: "800px",
            height: "600px",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            {data.length > 0 && loading === true ? (
              <BarChart
                BarChart
                width={500}
                height={300}
                data={invoiceListYear}
                margin={{
                  top: 30,
                  right: 0,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                {/* <XAxis dataKey="name" height={200} textAnchor="end" angle="30" scaleToFit="true" verticalAnchor="start" interval={0} stroke="#8884d8" /> */}
                <XAxis
                  dataKey="date"
                  // tick={<CustomizedAxisTick />}
                  // height={100}
                  // interval={0}
                  // stroke="#8884d8"
                />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#FFA500" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="Số lượng"
                  fill="#8884d8"
                  // label={{ position: "top" }}
                  barSize={30}
                />
                <Bar
                  yAxisId="right"
                  dataKey="Lợi nhuận (VND)"
                  fill="#82ca9d"
                  // label={{ position: "top" }}
                  barSize={30}
                />
                <Bar
                  yAxisId="right"
                  dataKey="Doanh thu (VND)"
                  fill="#FFA500"
                  // label={{ position: "top" }}
                  barSize={30}
                />
                <Bar
                  yAxisId="right"
                  dataKey="Giá vốn (VND)"
                  fill="#0000FF"
                  // label={{ position: "top" }}
                  barSize={30}
                />
              </BarChart>
            ) : (
              <Box sx={{ width: "100%" }}>
                {loading === true ? (
                  <Typography variant="h6">
                    Không có sản phẩm nào để hiển thị...
                  </Typography>
                ) : (
                  <Box sx={{ width: "100%" }}>
                    <LinearProgress />
                    <Typography
                      variant="h6"
                      sx={{ alignSelf: "center", margin: 5 }}
                    >
                      Loading....
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Space>
          <DatePicker
            onChange={onChangeMonth}
            placeholder="Chọn tháng"
            picker="month"
          />
        </Space>
        <div
          style={{
            width: "800px",
            height: "600px",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            {data.length > 0 && loading === true ? (
              <BarChart
                BarChart
                width={500}
                height={300}
                data={invoiceListMonth}
                margin={{
                  top: 30,
                  right: 0,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                {/* <XAxis dataKey="name" height={200} textAnchor="end" angle="30" scaleToFit="true" verticalAnchor="start" interval={0} stroke="#8884d8" /> */}
                <XAxis
                  dataKey="date"
                  // tick={<CustomizedAxisTick />}
                  // height={100}
                  // interval={0}
                  // stroke="#8884d8"
                />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#FFA500" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="Số lượng"
                  fill="#8884d8"
                  // label={{ position: "top" }}
                  barSize={30}
                />
                <Bar
                  yAxisId="right"
                  dataKey="Lợi nhuận (VND)"
                  fill="#82ca9d"
                  // label={{ position: "top" }}
                  barSize={30}
                />
                <Bar
                  yAxisId="right"
                  dataKey="Doanh thu (VND)"
                  fill="#FFA500"
                  // label={{ position: "top" }}
                  barSize={30}
                />
                <Bar
                  yAxisId="right"
                  dataKey="Giá vốn (VND)"
                  fill="#0000FF"
                  // label={{ position: "top" }}
                  barSize={30}
                />
              </BarChart>
            ) : (
              <Box sx={{ width: "100%" }}>
                {loading === true ? (
                  <Typography variant="h6">
                    Không có sản phẩm nào để hiển thị...
                  </Typography>
                ) : (
                  <Box sx={{ width: "100%" }}>
                    <LinearProgress />
                    <Typography
                      variant="h6"
                      sx={{ alignSelf: "center", margin: 5 }}
                    >
                      Loading....
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div
        style={{
          // display: "flex",
          // flexDirection: "column",
          display: 'none'
        }}
      >
        <Space>
          <DatePicker
            onChange={onChangeWeek}
            placeholder="Chọn tuần"
            picker="week"
          />
        </Space>
        <div
          style={{
            width: "800px",
            height: "600px",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            {data.length > 0 && loading === true ? (
              <BarChart
                BarChart
                width={500}
                height={300}
                data={invoiceList}
                margin={{
                  top: 30,
                  right: 0,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                {/* <XAxis dataKey="name" height={200} textAnchor="end" angle="30" scaleToFit="true" verticalAnchor="start" interval={0} stroke="#8884d8" /> */}
                <XAxis
                  dataKey="date"
                  // tick={<CustomizedAxisTick />}
                  // height={100}
                  // interval={0}
                  // stroke="#8884d8"
                />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="Số lượng"
                  fill="#8884d8"
                  // label={{ position: "top" }}
                  barSize={30}
                />
                <Bar
                  yAxisId="right"
                  dataKey="Lợi nhuận (VND)"
                  fill="#82ca9d"
                  // label={{ position: "top" }}
                  barSize={30}
                />
              </BarChart>
            ) : (
              <Box sx={{ width: "100%" }}>
                {loading === true ? (
                  <Typography variant="h6">
                    Không có sản phẩm nào để hiển thị...
                  </Typography>
                ) : (
                  <Box sx={{ width: "100%" }}>
                    <LinearProgress />
                    <Typography
                      variant="h6"
                      sx={{ alignSelf: "center", margin: 5 }}
                    >
                      Loading....
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Space>
          <DatePicker onChange={onChange} placeholder="Chọn ngày" />
        </Space>
        <div
          style={{
            width: "1000px",
            height: "800px",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            {data.length > 0 && loading === true ? (
              <BarChart
                BarChart
                width={500}
                height={300}
                data={invoiceList}
                margin={{
                  top: 30,
                  right: 0,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                {/* <XAxis dataKey="name" height={200} textAnchor="end" angle="30" scaleToFit="true" verticalAnchor="start" interval={0} stroke="#8884d8" /> */}
                <XAxis
                  dataKey="date"
                  // tick={<CustomizedAxisTick />}
                  // height={100}
                  // interval={0}
                  // stroke="#8884d8"
                />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#FFA500" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="Số lượng"
                  fill="#8884d8"
                  // label={{ position: "top" }}
                  barSize={30}
                />
                <Bar
                  yAxisId="right"
                  dataKey="Lợi nhuận (VND)"
                  fill="#82ca9d"
                  // label={{ position: "top" }}
                  barSize={30}
                />
                <Bar
                  yAxisId="right"
                  dataKey="Doanh thu (VND)"
                  fill="#FFA500"
                  // label={{ position: "top" }}
                  barSize={30}
                />
                <Bar
                  yAxisId="right"
                  dataKey="Giá vốn (VND)"
                  fill="#0000FF"
                  // label={{ position: "top" }}
                  barSize={30}
                />
              </BarChart>
            ) : (
              <Box sx={{ width: "100%" }}>
                {loading === true ? (
                  <Typography variant="h6">
                    Không có sản phẩm nào để hiển thị...
                  </Typography>
                ) : (
                  <Box sx={{ width: "100%" }}>
                    <LinearProgress />
                    <Typography
                      variant="h6"
                      sx={{ alignSelf: "center", margin: 5 }}
                    >
                      Loading....
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
export default RevenueChart;
