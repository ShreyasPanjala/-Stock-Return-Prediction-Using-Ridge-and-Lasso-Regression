import type { PredictionResponse } from '../types';
import MetricCard from '../components/dashboard/MetricCard';
import CoefficientChart from '../components/model/CoefficientChart';
import { AlertCircle } from 'lucide-react';

interface ModelAnalysisProps {
  data: PredictionResponse | null;
}

export default function ModelAnalysis({ data }: ModelAnalysisProps) {
  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-card border border-border mb-4">
          <AlertCircle className="w-8 h-8 text-muted" />
        </div>
        <h2 className="text-xl font-bold text-text mb-2">No Model Data Available</h2>
        <p className="text-muted">Please generate a prediction on the Dashboard first to view model analysis.</p>
      </div>
    );
  }

  const hasMetrics = data.metrics && Object.keys(data.metrics).length > 0;
  const hasCoefs = data.coefficients && Object.keys(data.coefficients).length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      
      <div className="mb-8 border-b border-border pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-text mb-2">Model Analysis: {data.ticker}</h1>
        <p className="text-muted">Technical evaluation of the Ridge and Lasso regression models.</p>
      </div>

      <div className="space-y-8">
        
        {/* Model Performance */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold tracking-tight text-text">Model Performance</h2>
            <p className="text-sm text-muted">Historical test-set evaluation metrics.</p>
          </div>
          
          {hasMetrics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MetricCard title="Ridge Regression Metrics" metrics={data.metrics.ridge} />
              <MetricCard title="Lasso Regression Metrics" metrics={data.metrics.lasso} />
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border p-6 text-center text-muted text-sm">
              Model performance metrics are not available in the current environment.
            </div>
          )}
        </div>

        {/* Feature Coefficients */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold tracking-tight text-text">Feature Coefficients</h2>
            <p className="text-sm text-muted">Feature importance based on model coefficients (top 15 by magnitude).</p>
          </div>
          
          {hasCoefs ? (
            <CoefficientChart 
              ridgeCoefs={data.coefficients.ridge} 
              lassoCoefs={data.coefficients.lasso} 
            />
          ) : (
            <div className="bg-card rounded-xl border border-border p-6 text-center text-muted text-sm">
              Model coefficients are not available.
            </div>
          )}
        </div>
        
        {/* Technical Summary */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-lg font-bold tracking-tight text-text mb-4">Technical Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-muted">
            <div>
              <h4 className="font-semibold text-text mb-2">Ridge Regularization (L2)</h4>
              <p className="leading-relaxed">
                Ridge regression adds a penalty equivalent to the square of the magnitude of coefficients. 
                It shrinks coefficients towards zero but rarely exactly to zero. This is highly effective 
                at dealing with multicollinearity (highly correlated features), which is very common in 
                financial time-series data (e.g., various moving averages).
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-text mb-2">Lasso Regularization (L1)</h4>
              <p className="leading-relaxed">
                Lasso regression adds a penalty equivalent to the absolute value of the magnitude of coefficients.
                This has the effect of pushing less important feature coefficients completely to zero, performing
                automatic feature selection. This yields a sparser, more interpretable model.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
