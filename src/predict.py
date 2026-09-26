import joblib
import pandas as pd
import numpy as np
from feature_engineering import create_features
from data_collection import download_stock_data
import os
import argparse

def predict_future_return(ticker="AAPL", horizon=1):
    print("=" * 50)
    print(f"PREDICTING FUTURE RETURNS FOR {ticker}")
    print("=" * 50)
    
    if not os.path.exists("models/ridge_model.pkl") or not os.path.exists("models/scaler.pkl"):
        print("Models not found! Please run train_model.py first.")
        return
        
    # Download recent data up to today
    data = download_stock_data(ticker=ticker, start="2024-01-01", end="2026-12-31")
    
    data_full = data.copy()
    if isinstance(data_full.columns, pd.MultiIndex):
        data_full.columns = data_full.columns.get_level_values(0)
    
    data_full["Daily_Return"] = data_full["Close"].pct_change()
    data_full["Price_Change"] = data_full["Close"].diff()
    data_full["High_Low_Spread"] = data_full["High"] - data_full["Low"]
    data_full["Open_Close_Spread"] = data_full["Close"] - data_full["Open"]
    
    data_full["MA_5"] = data_full["Close"].rolling(5).mean()
    data_full["MA_10"] = data_full["Close"].rolling(10).mean()
    data_full["MA_20"] = data_full["Close"].rolling(20).mean()
    data_full["MA_50"] = data_full["Close"].rolling(50).mean()
    
    data_full["Volatility"] = data_full["Daily_Return"].rolling(20).std()
    data_full["EMA_20"] = data_full["Close"].ewm(span=20, adjust=False).mean()
    
    data_full["Momentum_5"] = data_full["Close"] - data_full["Close"].shift(5)
    data_full["Momentum_10"] = data_full["Close"] - data_full["Close"].shift(10)
    data_full["Momentum_20"] = data_full["Close"] - data_full["Close"].shift(20)
    
    data_full["Volume_Change"] = data_full["Volume"].pct_change()
    data_full["Volume_MA_5"] = data_full["Volume"].rolling(5).mean()
    
    data_full["Return_Lag_1"] = data_full["Daily_Return"].shift(1)
    data_full["Return_Lag_2"] = data_full["Daily_Return"].shift(2)
    data_full["Return_Lag_3"] = data_full["Daily_Return"].shift(3)
    data_full["Return_Lag_5"] = data_full["Daily_Return"].shift(5)
    
    data_full["Return_5D"] = data_full["Close"].pct_change(5)
    data_full["Return_10D"] = data_full["Close"].pct_change(10)
    data_full["Return_20D"] = data_full["Close"].pct_change(20)
    
    data_full["Price_MA5_Ratio"] = data_full["Close"] / data_full["MA_5"]
    data_full["Price_MA20_Ratio"] = data_full["Close"] / data_full["MA_20"]
    data_full["Price_MA50_Ratio"] = data_full["Close"] / data_full["MA_50"]
    
    delta = data_full["Close"].diff()
    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)
    avg_gain = gain.rolling(14).mean()
    avg_loss = loss.rolling(14).mean()
    rs = avg_gain / avg_loss
    data_full["RSI"] = 100 - (100 / (1 + rs))
    
    # Get the row for yesterday (second to last row, in case today's market is still open and partial)
    # If we want the absolute latest completed data, we can use iloc[-2:-1] to be safe.
    latest_data = data_full.iloc[-2:-1]
    
    # Load models
    ridge = joblib.load("models/ridge_model.pkl")
    lasso = joblib.load("models/lasso_model.pkl")
    scaler = joblib.load("models/scaler.pkl")
    feature_names = joblib.load("models/feature_names.pkl")
    
    X_latest = latest_data[feature_names]
    X_scaled = scaler.transform(X_latest)
    
    ridge_pred = ridge.predict(X_scaled)[0]
    lasso_pred = lasso.predict(X_scaled)[0]
    
    # Get the date of the row we are using
    prediction_date = latest_data.index[0] if isinstance(latest_data.index, pd.DatetimeIndex) else "Yesterday"
    
    print("\nPREDICTION RESULTS")
    print("-" * 50)
    print(f"Data Used From Date: {prediction_date}")
    print(f"Close Price on that date: ${latest_data['Close'].values[0]:.2f}")
    print(f"Ridge Predicted Next-Day Return: {ridge_pred * 100:.2f}%")
    print(f"Lasso Predicted Next-Day Return: {lasso_pred * 100:.2f}%")
    
    predicted_ridge_price = latest_data['Close'].values[0] * np.exp(ridge_pred)
    predicted_lasso_price = latest_data['Close'].values[0] * np.exp(lasso_pred)
    
    print(f"Ridge Implied Next-Day Price: ${predicted_ridge_price:.2f}")
    print(f"Lasso Implied Next-Day Price: ${predicted_lasso_price:.2f}")
    
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Predict stock returns.")
    parser.add_argument("--ticker", type=str, default="AAPL", help="Stock ticker symbol (e.g., TSLA, AAPL)")
    args = parser.parse_args()
    
    predict_future_return(ticker=args.ticker, horizon=1)

