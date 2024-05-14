import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const MonthlyExerciseStats = () => {
  const [chartData, setChartData] = useState(null);  // Holds the chart data
  const [isLoading, setIsLoading] = useState(true);  // Indicates loading state
  const [error, setError] = useState(null);          // Holds error messages

  const fetchData = async () => {
   

    setIsLoading(true); // Start loading before the request
    try {
      const response = await axios.get('http://localhost:5000/exercises/stats/monthly', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      console.log('API Response:', response);
      if (response.data && response.data.length) {
        const labels = response.data.map(data => `Month ${data._id.month}`);
        const dataPoints = response.data.map(data => data.count);
        setChartData({
          labels,
          datasets: [{
            label: 'Exercises per Month',
            data: dataPoints,
            fill: false,
            backgroundColor: 'rgb(75,192,192)',
            borderColor: 'rgba(75,192,192,1)',
          }],
        });
      } else {
        setError('No exercise data available');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Error fetching exercise data: ${err.response ? err.response.data.message || err.response.statusText : err.message}`);
    }
    setIsLoading(false);
  
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading exercise data...</div>;  // Display while loading
  }

  if (error) {
    return <div>{error}</div>;  // Display error if there is an issue
  }

  return chartData ? (
    <Line data={chartData} />  // Render chart if data is available
  ) : <div>No exercise data available</div>;  // Message when no data
};

export default MonthlyExerciseStats;
