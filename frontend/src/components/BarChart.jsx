import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ month }) => {
  const [chartData, setChartData] = useState({ labels: [], values: [] });

  // Fetch data for the bar chart when the component mounts or the month changes
  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        const response = await fetch(`https://practicewithapi.onrender.com/api/chart/bar?month=${month}`);
        const data = await response.json();
        setChartData(data); // Store the fetched data in the state
      } catch (error) {
        console.error("Error fetching bar chart data:", error);
      }
    };

    fetchBarChartData(); // Call the function to fetch data
  }, [month]); // Re-fetch data whenever the month changes

  return (
    <div className="content">
      <h2>Sales by Price Range - {month}</h2>
      <Bar
        data={{
          labels: chartData.labels,  // Use fetched labels
          datasets: [
            {
              label: 'Number of Transactions',
              data: chartData.values,  // Use fetched values
              backgroundColor: 'rgba(75, 192, 192, 0.6)',  // Set the color for bars
              borderColor: 'rgba(75, 192, 192, 1)',  // Border color of bars
              borderWidth: 1,  // Border width
            },
          ],
        }}
        options={{
          responsive: true,  // Make the chart responsive
          plugins: {
            legend: {
              position: 'top',  // Position the legend at the top
            },
            tooltip: {
              enabled: true,  // Enable tooltips for bar chart
            },
          },
          scales: {
            x: {
              beginAtZero: true,  // Ensure the x-axis starts at zero
            },
            y: {
              beginAtZero: true,  // Ensure the y-axis starts at zero
            },
          },
        }}
      />
    </div>
  );
};

export default BarChart;

