import pandas as pd
import numpy as np


def create_features(data, prediction_horizon=5):
    """
    Creates financial features and target variable.
    """

    data = data.copy()

    
    if isinstance(data.columns, pd.MultiIndex):
        data.columns = data.columns.get_level_values(0)

    
    data["Daily_Return"] = data["Close"].pct_change()
    data["Price_Change"] = data["Close"].diff()
    data["High_Low_Spread"] = data["High"] - data["Low"]
    data["Open_Close_Spread"] = data["Close"] - data["Open"]

    
    data["MA_5"] = data["Close"].rolling(5).mean()
    data["MA_10"] = data["Close"].rolling(10).mean()
    data["MA_20"] = data["Close"].rolling(20).mean()
    data["MA_50"] = data["Close"].rolling(50).mean()

    
    data["Volatility"] = data["Daily_Return"].rolling(20).std()

    
    data["EMA_20"] = data["Close"].ewm(span=20, adjust=False).mean()

    
    data["Momentum_5"] = data["Close"] - data["Close"].shift(5)
    data["Momentum_10"] = data["Close"] - data["Close"].shift(10)
    data["Momentum_20"] = data["Close"] - data["Close"].shift(20)

    
    data["Volume_Change"] = data["Volume"].pct_change()
    data["Volume_MA_5"] = data["Volume"].rolling(5).mean()

    # Lagged Return Features
    data["Return_Lag_1"] = data["Daily_Return"].shift(1)
    data["Return_Lag_2"] = data["Daily_Return"].shift(2)
    data["Return_Lag_3"] = data["Daily_Return"].shift(3)
    data["Return_Lag_5"] = data["Daily_Return"].shift(5)

# Historical Return Features
    data["Return_5D"] = data["Close"].pct_change(5)
    data["Return_10D"] = data["Close"].pct_change(10)
    data["Return_20D"] = data["Close"].pct_change(20)

# Price relative to Moving Averages
    data["Price_MA5_Ratio"] = data["Close"] / data["MA_5"]
    data["Price_MA20_Ratio"] = data["Close"] / data["MA_20"]
    data["Price_MA50_Ratio"] = data["Close"] / data["MA_50"]





    
    delta = data["Close"].diff()

    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)

    avg_gain = gain.rolling(14).mean()
    avg_loss = loss.rolling(14).mean()

    rs = avg_gain / avg_loss

    data["RSI"] = 100 - (100 / (1 + rs))

    
    data["Future_Close"] = data["Close"].shift(-prediction_horizon)

    data["Future_Return"] = (
        data["Future_Close"] - data["Close"]
    ) / data["Close"]

    
    data.drop(columns=["Future_Close"], inplace=True)

    
    data.dropna(inplace=True)

    return data


if __name__ == "__main__":

    from data_collection import download_stock_data

    print("Starting Feature Engineering...")

    stock_data = download_stock_data()

    featured_data = create_features(stock_data)

    featured_data.to_csv(
        "data/processed/featured_data.csv",
        index=False
    )

    print("\nFEATURE ENGINEERING SUCCESSFUL")
    print("-" * 40)
    print(f"Final Dataset Shape: {featured_data.shape}")
    print(f"Features Created: {len(featured_data.columns)}")
    print("Saved to: data/processed/featured_data.csv")