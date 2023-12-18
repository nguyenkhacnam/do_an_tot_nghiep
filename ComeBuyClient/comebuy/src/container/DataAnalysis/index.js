import { CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import aiApi from "../../api/aiAPI";
import React, { PureComponent } from "react";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct } from "../../redux/slices/productSlice";
import { productListSelector } from "../../redux/selectors";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

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
  fontSize: 9,
  lineHeight: 14,
  fill: "#333",
};

const DataAnalysis = () => {
  const dispatch = useDispatch();
  const _productList = useSelector(productListSelector);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  let sortedListPr = _productList.slice().sort((a, b) => {
    return a.keyIndex - b.keyIndex;
  });

  const handleChange = event => {
    setSelectedMonth(event.target.value);
  };
  useEffect(() => {
    const fetchData = async () => {
      await AnalysisNewData();
    };
    fetchData();
  }, [selectedMonth]);

  const prepareData = (listPr, _month) => {
    let data_block_num_list = [];
    let branch_id_list = [];
    let item_id_list = [];
    let item_feature_id_list = [];
    let item_price_list = [];
    let month = [];
    let year = [];
    let searching = [];
    listPr = listPr.slice().sort((a, b) => {
      return a.keyIndex - b.keyIndex;
    });
    listPr.map(ite => {
      data_block_num_list.push(Math.floor(Math.random() * 30) + 1);
      branch_id_list.push(1); // main brach is 1
      item_id_list.push(ite.keyIndex);
      item_feature_id_list.push(ite.feature.length);
      item_price_list.push(ite.price);
      month.push(new Date().getMonth() + 1);
      year.push(new Date().getFullYear());
      searching.push(Math.floor(Math.random() * 10) + 1);
    });

    return {
      date_block_num: data_block_num_list,
      branch_id: branch_id_list,
      item_id: item_id_list,
      item_feature_id: item_feature_id_list,
      item_price: item_price_list,
      month: month,
      year: year,
      searching: searching,
    };
  };
  const AnalysisNewData = async () => {
    console.log("first");
    const response = await aiApi.dataAnalysis(
      prepareData(_productList, selectedMonth)
    );
    console.log("first11111111111");

    if (response?.status === 200) {
      let tempData = [];
      await JSON.parse(response.data.result).map((ite, i) => {
        const pr = sortedListPr.filter((ite, j) => j == i);
        const namePr = pr[0].name.split(" (")[0];
        tempData.push({
          name: namePr,
          "Trend Index": ite / 1000,
        });
      });
      setResult(tempData);
      setLoading(false);
    } else {
      console.log("Loi ");
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancel = false;
    const fetchData = async () => {
      if (sortedListPr.length === 0) {
        if (cancel) return;
        dispatch(getAllProduct())
          .unwrap()
          .then(async originalPromiseResult => {
            const response = await aiApi.dataAnalysis(
              prepareData(originalPromiseResult, selectedMonth)
            );
            if (response?.status == 200) {
              if (cancel) return;
              let tempData = [];
              await JSON.parse(response.data.result).map((ite, i) => {
                const pr = sortedListPr.filter((ite, j) => j == i);
                const namePr = pr[0].name.split(" (")[0];
                tempData.push({
                  name: namePr,
                  "Trend Index": ite / 1000,
                });
              });
              setResult(tempData);
              setLoading(false);
            } else {
              console.log("Loi ");
              setLoading(false);
            }
          })
          .catch(rejectedValueOrSerializedError => {
            console.log("Error load product");
            // setMessageError("Error Load Product List")
            // setOpenErrorAlert(true)
          });
      } else {
        const response = await aiApi.dataAnalysis(
          prepareData(_productList, selectedMonth)
        );
        if (response?.status == 200) {
          if (cancel) return;
          let tempData = [];
          await JSON.parse(response.data.result).map((ite, i) => {
            const pr = sortedListPr.filter((ite, j) => j == i);
            const namePr = pr[0].name.split(" (")[0];
            tempData.push({
              name: namePr,
              "Trend Index": ite / 1000,
            });
          });
          setResult(tempData);
          console.log(tempData);
          setLoading(false);
        } else {
          console.log("Loi ");
          setLoading(false);
        }
      }
    };
    fetchData()
    return () => (cancel = true);
  }, []);
  return (
    <Stack sx={{ height: "100%", width: "100%" }}>
      <FormControl sx={{ width: 100, p: 1, ml: 5 }}>
        <InputLabel id="demo-simple-select-label">Month</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedMonth}
          label="Month"
          onChange={handleChange}
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={6}>6</MenuItem>
          <MenuItem value={7}>7</MenuItem>
          <MenuItem value={8}>8</MenuItem>
          <MenuItem value={9}>9</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={11}>11</MenuItem>
          <MenuItem value={12}>12</MenuItem>
        </Select>
      </FormControl>
      {loading ? (
        <CircularProgress />
      ) : (
        <Stack sx={{ height: "90%", width: "100%" }}>
          {result == null ? (
            <Typography>Can't Get Result :(((</Typography>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                width={500}
                height={400}
                data={result}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
              >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis
                  dataKey="name"
                  tick={<CustomizedAxisTick />}
                  height={100}
                  interval={0}
                  stroke="#8884d8"
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Trend Index" barSize={50} fill="#413ea0" />
                <Line type="monotone" dataKey="Trend Index" stroke="#ff7300" />
              </ComposedChart>
              {/* <LineChart width={300} height={100} data={result}>
                                        <Line type="monotone" dataKey="Trend Index" stroke="#8884d8" strokeWidth={2} />
                                    </LineChart> */}
            </ResponsiveContainer>
          )}
        </Stack>
      )}
    </Stack>
  );
};
export default DataAnalysis;
