import { useState, useMemo } from 'react';
import type { HistoricalDataPoint } from '../../types';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';

interface HistoricalChartProps {
  data: HistoricalDataPoint[];
  currencySymbol: string;
}

type Range = '1M' | '3M' | '6M' | 'ALL';

export default function HistoricalChart({ data, currencySymbol }: HistoricalChartProps) {
  const [range, setRange] = useState<Range>('3M');
  
  const filteredData = useMemo(() => {
    if (!data.length || range === 'ALL') return data;
    
    const latestDate = new Date(data[data.length - 1].date);
    let cutoffDate = new Date(latestDate);
    
    switch (range) {
      case '1M':
        cutoffDate.setMonth(cutoffDate.getMonth() - 1);
        break;
      case '3M':
        cutoffDate.setMonth(cutoffDate.getMonth() - 3);
        break;
      case '6M':
        cutoffDate.setMonth(cutoffDate.getMonth() - 6);
        break;
    }
    
    const cutoffStr = cutoffDate.toISOString().split('T')[0];
    const filtered = data.filter(d => d.date >= cutoffStr);
    
    // Fallback if filtering results in too few points
    return filtered.length > 5 ? filtered : data.slice(-30);
  }, [data, range]);

  if (!data || data.length === 0) return null;

  const minPrice = Math.min(...filteredData.map(d => d.close));
  const maxPrice = Math.max(...filteredData.map(d => d.close));
  
  // Padding for the chart Y-axis
  const domainMin = Math.max(0, minPrice - (maxPrice - minPrice) * 0.1);
  const domainMax = maxPrice + (maxPrice - minPrice) * 0.1;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-border rounded shadow-card p-2 text-sm">
          <p className="text-neutral mb-1">{label}</p>
          <p className="text-navy font-bold">
            {currencySymbol}{Number(payload[0].value).toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-navy flex items-center mb-1">
            Historical Price
          </h3>
          <p className="text-sm text-neutral">Price trends over time</p>
        </div>
        <div className="flex space-x-1 bg-gray-50 p-1 rounded-md border border-border">
          {(['1M', '3M', '6M', 'ALL'] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                range === r 
                  ? 'bg-white text-navy shadow-sm' 
                  : 'text-neutral hover:text-navy hover:bg-gray-100'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-[350px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#8F9DAA" 
              fontSize={11}
              tickLine={false}
              axisLine={false}
              minTickGap={30}
              tick={{ fill: '#8F9DAA' }}
            />
            <YAxis 
              domain={[domainMin, domainMax]} 
              stroke="#8F9DAA" 
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${currencySymbol}${value.toFixed(0)}`}
              width={60}
              tick={{ fill: '#8F9DAA' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="close" 
              stroke="#4480D0" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: '#4480D0' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
