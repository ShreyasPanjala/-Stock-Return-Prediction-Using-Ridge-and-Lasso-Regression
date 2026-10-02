import { ArrowDown } from 'lucide-react';

export default function Methodology() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-text mb-3">System Methodology</h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          An overview of the data pipeline and machine learning architecture powering the predictions.
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border p-8 shadow-sm mb-10">
        <h2 className="text-xl font-bold tracking-tight text-text mb-8 text-center">Pipeline Architecture</h2>
        
        <div className="flex flex-col items-center max-w-md mx-auto relative">
          
          <div className="w-full bg-background border border-border p-4 rounded-lg text-center font-medium shadow-sm">
            1. Market Data
            <p className="text-xs text-muted mt-1 font-normal">Yahoo Finance OHLCV</p>
          </div>
          
          <ArrowDown className="w-5 h-5 text-muted my-2" />
          
          <div className="w-full bg-background border border-border p-4 rounded-lg text-center font-medium shadow-sm">
            2. Data Cleaning
            <p className="text-xs text-muted mt-1 font-normal">Handling missing values & column alignment</p>
          </div>
          
          <ArrowDown className="w-5 h-5 text-muted my-2" />
          
          <div className="w-full bg-primary/10 border border-primary/30 p-4 rounded-lg text-center font-medium text-primary shadow-sm">
            3. Feature Engineering
            <p className="text-xs text-primary/80 mt-1 font-normal">Trend, Momentum, Volatility & Lags</p>
          </div>
          
          <ArrowDown className="w-5 h-5 text-muted my-2" />
          
          <div className="w-full bg-background border border-border p-4 rounded-lg text-center font-medium shadow-sm">
            4. Train / Test Split
            <p className="text-xs text-muted mt-1 font-normal">StandardScaler normalization</p>
          </div>
          
          <ArrowDown className="w-5 h-5 text-muted my-2" />
          
          <div className="w-full grid grid-cols-2 gap-4">
            <div className="bg-[#1F6FEB]/10 border border-[#1F6FEB]/30 p-4 rounded-lg text-center font-medium text-[#1F6FEB] shadow-sm">
              5a. Ridge
              <p className="text-xs text-[#1F6FEB]/80 mt-1 font-normal">L2 Penalty</p>
            </div>
            <div className="bg-[#10B981]/10 border border-[#10B981]/30 p-4 rounded-lg text-center font-medium text-[#10B981] shadow-sm">
              5b. Lasso
              <p className="text-xs text-[#10B981]/80 mt-1 font-normal">L1 Penalty</p>
            </div>
          </div>
          
          <ArrowDown className="w-5 h-5 text-muted my-2" />
          
          <div className="w-full bg-background border border-border p-4 rounded-lg text-center font-medium shadow-sm">
            6. Return Prediction
            <p className="text-xs text-muted mt-1 font-normal">Logarithmic daily return estimate</p>
          </div>
          
          <ArrowDown className="w-5 h-5 text-muted my-2" />
          
          <div className="w-full bg-text text-background p-4 rounded-lg text-center font-bold shadow-sm">
            7. Implied Future Price
            <p className="text-xs text-background/80 mt-1 font-normal">Calculated for next trading day</p>
          </div>
          
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-lg font-bold text-text mb-3">Feature Engineering</h3>
          <p className="text-muted text-sm leading-relaxed mb-4">
            The machine learning models do not operate on raw prices. Instead, a series of financial indicators are engineered to capture the market's state:
          </p>
          <ul className="list-disc list-inside text-sm text-text/90 space-y-2 ml-2">
            <li><span className="font-semibold">Trend:</span> Simple Moving Averages (5, 10, 20, 50 days) and Exponential Moving Averages (EMA 20).</li>
            <li><span className="font-semibold">Momentum:</span> Relative Strength Index (RSI), N-day Momentum (Price difference over 5, 10, 20 days).</li>
            <li><span className="font-semibold">Volatility:</span> 20-day rolling standard deviation of daily returns, Intraday High-Low spread.</li>
            <li><span className="font-semibold">Historical Returns:</span> Lagged daily returns (1, 2, 3, 5 days) and multi-day returns (5D, 10D, 20D).</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-text mb-3">Why Ridge and Lasso?</h3>
          <p className="text-muted text-sm leading-relaxed">
            Financial data is notoriously noisy and highly collinear (e.g., a 10-day moving average is highly correlated with a 20-day moving average). Standard Ordinary Least Squares (OLS) regression fails in these conditions, producing highly unstable coefficients.
          </p>
          <p className="text-muted text-sm leading-relaxed mt-3">
            <strong>Ridge (L2)</strong> shrinks coefficients towards zero, distributing importance smoothly across correlated features. <strong>Lasso (L1)</strong> performs aggressive feature selection, forcing the coefficients of less useful predictors to exactly zero, isolating only the most critical signals.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-text mb-3">Target Variable Transformation</h3>
          <p className="text-muted text-sm leading-relaxed">
            The models predict the <em>logarithmic return</em> (<code>ln(P_t / P_t-1)</code>) rather than simple percentage return or absolute price. Log returns are time-additive and statistically better behaved (closer to normal distribution). The frontend UI seamlessly converts this log return back into a standard percentage and an absolute implied dollar price for readability.
          </p>
        </section>
      </div>
      
    </div>
  );
}
