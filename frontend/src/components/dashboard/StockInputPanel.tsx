import { useState } from 'react';
import { api } from '../../services/api';
import type { PredictionResponse } from '../../types';
import { Search, Calendar, Loader2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface StockInputPanelProps {
  onDataReceived: (data: PredictionResponse) => void;
}

export default function StockInputPanel({ onDataReceived }: StockInputPanelProps) {
  const [ticker, setTicker] = useState('AAPL');
  
  // Default to ~2.5 years ago
  const defaultStart = new Date();
  defaultStart.setFullYear(defaultStart.getFullYear() - 2);
  defaultStart.setMonth(defaultStart.getMonth() - 6);
  
  const [startDate, setStartDate] = useState(defaultStart.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await api.getPrediction({
        ticker: ticker.toUpperCase(),
        start_date: startDate,
        end_date: endDate
      });
      onDataReceived(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate prediction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-navy flex items-center">
          Parameters
        </h2>
        <p className="text-sm text-neutral mt-1">Select a stock and historical range to analyze.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral uppercase tracking-wider">Stock Ticker</label>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder="e.g. AAPL, TSLA"
              className="w-full bg-white border border-border rounded-md pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-navy placeholder:text-neutral/70 shadow-sm"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral uppercase tracking-wider">Start Date</label>
          <div className="relative group">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral group-focus-within:text-primary transition-colors" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-white border border-border rounded-md pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-navy shadow-sm"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral uppercase tracking-wider">End Date</label>
          <div className="relative group">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral group-focus-within:text-primary transition-colors" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-white border border-border rounded-md pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-navy shadow-sm"
              required
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-md flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-negative shrink-0 mt-0.5" />
            <span className="text-xs text-negative/90 leading-relaxed">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !ticker}
          className={clsx(
            "w-full flex items-center justify-center space-x-2 py-3 rounded-md text-sm font-semibold transition-colors mt-2",
            isLoading || !ticker 
              ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
              : "bg-primary text-white hover:bg-primaryHover shadow-sm"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Market...</span>
            </>
          ) : (
            <span>Run Prediction &rarr;</span>
          )}
        </button>
      </form>
      
      <div className="mt-8 pt-5 border-t border-border">
        <h3 className="text-xs font-semibold text-neutral uppercase tracking-wider mb-3">Active Engines</h3>
        <ul className="space-y-2 text-sm text-navy">
          <li className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-primary mr-3" />
            Ridge Regression (L2)
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-secondary mr-3" />
            Lasso Regression (L1)
          </li>
        </ul>
      </div>
    </div>
  );
}
