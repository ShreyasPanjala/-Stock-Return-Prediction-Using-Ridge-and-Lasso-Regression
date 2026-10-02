from pydantic import BaseModel
from typing import List, Dict, Optional, Any

class PredictionRequest(BaseModel):
    ticker: str
    start_date: str
    end_date: str

class ModelPrediction(BaseModel):
    predicted_return: float
    predicted_price: float
    price_change: float

class PredictionResponse(BaseModel):
    ticker: str
    company_name: str
    latest_date: str
    latest_price: float
    forecast_horizon: str
    ridge: ModelPrediction
    lasso: ModelPrediction
    historical_data: List[Dict[str, Any]]
    metrics: Dict[str, Dict[str, float]]
    coefficients: Dict[str, Dict[str, float]]
