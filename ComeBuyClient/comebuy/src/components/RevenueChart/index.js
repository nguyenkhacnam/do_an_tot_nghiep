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
  const [selectedDate, setSelectedDate] = useState("");

  const onChange = (date, dateString) => {
    const formattedDate = moment(dateString).format("DD/MM/YYYY");
    setSelectedDate(formattedDate);
  };

  const handleFetchInvoice = useCallback(async () => {
    let temp = [];
    if (!invoiceList.length) {
      try {
        const resultAction = await dispatch(getAllInvoice());
        const originalPromiseResult = unwrapResult(resultAction);

        // Tạo một đối tượng để theo dõi tổng của từng ngày
        const dailyTotals = {};

        let tempList = originalPromiseResult?.data?.map(invoice => {
          if (invoice.isChecked) {
            let t = 0;
            invoice.invoiceitem.map(i => {
              t = t + Number(i.total);
            });

            const invoiceDate = invoice.date.split(" ")[0]; // Tách ngày từ chuỗi "date"

            if (dailyTotals[invoiceDate]) {
              dailyTotals[invoiceDate].total += t;
              dailyTotals[invoiceDate].amount +=
                invoice.invoiceitem[0]?.amount || 0;
            } else {
              dailyTotals[invoiceDate] = {
                total: t,
                amount: invoice.invoiceitem[0]?.amount || 0,
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

        if (selectedDate && dailyTotals[selectedDate]) {
          finalList.push({
            date: selectedDate,
            "Lợi nhuận (VND)": dailyTotals[selectedDate].total,
            "Số lượng": dailyTotals[selectedDate].amount,
          });
        } else {
          console.log("dailyTotals", dailyTotals);
          finalList = Object.keys(dailyTotals).map(date => ({
            date,
            "Lợi nhuận (VND)": dailyTotals[date].total,
            "Số lượng": dailyTotals[date].amount,
          }));
        }

        setInvoiceList(finalList);
      } catch (rejectedValueOrSerializedError) {
        console.log(rejectedValueOrSerializedError);
      }
    } else {
      if (selectedDate) {
        try {
          const resultAction = await dispatch(getAllInvoice());
          const originalPromiseResult = unwrapResult(resultAction);

          // Tạo một đối tượng để theo dõi tổng của từng ngày
          const dailyTotals = {};

          let tempList = originalPromiseResult?.data?.map(invoice => {
            if (invoice.isChecked) {
              let t = 0;
              invoice.invoiceitem.map(i => {
                t = t + Number(i.total);
              });

              const invoiceDate = invoice.date.split(" ")[0]; // Tách ngày từ chuỗi "date"

              if (dailyTotals[invoiceDate]) {
                dailyTotals[invoiceDate].total += t;
                dailyTotals[invoiceDate].amount +=
                  invoice.invoiceitem[0]?.amount || 0;
              } else {
                dailyTotals[invoiceDate] = {
                  total: t,
                  amount: invoice.invoiceitem[0]?.amount || 0,
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

          if (selectedDate && dailyTotals[selectedDate]) {
            finalList.push({
              date: selectedDate,
              "Lợi nhuận (VND)": dailyTotals[selectedDate].total,
              "Số lượng": dailyTotals[selectedDate].amount,
            });
          } else {
            console.log("dailyTotals", dailyTotals);
            finalList = Object.keys(dailyTotals).map(date => ({
              date,
              "Lợi nhuận (VND)": dailyTotals[date].total,
              "Số lượng": dailyTotals[date].amount,
            }));
          }

          setInvoiceList(finalList);
        } catch (rejectedValueOrSerializedError) {
          console.log(rejectedValueOrSerializedError);
        }
      }
    }
  }, [selectedDate]);

  useEffect(() => {
    handleFetchInvoice();
    return () => {
      setInvoiceList({});
    };
  }, [handleFetchInvoice]);

  useEffect(() => {
    LoadRevenueData();
    return () => setData([]);
  }, []);

  const [type, setType] = useState("date");

  return (
    <>
      <Space>
        <DatePicker onChange={onChange} />
      </Space>
      <div style={{
        width: '500px',
        height: '300px'
      }}>
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
                tick={<CustomizedAxisTick />}
                height={100}
                interval={0}
                stroke="#8884d8"
              />
              <YAxis yAxisId="left" orientation="left" stroke="#380E73" />
              <YAxis yAxisId="right" orientation="right" stroke="#2e1534" />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="Số lượng"
                fill="#8884d8"
                label={{ position: "top" }}
              />
              <Bar
                yAxisId="right"
                dataKey="Lợi nhuận (VND)"
                fill="#82ca9d"
                label={{ position: "top" }}
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
    </>
  );
};
export default RevenueChart;
