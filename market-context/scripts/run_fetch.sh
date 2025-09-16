#!/bin/bash
# Script to run the event fetcher for NVDA

echo "Fetching NVDA events from today through end of 2025..."

# Get today's date in YYYY-MM-DD format
TODAY=$(date +%Y-%m-%d)

# Run the Python script
python3 scripts/fetch_events.py --ticker NVDA --start $TODAY --end 2025-12-31

echo "Event fetch completed!"
echo "Check src/data/company/nvda_events.json for updated events"
