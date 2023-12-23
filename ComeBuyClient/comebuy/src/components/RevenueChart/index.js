import React, { useEffect, useState } from 'react';
import { BarChart, Bar,  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import invoiceAPI from '../../api/invoiceAPI';
import productAPI from '../../api/productAPI';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { Typography } from '@mui/material';

const handleMouseEnter = () => {
}
const CustomizedAxisTick = (props) => {
  const { x, y, payload, width, maxChars, lineHeight, fontSize, fill } = props;
  const rx = new RegExp(`.{1,${maxChars}}`, 'g');
  const chunks = payload.value.replace(/-/g, ' ').split(' ').map(s => s.match(rx)).flat();
  const tspans = chunks.map((s, i) => <tspan key={i} x={0} y={lineHeight} dy={(i * lineHeight)}>{s}</tspan>);
  return (
    <g transform={`translate(${x},${y})`}>
      <text width={width} height="auto" textAnchor="middle" fontSize={fontSize} fill={fill}>
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
  fill: "#333"
};

const RevenueChart = (props) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  async function LoadRevenueData() {
    try {
      const response = await invoiceAPI.RevenueByBranch(props.branchID)
      if (response.status == 200) {
        await UpdateProductForData(response.data)
      }
      else
        console.log("error")
    }
    catch (err) {
      console.log(err)
    }
  }
  const UpdateProductForData = async (data) => {
    console.log("🚀 ~ file: index.js:50 ~ UpdateProductForData ~ data:", data)
    try {
      const response = await productAPI.getAll()
      if (response) {
        
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < response.length; j++) {
            if (data[i].name == response[j].productID) {
              data[i].name = response[j].name.split('(')[0]
              break;
            }
          }
        }
        setData(data)
        setLoading(true)
      }
      else
        console.log("Error")
    }
    catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    LoadRevenueData()
    return () => setData([])
  }, [])
  return (
    <ResponsiveContainer width='95%' height='100%'>
      {data.length > 0 && loading === true ?
        <BarChart BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 30,
            right: 0,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          {/* <XAxis dataKey="name" height={200} textAnchor="end" angle="30" scaleToFit="true" verticalAnchor="start" interval={0} stroke="#8884d8" /> */}
          <XAxis dataKey="name" tick={<CustomizedAxisTick />} height={100} interval={0} stroke="#8884d8" />
          <YAxis yAxisId="left" orientation="left" stroke="#380E73" />
          <YAxis yAxisId="right" orientation="right" stroke="#2e1534" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="Profit" fill="#380E73" label={{ position: 'top' }} />
          <Bar yAxisId="right" dataKey="Amount" fill="#2e1534" label={{ position: 'top' }} />
        </BarChart>
        :
        <Box sx={{ width: '100%' }}>
          {
            loading === true ?
              <Typography variant='h6'>Không có sản phẩm nào để hiển thị...</Typography> :
              <Box sx={{ width: '100%' }}>
                <LinearProgress />
                <Typography variant='h6' sx={{ alignSelf: 'center', margin: 5 }}>Loading....</Typography>
              </Box>
          }
        </Box>
      }
    </ResponsiveContainer >
  );

}
export default RevenueChart;
