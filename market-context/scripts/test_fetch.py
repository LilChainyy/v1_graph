#!/usr/bin/env python3
"""
Test script for the event fetcher.
"""

import sys
from pathlib import Path

# Add the scripts directory to the path
sys.path.append(str(Path(__file__).parent))

from fetch_events import EventFetcher

def test_fetch():
    """Test the event fetcher with sample data."""
    print("Testing event fetcher...")
    
    fetcher = EventFetcher()
    
    # Test with a small date range
    start_date = "2025-09-14"
    end_date = "2025-09-30"
    
    print(f"Fetching events from {start_date} to {end_date}")
    
    # Test individual fetchers
    print("\n1. Testing FOMC events...")
    fomc_events = fetcher.fetch_fomc_events(start_date, end_date)
    print(f"Found {len(fomc_events)} FOMC events")
    for event in fomc_events:
        print(f"  - {event['date']}: {event['title']}")
    
    print("\n2. Testing Treasury auctions...")
    treasury_events = fetcher.fetch_treasury_auctions(start_date, end_date)
    print(f"Found {len(treasury_events)} Treasury events")
    for event in treasury_events:
        print(f"  - {event['date']}: {event['title']}")
    
    print("\n3. Testing NVDA IR events...")
    nvda_events = fetcher.fetch_nvda_ir_events(start_date, end_date)
    print(f"Found {len(nvda_events)} NVDA events")
    for event in nvda_events:
        print(f"  - {event['date']}: {event['title']}")
    
    print("\n4. Testing full fetch...")
    fetcher.fetch_events("NVDA", start_date, end_date)
    
    print("\nTest completed!")

if __name__ == "__main__":
    test_fetch()
