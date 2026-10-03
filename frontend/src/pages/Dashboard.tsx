import type { PredictionResponse } from '../types';
import StockInputPanel from '../components/dashboard/StockInputPanel';
import SummaryCard from '../components/dashboard/SummaryCard';
import PredictionCard from '../components/dashboard/PredictionCard';
import HistoricalChart from '../components/dashboard/HistoricalChart';
import ModelComparison from '../components/dashboard/ModelComparison';
import { Activity } from 'lucide-react';
import { getCurrencySymbol } from '../utils/currency';

interface DashboardProps {
  data: PredictionResponse | null;
  onDataUpdate: (data: PredictionResponse) => void;
}

export default function Dashboard({ data, onDataUpdate }: DashboardProps) {
  const currencySymbol = getCurrencySymbol(data?.ticker);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header Section */}
      <section className="pt-10 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2 tracking-tight">
            Financial Forecast Intelligence
          </h1>
          <p className="text-sm text-neutral max-w-3xl">
            Leverage regularized machine learning models (Ridge & Lasso) to analyze historical trends and predict next-day asset performance.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Column: Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            <StockInputPanel onDataReceived={onDataUpdate} />
            
            {!data && (
              <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-subtle">
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-4 border border-border">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-navy mb-1">Awaiting Parameters</h3>
                <p className="text-xs text-neutral">Configure the panel above to generate a new forecast.</p>
              </div>
            )}
          </div>
          
          {/* Right Column: Results */}
          <div className="lg:col-span-3 space-y-6">
            
            {data ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <SummaryCard 
                    label="ASSET" 
                    value={data.ticker} 
                    subtext={data.company_name} 
                    highlight
                  />
                  <SummaryCard 
                    label="CURRENT PRICE" 
                    value={`${currencySymbol}${data.latest_price.toFixed(2)}`} 
                    subtext={`Latest: ${data.latest_date}`} 
                  />
                  <SummaryCard 
                    label="HORIZON" 
                    value={data.forecast_horizon} 
                  />
                </div>
                
                {/* Main Predictions */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-card">
                  <div className="mb-5 border-b border-border pb-4">
                    <h2 className="text-lg font-semibold text-navy flex items-center">
                      Next-Day Model Forecasts
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PredictionCard 
                      title="Ridge Regression" 
                      description="L2-regularized linear model"
                      prediction={data.ridge} 
                      currencySymbol={currencySymbol}
                    />
                    <PredictionCard 
                      title="Lasso Regression" 
                      description="L1-regularized linear model"
                      prediction={data.lasso} 
                      currencySymbol={currencySymbol}
                    />
                  </div>
                </div>

                {/* Historical Chart */}
                <HistoricalChart data={data.historical_data} currencySymbol={currencySymbol} />
                
                {/* Model Comparison */}
                <ModelComparison data={data} currencySymbol={currencySymbol} />
                
              </div>
            ) : (
              <div className="h-[400px] border border-dashed border-border rounded-xl flex flex-col items-center justify-center bg-card text-neutral shadow-subtle">
                <Activity className="w-12 h-12 text-border mb-4" />
                <h3 className="text-base font-semibold text-navy mb-1">No Data Available</h3>
                <p className="text-sm text-center max-w-sm">Select an asset and date range to view the interactive chart and model predictions.</p>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
