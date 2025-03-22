
import React from "react";

interface MiniChartProps {
  trend: 'up' | 'down' | 'neutral';
}

const MiniChart: React.FC<MiniChartProps> = ({ trend }) => {
  const color = trend === 'up' 
    ? 'hsl(var(--success))' 
    : trend === 'down' 
      ? 'hsl(var(--error))' 
      : 'hsl(var(--warning))';
  
  // Generate random chart paths based on trend
  const generatePath = () => {
    let path = 'M0,30 ';
    const points = 10;
    
    for (let i = 1; i <= points; i++) {
      const x = (i / points) * 100;
      let y;
      
      if (trend === 'up') {
        y = 30 - (i / points) * 25 + (Math.random() * 8 - 4);
      } else if (trend === 'down') {
        y = 5 + (i / points) * 25 + (Math.random() * 8 - 4);
      } else {
        y = 15 + (Math.random() * 10 - 5);
      }
      
      path += `L${x},${y} `;
    }
    
    return path;
  };
  
  return (
    <svg width="100" height="35" viewBox="0 0 100 35" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d={generatePath()} 
        stroke={color} 
        strokeWidth="2"
        fill="transparent"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MiniChart;
