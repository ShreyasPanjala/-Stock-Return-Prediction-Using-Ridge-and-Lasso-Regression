import yfinance as yf
import pandas as pd
from typing import Optional

def fetch_market_data(ticker: str, start_date: str, end_date: str) -> Optional[pd.DataFrame]:
    data = yf.download(ticker, start=start_date, end=end_date, auto_adjust=True)
    if data.empty:
        return None
        
    if hasattr(data.columns, "levels"):
        data.columns = data.columns.get_level_values(0)
        
    return data

def get_company_name(ticker: str) -> str:
    try:
        stock_info = yf.Ticker(ticker).info
        return stock_info.get("shortName", ticker)
    except:
        return ticker
