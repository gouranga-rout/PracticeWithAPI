import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const PieChart = ({ data, month }) => {
  return (
    <div className="content small">
      <h2>Category Distribution - {month}</h2>
      <Pie
        data={{
          labels: data.labels || [],
          datasets: [
            {
              data: data.values || [],
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            },
          ],
        }}
      />
    </div>
  );
};

export default PieChart;

