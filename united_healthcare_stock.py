import yfinance as yf
import matplotlib.pyplot as plt
import pandas as pd
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

def get_stock_data():
    """Fetch United Healthcare stock data"""
    ticker = "UNH"
    start_date = "2024-01-01"
    end_date = datetime.now().strftime("%Y-%m-%d")
    
    print(f"Fetching {ticker} stock data from {start_date} to {end_date}...")
    
    try:
        stock = yf.Ticker(ticker)
        data = stock.history(start=start_date, end=end_date, auto_adjust=True)
        
        if data.empty:
            print("No data available.")
            return None
            
        return data, ticker, start_date, end_date
        
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None

def create_chart(data, ticker, start_date, end_date):
    """Create interactive stock chart"""
    if data is None:
        return
    
    # Prepare data
    dates = [date.strftime('%Y-%m-%d') for date in data.index]
    prices = data['Close'].tolist()
    
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{ticker} Stock Chart</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 20px;
                background: white;
                min-height: 100vh;
            }}
            
            .container {{
                max-width: 1200px;
                margin: 0 auto;
                background: white;
            }}
            
            .chart-container {{
                padding: 30px;
                text-align: center;
                background: white;
                position: relative;
            }}
            
            .chart-wrapper {{
                position: relative;
                width: 100%;
                height: 500px;
            }}
            
            .tooltip {{
                position: absolute;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 12px;
                pointer-events: none;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.2s;
            }}
            
            .tooltip.show {{
                opacity: 1;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="chart-container">
                <div class="chart-wrapper">
                    <canvas id="stockChart"></canvas>
                    <div class="tooltip" id="tooltip"></div>
                </div>
            </div>
        </div>

        <script>
            const stockData = {prices};
            const dates = {dates};
            
            const ctx = document.getElementById('stockChart').getContext('2d');
            const chart = new Chart(ctx, {{
                type: 'line',
                data: {{
                    labels: dates,
                    datasets: [{{
                        data: stockData,
                        borderColor: '#00AA00',
                        backgroundColor: 'transparent',
                        borderWidth: 3,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: '#00AA00',
                        pointHoverBorderColor: '#00AA00',
                        pointHoverBorderWidth: 2,
                        tension: 0,
                        fill: false
                    }}]
                }},
                options: {{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {{
                        legend: {{ display: false }},
                        tooltip: {{ enabled: false }}
                    }},
                    scales: {{
                        x: {{ display: false }},
                        y: {{ display: false }}
                    }},
                    interaction: {{
                        intersect: false,
                        mode: 'index'
                    }},
                    onHover: (event, activeElements) => {{
                        const tooltip = document.getElementById('tooltip');
                        if (activeElements.length > 0) {{
                            const dataIndex = activeElements[0].index;
                            const price = stockData[dataIndex];
                            const date = dates[dataIndex];
                            
                            tooltip.innerHTML = `Date: ${{date}}<br>Price: ${{price.toFixed(2)}}`;
                            tooltip.style.left = event.offsetX + 10 + 'px';
                            tooltip.style.top = event.offsetY - 10 + 'px';
                            tooltip.classList.add('show');
                        }} else {{
                            tooltip.classList.remove('show');
                        }}
                    }}
                }}
            }});
        </script>
    </body>
    </html>
    """
    
    return html_content

def main():
    """Main function"""
    print("United Healthcare Stock Chart")
    print("=" * 30)
    
    result = get_stock_data()
    
    if result is not None:
        data, ticker, start_date, end_date = result
        
        print("Creating chart...")
        html_content = create_chart(data, ticker, start_date, end_date)
        
        if html_content:
            html_filename = f"{ticker}_stock_chart.html"
            with open(html_filename, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            print(f"✅ Chart created: {html_filename}")
            print(f"📊 Green line with interactive tracing")
            print(f"💻 Open {html_filename} in your browser")
            
            # Print summary
            print(f"\nSUMMARY ({start_date} to {end_date})")
            print(f"Trading days: {len(data)}")
            print(f"Latest price: ${data['Close'].iloc[-1]:.2f}")
            print(f"Price change: ${data['Close'].iloc[-1] - data['Close'].iloc[0]:.2f}")
        else:
            print("Failed to create chart.")
    else:
        print("Failed to retrieve stock data.")

if __name__ == "__main__":
    main()