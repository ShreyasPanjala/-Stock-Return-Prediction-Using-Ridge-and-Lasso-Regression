import type { PredictionResponse } from '../../types';
import clsx from 'clsx';

export default function ModelComparison({ data }: { data: PredictionResponse }) {
  
  const formatReturn = (val: number) => {
    const isPos = val > 0;
    const formatted = val.toFixed(2) + '%';
    return <span className={clsx("font-medium", isPos ? "text-positive" : val < 0 ? "text-negative" : "text-neutral")}>
      {isPos ? `+${formatted}` : formatted}
    </span>;
  };
  
  const formatChange = (val: number) => {
    const isPos = val > 0;
    const formatted = Math.abs(val).toFixed(2);
    return <span className={clsx("font-medium", isPos ? "text-positive" : val < 0 ? "text-negative" : "text-neutral")}>
      {isPos ? `+$${formatted}` : val < 0 ? `-$${formatted}` : `$${formatted}`}
    </span>;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-subtle">
      <div className="p-5 border-b border-border bg-gray-50/50">
        <h3 className="text-lg font-semibold text-navy flex items-center">
          Model Comparison
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs font-semibold text-neutral uppercase tracking-wider bg-gray-50 border-b border-border">
            <tr>
              <th scope="col" className="px-6 py-3">Model Engine</th>
              <th scope="col" className="px-6 py-3">Predicted Return</th>
              <th scope="col" className="px-6 py-3">Implied Price</th>
              <th scope="col" className="px-6 py-3">Price Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 font-semibold text-navy flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Ridge (L2)
              </td>
              <td className="px-6 py-4">{formatReturn(data.ridge.predicted_return)}</td>
              <td className="px-6 py-4 font-semibold text-navy">${data.ridge.predicted_price.toFixed(2)}</td>
              <td className="px-6 py-4">{formatChange(data.ridge.price_change)}</td>
            </tr>
            <tr className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 font-semibold text-navy flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                Lasso (L1)
              </td>
              <td className="px-6 py-4">{formatReturn(data.lasso.predicted_return)}</td>
              <td className="px-6 py-4 font-semibold text-navy">${data.lasso.predicted_price.toFixed(2)}</td>
              <td className="px-6 py-4">{formatChange(data.lasso.price_change)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
