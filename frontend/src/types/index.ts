export interface ModelPrediction {
  predicted_return: number;
  predicted_price: number;
  price_change: number;
}

export interface HistoricalDataPoint {
  date: string;
  close: number;
}

export interface ModelMetrics {
  r2: number;
  mae: number;
  rmse: number;
}

export interface PredictionResponse {
  ticker: string;
  company_name: string;
  latest_date: string;
  latest_price: number;
  forecast_horizon: string;
  ridge: ModelPrediction;
  lasso: ModelPrediction;
  historical_data: HistoricalDataPoint[];
  metrics: {
    ridge: ModelMetrics;
    lasso: ModelMetrics;
  };
  coefficients: {
    ridge: Record<string, number>;
    lasso: Record<string, number>;
  };
}

export interface PredictionRequest {
  ticker: string;
  start_date: string;
  end_date: string;
}
