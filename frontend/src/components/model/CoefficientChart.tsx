import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface CoefficientChartProps {
  ridgeCoefs: Record<string, number>;
  lassoCoefs: Record<string, number>;
}

export default function CoefficientChart({ ridgeCoefs, lassoCoefs }: CoefficientChartProps) {
  const [model, setModel] = useState<'ridge' | 'lasso'>('ridge');
  
  const currentCoefs = model === 'ridge' ? ridgeCoefs : lassoCoefs;
  
  const data = Object.entries(currentCoefs)
    .map(([feature, value]) => ({ feature, value }))
    // Remove exactly zero coefficients for cleaner plot (especially lasso)
    .filter(item => Math.abs(item.value) > 1e-10)
    .sort((a, b) => a.value - b.value); // Sort ascending for horizontal bar chart

  if (!data || data.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col items-center justify-center h-64">
        <p className="text-muted text-sm">No significant coefficients available.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-text mb-1">Model Feature Coefficients</h3>
          <p className="text-xs text-muted">Most influential features determining the prediction.</p>
        </div>
        <div className="flex space-x-1 bg-background p-1 rounded-lg border border-border">
          <button
            onClick={() => setModel('ridge')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              model === 'ridge' 
                ? 'bg-primary text-white' 
                : 'text-muted hover:text-text hover:bg-border/50'
            }`}
          >
            Ridge
          </button>
          <button
            onClick={() => setModel('lasso')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              model === 'lasso' 
                ? 'bg-[#10B981] text-white' 
                : 'text-muted hover:text-text hover:bg-border/50'
            }`}
          >
            Lasso
          </button>
        </div>
      </div>
      
      <div className="h-[400px] w-full mt-4 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            layout="vertical" 
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2B333F" horizontal={true} vertical={true} />
            <XAxis 
              type="number" 
              stroke="#8B949E"
              tickFormatter={(val) => val.toExponential(1)}
              fontSize={10}
            />
            <YAxis 
              dataKey="feature" 
              type="category" 
              stroke="#8B949E"
              width={120}
              tick={{ fontSize: 10, fill: '#E6EDF3' }}
            />
            <Tooltip 
              formatter={(value: any) => Number(value).toExponential(4)}
              contentStyle={{ backgroundColor: '#1A1F26', borderColor: '#2B333F', borderRadius: '8px' }}
              itemStyle={{ color: '#FAFAFA' }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.value > 0 ? (model === 'ridge' ? '#1F6FEB' : '#10B981') : '#D50000'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
