import React from 'react';

const StatisticsBox = ({ statistics, month }) => {
  return (
    <div className="stats-container">
      <h2>Statistics - {month}</h2>
      <div>
        <p>Total Sales: ${statistics.totalSales || 0}</p>
        <p>Sold Items: {statistics.soldItems || 0}</p>
        <p>Unsold Items: {statistics.unsoldItems || 0}</p>
      </div>
    </div>
  );
};

export default StatisticsBox;

