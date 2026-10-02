from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from backend.schemas.prediction import PredictionRequest, PredictionResponse
from backend.services.market_data import fetch_market_data, get_company_name
from backend.services.model_service import make_prediction, get_coefficients, get_performance_metrics
from backend.db.database import get_db
from backend.db import crud
import datetime

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "ok"}

@router.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest, db: Session = Depends(get_db)):
    # Validate dates
    try:
        start = datetime.datetime.strptime(request.start_date, "%Y-%m-%d")
        end = datetime.datetime.strptime(request.end_date, "%Y-%m-%d")
        if start > end:
            raise HTTPException(status_code=400, detail="Start date must be before end date")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
        
    if not request.ticker.strip():
        raise HTTPException(status_code=400, detail="Ticker cannot be empty")
        
    try:
        data = fetch_market_data(request.ticker, request.start_date, request.end_date)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch market data from Yahoo Finance")
        
    if data is None or data.empty:
        raise HTTPException(status_code=404, detail=f"No data found for ticker {request.ticker} in the given date range.")
        
    # Minimum required data length to engineer features safely (e.g. 50-day moving average requires at least 50 days)
    if len(data) < 60:
        raise HTTPException(status_code=400, detail=f"Insufficient data. Please provide a wider date range (at least 60 trading days).")

    company_name = get_company_name(request.ticker)
    
    try:
        predictions = make_prediction(data)
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model prediction error: {str(e)}")

    latest_close = float(data['Close'].iloc[-1])
    latest_date = data.index[-1].strftime('%Y-%m-%d')
    
    # Format historical data for chart
    historical_data = []
    # Sending up to last 100 days for charting, to avoid massive payload
    chart_data = data.tail(100)
    for date, row in chart_data.iterrows():
        historical_data.append({
            "date": date.strftime('%Y-%m-%d'),
            "close": float(row['Close'])
        })
        
    metrics = get_performance_metrics()
    coefficients = get_coefficients()
    
    return PredictionResponse(
        ticker=request.ticker,
        company_name=company_name,
        latest_date=latest_date,
        latest_price=latest_close,
        forecast_horizon="Next Trading Day",
        ridge=predictions["ridge"],
        lasso=predictions["lasso"],
        historical_data=historical_data,
        metrics=metrics,
        coefficients=coefficients
    )
