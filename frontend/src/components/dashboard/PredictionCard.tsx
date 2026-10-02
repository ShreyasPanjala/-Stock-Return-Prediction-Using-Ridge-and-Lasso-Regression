import type { ModelPrediction } from '../../types';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import clsx from 'clsx';

interface PredictionCardProps {
  title: string;
  description: string;
  prediction: ModelPrediction;
}

export default function PredictionCard({ title, description, prediction }: PredictionCardProps) {
  const isPositive = prediction.predicted_return > 0;
  const isNegative = prediction.predicted_return < 0;
  
  const returnClass = isPositive ? 'text-positive' : isNegative ? 'text-negative' : 'text-neutral';
  
  const formatReturn = (val: number) => {
    const formatted = val.toFixed(2) + '%';
    return isPositive ? `+${formatted}` : formatted;
  };
  
  const formatChange = (val: number) => {
    const formatted = Math.abs(val).toFixed(2);
    return isPositive ? `+$${formatted}` : isNegative ? `-$${formatted}` : `$${formatted}`;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-subtle flex flex-col transition-shadow hover:shadow-card">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-navy mb-1">{title}</h3>
          <p className="text-sm text-neutral">{description}</p>
        </div>
      </div>
      
      <div className="mb-6 flex flex-col items-center justify-center py-6 bg-background rounded-lg border border-border">
        <div className="text-xs font-semibold text-neutral uppercase tracking-wider mb-2">Predicted Return</div>
        <div className={clsx("text-4xl font-bold flex items-center gap-2", returnClass)}>
          {isPositive ? <ArrowUpRight className="w-8 h-8" /> : isNegative ? <ArrowDownRight className="w-8 h-8" /> : <Minus className="w-8 h-8" />}
          {formatReturn(prediction.predicted_return)}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-auto border-t border-border pt-4">
        <div>
          <div className="text-xs font-semibold text-neutral uppercase tracking-wider mb-1">Implied Price</div>
          <div className="text-xl font-semibold text-navy">${prediction.predicted_price.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-xs font-semibold text-neutral uppercase tracking-wider mb-1">Price Change</div>
          <div className={clsx("text-xl font-semibold", returnClass)}>
            {formatChange(prediction.price_change)}
          </div>
        </div>
      </div>
    </div>
  );
}
