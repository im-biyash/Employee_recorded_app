import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

const EmployeePieChart = ({ data }) => {
  return (
    <PieChart
      series={[
        {
          data: data.map((item) => ({
            id: item.position,
            value: item.count,
            label: item.position,
          })),
         
        },
      ]}
      width={450}
      height={250}
     
      slotProps={{
        legend: {
          labelStyle: {
            fontSize: 18,
            fill: 'white',
            font: 'bold',
          },
        },
      }}
    />
  );
};

export default EmployeePieChart;
