import type { ModelMetrics } from '../../types';

interface MetricCardProps {
  title: string;
  metrics: ModelMetrics;
}

export default function MetricCard({ title, metrics }: MetricCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
      <h3 className="text-sm font-semibold tracking-tight text-text mb-4 pb-2 border-b border-border/50">{title}</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted font-medium">R² SCORE</span>
          <span className="text-sm font-mono text-text">{metrics.r2.toFixed(4)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted font-medium">MAE</span>
          <span className="text-sm font-mono text-text">{metrics.mae.toFixed(4)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted font-medium">RMSE</span>
          <span className="text-sm font-mono text-text">{metrics.rmse.toFixed(4)}</span>
        </div>
      </div>
    </div>
  );
}
