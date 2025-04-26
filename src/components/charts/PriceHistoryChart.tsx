import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import { PriceHistory } from '@/types/skin';

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 p-3 rounded shadow-lg">
        <p className="text-gray-400">{new Date(label).toLocaleDateString()}</p>
        <p className="text-orange-500 font-semibold">
          ${payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }

  return null;
};

interface PriceHistoryChartProps {
  data: PriceHistory[];
  timeRange?: '7d' | '30d' | '90d' | '1y' | 'all';
}

const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ 
  data, 
  timeRange = '30d' 
}) => {
  // Filter data based on selected time range
  const filteredData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const now = new Date();
    let filterDate = new Date();
    
    switch (timeRange) {
      case '7d':
        filterDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        filterDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        filterDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
      default:
        return [...data];
    }
    
    return data.filter(
      (item) => new Date(item.date) >= filterDate
    );
  }, [data, timeRange]);
  
  // Calculate min and max prices for chart domain with 10% padding
  const minPrice = Math.min(...filteredData.map(item => item.price)) * 0.9;
  const maxPrice = Math.max(...filteredData.map(item => item.price)) * 1.1;

  // Add debugging information
  const debugInfo = {
    dataPoints: filteredData.length,
    timeRange,
    minPrice,
    maxPrice,
    firstDate: filteredData[0]?.date,
    lastDate: filteredData[filteredData.length - 1]?.date,
  };
  
  console.log('PriceHistoryChart Debug:', debugInfo);
  
  if (!filteredData.length) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 h-72 flex items-center justify-center">
        <p className="text-gray-400">No price history data available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="#374151" 
            />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
              tickLine={{ stroke: '#6b7280' }}
            />
            <YAxis 
              domain={[minPrice, maxPrice]}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
              tickLine={{ stroke: '#6b7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#f97316" 
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrice)"
              isAnimationActive={true}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceHistoryChart; 