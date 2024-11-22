import React, { useState, useEffect } from 'react';
import TransactionsTable from './components/TransactionsTable';
import StatisticsBox from './components/StatisticsBox';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';

const App = () => {
  const [month, setMonth] = useState('March');
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [pieChartData, setPieChartData] = useState({});
  const [barChartData, setBarChartData] = useState({});
 

  useEffect(() => {
    fetchTransactions();
    fetchStatistics();
    fetchPieChartData();
    fetchBarChartData();
  }, [month]);
  
  

  const fetchTransactions = async () => {
    const response = await fetch(`https://practicewithapi.onrender.com/api/transactions?month=${month}`);
    const data = await response.json();
    setTransactions(data.transactions);
  };

  const fetchStatistics = async () => {
    const response = await fetch(`https://practicewithapi.onrender.com/api/statistics?month=${month}`);
    const data = await response.json();
    setStatistics(data);
  };

  const fetchPieChartData = async () => {
    const response = await fetch(`https://practicewithapi.onrender.com/api/chart/pie?month=${month}`);
    const data = await response.json();
    setPieChartData(data);
  };

  const fetchBarChartData = async () => {
    const response = await fetch(`https://practicewithapi.onrender.com/api/chart/bar?month=${month}`);
    const data = await response.json();
    setBarChartData(data);
  };

  return (
    <div className="container">
       <h1 className="heading">Transaction Dashboard</h1>
	
       <div className="control">
        <h3>Select the month :</h3>
        <select className="select" value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
	  <option value="June">June</option>
          <option value="July">July</option>
	  <option value="August">August</option>
	  <option value="September">September</option>
	  <option value="October">October</option>
	  <option value="November">November</option>
	  <option value="December">December</option>
       </select>
     </div>
  


      {/* Pass month and other relevant data to components */}
	    <TransactionsTable month={month} transactions={transactions} />
            <StatisticsBox month={month} statistics={statistics} />
            <BarChart month={month} data={statistics} />
            <PieChart month={month} data={pieChartData} />





    </div>
  );
};

export default App;

