import axios from 'axios';
import { CategoryScale, Chart, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

Chart.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

export const DashboardChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Weekly Hours',
        data: [],
        borderColor: 'black',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: 'black',
        fill: false,
      },
    ],
  });

  const fetchWeeklyHours = async () => {
    try {
      const res = await axios.get(''); // API should return [{ day: "Mon", hours: 6 }, ...]
      const data = res.data;

      setChartData({
        labels: data.map(entry => entry.day),
        datasets: [
          {
            label: 'Weekly Hours',
            data: data.map(entry => entry.hours),
            borderColor: 'black',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: 'black',
            fill: false,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching weekly hours:', error);
    }
  };

  useEffect(() => {
    fetchWeeklyHours();
  }, []);

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Weekly Hours</h2>
      <Line data={chartData} />
    </div>
  );
};
