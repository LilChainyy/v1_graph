import yfinance as yf
import matplotlib.pyplot as plt
import pandas as pd
from datetime import datetime, date
import warnings
import time
import base64
from io import BytesIO
warnings.filterwarnings('ignore')

def get_united_healthcare_data():
    """
    Fetch United Healthcare (UHC) stock data from January 1, 2025 to today
    """
    # United Healthcare ticker symbol
    ticker = "UNH"
    
    # Date range: January 1, 2024 to today
    start_date = "2024-01-01"
    end_date = datetime.now().strftime("%Y-%m-%d")
    
    print(f"Fetching {ticker} stock data from {start_date} to {end_date}...")
    
    try:
        # Download stock data with retry mechanism
        print(f"Attempting to fetch data for {ticker}...")
        stock = yf.Ticker(ticker)
        
        # Try to get info first to verify the ticker
        try:
            info = stock.info
            print(f"Company: {info.get('longName', 'Unknown')}")
        except:
            print("Could not fetch company info, but continuing...")
        
        # Add a small delay
        time.sleep(1)
        
        # Download historical data
        data = stock.history(start=start_date, end=end_date, auto_adjust=True, prepost=True)
        
        if data.empty:
            print("No data available for the specified date range.")
            print("Trying a broader date range...")
            # Try getting data from 2023 to see if the ticker works
            data = stock.history(start="2023-01-01", end=end_date, auto_adjust=True, prepost=True)
            if data.empty:
                return None
            else:
                print("Found data from 2023 onwards, using that instead.")
                start_date = "2023-01-01"
            
        return data, ticker, start_date, end_date
        
    except Exception as e:
        print(f"Error fetching data: {e}")
        print("This might be due to network issues or the ticker symbol.")
        return None

def create_stock_graph(data, ticker, start_date, end_date):
    """
    Create a graph showing daily closing prices and return as base64 encoded image
    """
    if data is None:
        return None
    
    # Set up the plot
    plt.figure(figsize=(14, 8))
    plt.style.use('default')
    
    # Plot closing prices with green line only
    plt.plot(data.index, data['Close'], linewidth=3, color='#00AA00', label='Closing Price')
    
    # Customize the graph - remove all labels and grid
    plt.title('')
    
    # Remove x and y axis labels
    plt.xlabel('')
    plt.ylabel('')
    
    # Remove gridlines
    plt.grid(False)
    
    # Remove legend
    plt.legend().set_visible(False)
    
    # Remove x and y axis ticks and labels
    plt.xticks([])
    plt.yticks([])
    
    # Set background to white
    plt.gca().set_facecolor('white')
    
    # Add some styling
    plt.tight_layout()
    
    # Convert plot to base64 string for HTML embedding
    buffer = BytesIO()
    plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight', 
                facecolor='white', edgecolor='none')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.getvalue()).decode()
    plt.close()
    
    return image_base64

def create_html_page(data, ticker, start_date, end_date, image_base64):
    """
    Create an HTML page with the stock chart embedded
    """
    if data is None:
        return
    
    # Calculate summary statistics
    total_days = len(data)
    highest_price = data['Close'].max()
    lowest_price = data['Close'].min()
    avg_price = data['Close'].mean()
    latest_price = data['Close'].iloc[-1]
    price_change = latest_price - data['Close'].iloc[0]
    percent_change = ((latest_price / data['Close'].iloc[0]) - 1) * 100
    
    # Prepare data for JavaScript
    dates = [date.strftime('%Y-%m-%d') for date in data.index]
    prices = data['Close'].tolist()
    
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{ticker} Stock Analysis</title>
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
                border-radius: 0px;
                box-shadow: none;
                overflow: hidden;
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
            // Stock data
            const stockData = {prices};
            const dates = {dates};
            
            // Create chart
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
                        legend: {{
                            display: false
                        }},
                        tooltip: {{
                            enabled: false
                        }}
                    }},
                    scales: {{
                        x: {{
                            display: false
                        }},
                        y: {{
                            display: false
                        }}
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
    """
    Main function to execute the stock analysis
    """
    print("United Healthcare Stock Analysis")
    print("=" * 40)
    
    # Get the data
    result = get_united_healthcare_data()
    
    if result is not None:
        data, ticker, start_date, end_date = result
        
        # Create the chart and get base64 image
        print("Creating chart...")
        image_base64 = create_stock_graph(data, ticker, start_date, end_date)
        
        if image_base64:
            # Create HTML page
            print("Generating HTML page...")
            html_content = create_html_page(data, ticker, start_date, end_date, image_base64)
            
            # Save HTML file
            html_filename = f"{ticker}_stock_analysis.html"
            with open(html_filename, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            print(f"✅ HTML page created: {html_filename}")
            print(f"📊 Chart with green line embedded in container box")
            print(f"📈 Data from {start_date} to {end_date}")
            print(f"💻 Open {html_filename} in your browser to view the chart")
            
            # Print summary statistics
            print(f"\n{'-'*50}")
            print(f"SUMMARY FOR {ticker} ({start_date} to {end_date})")
            print(f"{'-'*50}")
            print(f"Total trading days: {len(data)}")
            print(f"Highest closing price: ${data['Close'].max():.2f}")
            print(f"Lowest closing price: ${data['Close'].min():.2f}")
            print(f"Average closing price: ${data['Close'].mean():.2f}")
            print(f"Latest closing price: ${data['Close'].iloc[-1]:.2f}")
            print(f"Price change: ${data['Close'].iloc[-1] - data['Close'].iloc[0]:.2f}")
            print(f"Percentage change: {((data['Close'].iloc[-1] / data['Close'].iloc[0]) - 1) * 100:.2f}%")
        else:
            print("Failed to create chart.")
    else:
        print("Failed to retrieve stock data.")

if __name__ == "__main__":
    main()
