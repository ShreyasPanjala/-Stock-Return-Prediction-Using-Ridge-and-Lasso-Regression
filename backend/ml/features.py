import pandas as pd
import numpy as np

def generate_features(data: pd.DataFrame) -> pd.DataFrame:
    """
    Generate the exact features expected by the trained Ridge and Lasso models.
    Does NOT drop the latest row so it can be used for inference.
    """
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
    
    return data_full
