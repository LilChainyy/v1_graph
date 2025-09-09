import yfinance as yf
import pandas as pd
from datetime import datetime

# Test with a simple, well-known stock
print("Testing yfinance with Apple (AAPL)...")
try:
    aapl = yf.Ticker("AAPL")
    data = aapl.history(period="5d")
    print(f"Successfully fetched {len(data)} days of data for AAPL")
    print(data.head())
except Exception as e:
    print(f"Error with AAPL: {e}")

print("\nTesting with UnitedHealth (UNH)...")
try:
    unh = yf.Ticker("UNH")
    data = unh.history(period="5d")
    print(f"Successfully fetched {len(data)} days of data for UNH")
    print(data.head())
except Exception as e:
    print(f"Error with UNH: {e}")

print("\nTesting with different date range...")
try:
    unh = yf.Ticker("UNH")
    data = unh.history(start="2024-01-01", end="2024-12-31")
    print(f"Successfully fetched {len(data)} days of data for UNH from 2024")
    if not data.empty:
        print(f"Date range: {data.index[0]} to {data.index[-1]}")
        print(f"Latest close: ${data['Close'].iloc[-1]:.2f}")
except Exception as e:
    print(f"Error with UNH 2024 data: {e}")
