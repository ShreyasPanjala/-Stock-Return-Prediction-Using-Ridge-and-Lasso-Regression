import streamlit as st
import pandas as pd
import numpy as np
import yfinance as yf
import joblib
import os
import sys

# Ensure src modules can be imported
sys.path.append("src")
from feature_engineering import create_features

st.set_page_config(page_title="Stock Return Predictor", layout="wide")

st.title("📈 AI-Driven Stock Return Prediction")
st.markdown("Predict the next-day return of any stock using **Ridge** and **Lasso** Regression.")

# Sidebar inputs
st.sidebar.header("User Inputs")
ticker = st.sidebar.text_input("Enter Stock Ticker (e.g., AAPL, TSLA, MSFT)", "AAPL")
start_date = st.sidebar.date_input("Start Date", pd.to_datetime("2024-01-01"))
end_date = st.sidebar.date_input("End Date", pd.to_datetime("today"))

@st.cache_data
def fetch_data(t, start, end):
    data = yf.download(t, start=start, end=end, auto_adjust=True)
    if hasattr(data.columns, "levels"):
        data.columns = data.columns.get_level_values(0)
    return data

if st.sidebar.button("Run Prediction"):
    with st.spinner(f"Fetching data for {ticker}..."):
        data = fetch_data(ticker, start_date, end_date)
    
    if data.empty:
        st.error("No data found for the given ticker.")
    else:
        st.subheader(f"Historical Stock Trends for {ticker}")
        st.line_chart(data['Close'])

        with st.spinner("Engineering features and making predictions..."):
            # Prepare full data for feature engineering
            data_full = data.copy()
            
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
            
            latest_data = data_full.iloc[-2:-1]
            
            if os.path.exists("models/ridge_model.pkl") and os.path.exists("models/lasso_model.pkl"):
                ridge = joblib.load("models/ridge_model.pkl")
                lasso = joblib.load("models/lasso_model.pkl")
                scaler = joblib.load("models/scaler.pkl")
                feature_names = joblib.load("models/feature_names.pkl")
                
                X_latest = latest_data[feature_names]
                X_scaled = scaler.transform(X_latest)
                
                ridge_pred = ridge.predict(X_scaled)[0]
                lasso_pred = lasso.predict(X_scaled)[0]
                
                latest_close = latest_data['Close'].values[0]
                prediction_date = latest_data.index[0].strftime('%Y-%m-%d')
                
                predicted_ridge_price = latest_close * np.exp(ridge_pred)
                predicted_lasso_price = latest_close * np.exp(lasso_pred)
                
                st.subheader(f"Next-Day Forecast (Data up to {prediction_date})")
                st.write(f"**Latest Close Price:** ${latest_close:.2f}")
                
                col1, col2 = st.columns(2)
                
                with col1:
                    st.success("### Ridge Regression")
                    st.metric(label="Predicted Return", value=f"{ridge_pred * 100:.2f}%")
                    st.metric(label="Implied Future Price", value=f"${predicted_ridge_price:.2f}", delta=f"${(predicted_ridge_price - latest_close):.2f}")
                    
                with col2:
                    st.info("### Lasso Regression")
                    st.metric(label="Predicted Return", value=f"{lasso_pred * 100:.2f}%")
                    st.metric(label="Implied Future Price", value=f"${predicted_lasso_price:.2f}", delta=f"${(predicted_lasso_price - latest_close):.2f}")
            else:
                st.error("Models not found! Please train the models first.")
