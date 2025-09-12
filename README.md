# UNH Timeline Chart (MVP)

A Streamlit application that visualizes UnitedHealth Group (UNH) stock price timeline for 2025, showing actual prices through September 10th and projected flat prices for the remainder of the year, plus earnings date markers.

## Features

- **Interactive Timeline Chart**: Green line shows actual UNH closing prices from Jan 1 - Sep 10, 2025
- **Future Projection**: Grey dashed line shows flat projection from Sep 11 - Dec 31, 2025
- **Earnings Markers**: Large red circles mark quarterly earnings dates with hover tooltips
- **Key Performance Indicators**: Latest close price, price change, and percentage change
- **Data Export**: Download CSV button for the complete dataset
- **Responsive Design**: Clean, modern interface optimized for desktop viewing

## Installation

1. **Clone or download** this repository
2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

1. **Run the Streamlit app**:
   ```bash
   streamlit run app.py
   ```

2. **Open your browser** to the URL shown in the terminal (typically `http://localhost:8501`)

3. **Interact with the chart**:
   - Hover over data points to see price and date information
   - Hover over earnings markers (red circles) to see earnings dates
   - Use the export button to download the data as CSV

## Technical Details

### Dependencies
- **Streamlit**: Web application framework
- **Plotly**: Interactive charting library
- **yfinance**: Yahoo Finance data API
- **pandas**: Data manipulation
- **numpy**: Numerical computing

### Data Sources
- **Stock Prices**: Yahoo Finance (yfinance) - daily OHLC data
- **Earnings Dates**: Yahoo Finance earnings calendar
- **Time Period**: January 1, 2025 - December 31, 2025

### Chart Components
- **Actual Data Line**: Green line showing real closing prices (Jan 1 - Sep 10)
- **Projected Line**: Grey dashed line at latest known close (Sep 11 - Dec 31)
- **Earnings Markers**: Red circles with white borders at earnings dates
- **Separation Line**: Orange dotted vertical line at Sep 10, 2025

## File Structure

```
v1_graph/
├── app.py                 # Main Streamlit application
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── test_yfinance.py      # yfinance testing script
├── united_healthcare_stock.py  # Original HTML chart generator
├── UNH_stock_analysis.html     # Generated HTML chart
└── UNH_stock_chart.html        # Generated HTML chart
```

## Customization

To modify the application:

1. **Change the stock ticker**: Edit the `ticker = "UNH"` line in `get_unh_data()`
2. **Adjust date ranges**: Modify the start/end dates in the data fetching functions
3. **Update chart colors**: Change color values in the `create_timeline_chart()` function
4. **Add more KPIs**: Extend the `calculate_kpis()` function

## Troubleshooting

- **Data loading issues**: Check internet connection and Yahoo Finance availability
- **Missing earnings dates**: Earnings calendar may not be available for future dates
- **Chart not displaying**: Ensure all dependencies are installed correctly

## Future Enhancements

- Multi-ticker support
- Additional technical indicators
- Database storage for historical data
- User authentication and preferences
- Mobile-responsive design improvements

