import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

def perform_eda(filepath="data/raw/AAPL.csv"):
    print("Starting Exploratory Data Analysis...")
    os.makedirs("outputs/eda", exist_ok=True)
    
    if not os.path.exists(filepath):
        print(f"Data file {filepath} not found. Run data_collection.py first.")
        return
        
    data = pd.read_csv(filepath)
    
    # 1. Closing Price History
    plt.figure(figsize=(10, 5))
    plt.plot(pd.to_datetime(data['Date']), data['Close'], label='Close Price')
    plt.title('Closing Price History')
    plt.xlabel('Date')
    plt.ylabel('Price')
    plt.legend()
    plt.savefig('outputs/eda/closing_price_history.png')
    plt.close()
    
    # 2. Daily Returns Distribution
    data['Daily_Return'] = data['Close'].pct_change()
    plt.figure(figsize=(10, 5))
    sns.histplot(data['Daily_Return'].dropna(), bins=50, kde=True)
    plt.title('Daily Return Distribution')
    plt.xlabel('Daily Return')
    plt.ylabel('Frequency')
    plt.savefig('outputs/eda/daily_return_dist.png')
    plt.close()
    
    # 3. Correlation Heatmap
    plt.figure(figsize=(10, 8))
    numeric_df = data.select_dtypes(include=['float64', 'int64']).drop(columns=['Volume'], errors='ignore')
    sns.heatmap(numeric_df.corr(), annot=True, cmap='coolwarm', fmt=".2f")
    plt.title('Feature Correlation Heatmap')
    plt.savefig('outputs/eda/correlation_heatmap.png')
    plt.close()
    
    print("EDA SUCCESSFUL")
    print("Plots saved to: outputs/eda/")

if __name__ == "__main__":
    perform_eda()
