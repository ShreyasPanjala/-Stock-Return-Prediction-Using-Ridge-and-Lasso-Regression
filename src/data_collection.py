import yfinance as yf
import os


def download_stock_data(
    ticker="AAPL",
    start="2020-01-01",
    end="2026-01-01"
):
    """
    Downloads historical stock data using Yahoo Finance API.
    """

    print(f"Downloading data for {ticker}...")

    data = yf.download(
        ticker,
        start=start,
        end=end,
        auto_adjust=True
    )

    if data.empty:
        raise ValueError("No stock data found. Check ticker symbol.")

    if hasattr(data.columns, "levels"):
        data.columns = data.columns.get_level_values(0)

    os.makedirs("data/raw", exist_ok=True)

    filepath = f"data/raw/{ticker.replace('.', '_')}.csv"

    data.to_csv(filepath)

    print("\nDATA COLLECTION SUCCESSFUL")
    print("-" * 40)
    print(f"Stock: {ticker}")
    print(f"Rows: {len(data)}")
    print(f"Columns: {list(data.columns)}")
    print(f"Saved to: {filepath}")

    return data


if __name__ == "__main__":
    download_stock_data()