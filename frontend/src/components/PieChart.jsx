import { useEffect, useRef } from 'react';
import { Chart, ArcElement, Tooltip, Legend, PieController } from 'chart.js';

// Register all required components
Chart.register(
  PieController,  // This is the missing piece
  ArcElement,
  Tooltip,
  Legend
);

export default function PieChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      
      chartInstance.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: data.map(item => item.name),
          datasets: [{
            data: data.map(item => item.value),
            backgroundColor: data.map(item => item.color),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef} />;
}