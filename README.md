# AI-Driven Stock Return Prediction

## Overview
This project provides a full-stack web application for forecasting the next-day return of financial assets using machine learning (Ridge and Lasso Regression). Originally built with Streamlit, the system has been modernized into a production-grade architecture featuring a React/TypeScript frontend and a FastAPI backend.

## Problem Statement
Predicting next-day stock returns is notoriously difficult due to extreme market noise and multicollinearity among financial indicators. This system mitigates these issues by extracting relevant financial features (momentum, moving averages, volatility) and applying L1/L2 regularized linear models to isolate signals and produce next-day logarithmic return forecasts.

## Features
- **Dynamic Data Fetching**: Retrieves real-time and historical OHLCV data directly from Yahoo Finance.
- **Robust Feature Engineering**: Computes RSIs, moving averages (5, 10, 20, 50-day), exponential moving averages, and various lag metrics.
- **L1/L2 Regularization**: Uses pre-trained Ridge (L2) and Lasso (L1) regression models for stable coefficient estimation.
- **Interactive UI**: A professional quantitative finance dashboard providing side-by-side model predictions, implied future price calculation, and coefficient analysis.

## ML Methodology
The models do not predict raw price; instead, they predict the **logarithmic daily return** of the stock. 

### Ridge Regression
Linear regression with an L2 penalty. It shrinks coefficients towards zero, safely distributing feature importance across highly correlated technical indicators (like multiple moving averages) without discarding them.

### Lasso Regression
Linear regression with an L1 penalty. It inherently performs feature selection by pushing the coefficients of unhelpful features completely to zero, generating a sparse, interpretable model.

## System Architecture

```text
React (TypeScript, Tailwind, Recharts)
        ↓
FastAPI (REST API & Validation)
        ↓
Python ML Pipeline (scikit-learn, joblib)
        ↓
Yahoo Finance (Market Data)
```

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons
- **Backend**: Python, FastAPI, Uvicorn, Pydantic
- **Machine Learning**: Scikit-learn, Pandas, NumPy, Joblib
- **Data Source**: yfinance

## API Endpoints
- `GET /api/health`: Health check.
- `POST /api/predict`: Runs the prediction pipeline.
  - **Body**: `{"ticker": "AAPL", "start_date": "2024-01-01", "end_date": "2024-10-01"}`
  - **Response**: Model predictions (Ridge & Lasso), historical chart data, model metrics, and feature coefficients.

## Local Setup

### Backend
1. Activate your virtual environment:
   ```bash
   venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   pip install fastapi uvicorn pydantic
   ```
3. Run the FastAPI server:
   ```bash
   uvicorn backend.main:app --port 8000 --reload
   ```

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Example Usage
Once both servers are running, open the frontend URL (usually `http://localhost:5173`) in your browser. Enter a valid stock ticker (e.g., `AAPL`, `TSLA`, `MSFT`) and a date range to generate the forecast.

## Disclaimer
**Educational machine-learning project.** Predictions are estimates based purely on historical market data and should not be considered financial advice.
