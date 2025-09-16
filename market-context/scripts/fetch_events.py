#!/usr/bin/env python3
"""
Event fetcher for company calendars.
Fetches events from multiple sources and updates the JSON data files.
"""

import argparse
import json
import logging
import re
import sys
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Any, Optional
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup
from dateutil import parser as date_parser

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class EventFetcher:
    def __init__(self, data_dir: str = "src/data"):
        self.data_dir = Path(data_dir)
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (compatible; MarketContext/1.0; +https://example.com/bot)'
        })
        self.added_this_run = []  # Track events added in this run
    
    def slugify(self, text: str) -> str:
        """Convert text to a URL-safe slug."""
        text = re.sub(r'[^\w\s-]', '', text.lower())
        text = re.sub(r'[-\s]+', '_', text)
        return text.strip('_')
    
    def generate_event_id(self, ticker: str, event_type: str, date: str, title: str) -> str:
        """Generate a stable event ID."""
        short_title = self.slugify(title)[:20]
        return f"{ticker.lower()}_{event_type.lower()}_{date}_{short_title}"
    
    def add_metadata(self, event: Dict[str, Any], source: str) -> Dict[str, Any]:
        """Add createdAt and source metadata to an event."""
        event["createdAt"] = datetime.utcnow().isoformat() + "Z"
        event["source"] = source
        return event
    
    def fetch_nvda_ir_events(self, start_date: str, end_date: str) -> List[Dict[str, Any]]:
        """Fetch events from NVIDIA IR page."""
        events = []
        try:
            # Try to find IR events page or RSS feed
            ir_urls = [
                "https://ir.nvidia.com/events-and-presentations",
                "https://ir.nvidia.com/rss/news-releases.xml"
            ]
            
            for url in ir_urls:
                try:
                    response = self.session.get(url, timeout=10)
                    response.raise_for_status()
                    
                    if url.endswith('.xml'):
                        # Parse RSS feed
                        soup = BeautifulSoup(response.content, 'xml')
                        items = soup.find_all('item')
                        
                        for item in items:
                            title = item.find('title')
                            pub_date = item.find('pubDate')
                            link = item.find('link')
                            
                            if title and pub_date:
                                try:
                                    event_date = date_parser.parse(pub_date.text).strftime('%Y-%m-%d')
                                    if start_date <= event_date <= end_date:
                                        event = {
                                            "id": self.generate_event_id("NVDA", "Conference", event_date, title.text),
                                            "ticker": "NVDA",
                                            "title": title.text,
                                            "date": event_date,
                                            "eventType": "Conference",
                                            "isBinary": False,
                                            "isRecurring": "episodic",
                                            "tags": ["Tech", "AI", "Semis"],
                                            "direct": True,
                                            "links": [link.text] if link else [],
                                            "notes": "NVIDIA IR event"
                                        }
                                        event = self.add_metadata(event, "IR")
                                        events.append(event)
                                except Exception as e:
                                    logger.warning(f"Error parsing RSS item: {e}")
                    else:
                        # Parse HTML page
                        soup = BeautifulSoup(response.content, 'html.parser')
                        # Look for event listings - this would need to be customized based on actual page structure
                        logger.info("HTML parsing not implemented yet for IR page")
                        
                except Exception as e:
                    logger.warning(f"Error fetching from {url}: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error fetching NVIDIA IR events: {e}")
        
        return events
    
    def fetch_fomc_events(self, start_date: str, end_date: str) -> List[Dict[str, Any]]:
        """Fetch FOMC meeting dates."""
        events = []
        try:
            url = "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm"
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Look for FOMC meeting dates in the HTML
            # This is a simplified parser - would need to be more robust
            date_pattern = r'\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+2025\b'
            
            for text in soup.get_text():
                matches = re.findall(date_pattern, text)
                for match in matches:
                    try:
                        event_date = date_parser.parse(match).strftime('%Y-%m-%d')
                        if start_date <= event_date <= end_date:
                            event = {
                                "id": f"fomc_{event_date.replace('-', '_')}",
                                "eventType": "FOMC",
                                "title": "FOMC Meeting",
                                "date": event_date,
                                "time": "14:00 ET",
                                "isBinary": True,
                                "isRecurring": "fixed",
                                "tags": ["Bonds", "Rates", "Broad Market"],
                                "notes": "Federal Open Market Committee meeting and press conference",
                                "links": [url]
                            }
                            event = self.add_metadata(event, "FOMC")
                            events.append(event)
                    except Exception as e:
                        logger.warning(f"Error parsing FOMC date {match}: {e}")
                        
        except Exception as e:
            logger.error(f"Error fetching FOMC events: {e}")
        
        return events
    
    def fetch_treasury_auctions(self, start_date: str, end_date: str) -> List[Dict[str, Any]]:
        """Fetch Treasury auction dates."""
        events = []
        try:
            # Treasury Direct doesn't have a simple API, so we'll create some known auction dates
            # In a real implementation, you'd parse the Treasury Direct calendar page
            known_auctions = [
                "2025-09-15", "2025-09-16", "2025-09-17",  # 10Y, 30Y, 2Y
                "2025-10-15", "2025-10-16", "2025-10-17",
                "2025-11-15", "2025-11-16", "2025-11-17",
                "2025-12-15", "2025-12-16", "2025-12-17"
            ]
            
            for auction_date in known_auctions:
                if start_date <= auction_date <= end_date:
                    event = {
                        "id": f"treasury_auction_{auction_date.replace('-', '_')}",
                        "eventType": "Treasury Auction",
                        "title": "Treasury Auction",
                        "date": auction_date,
                        "time": "13:00 ET",
                        "isBinary": False,
                        "isRecurring": "fixed",
                        "tags": ["Bonds", "Rates", "Broad Market"],
                        "notes": "U.S. Treasury auction",
                        "links": ["https://www.treasurydirect.gov/"]
                    }
                    event = self.add_metadata(event, "Treasury")
                    events.append(event)
                    
        except Exception as e:
            logger.error(f"Error fetching Treasury auctions: {e}")
        
        return events
    
    def fetch_ustr_tariff_actions(self, start_date: str, end_date: str) -> List[Dict[str, Any]]:
        """Fetch USTR tariff actions."""
        events = []
        try:
            # USTR actions are less predictable, so we'll create placeholder events
            # In a real implementation, you'd monitor USTR press releases
            logger.info("USTR tariff monitoring not implemented yet")
            
        except Exception as e:
            logger.error(f"Error fetching USTR actions: {e}")
        
        return events
    
    def create_nvda_company_events(self, macro_events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Convert macro events to NVDA company events."""
        nvda_events = []
        
        for event in macro_events:
            if event.get("eventType") in ["FOMC", "Treasury Auction", "Tariff"]:
                nvda_event = {
                    "id": f"nvda_{event['id']}",
                    "ticker": "NVDA",
                    "title": f"{event['title']} affects NVDA",
                    "date": event["date"],
                    "time": event.get("time"),
                    "eventType": event["eventType"],
                    "isBinary": event["isBinary"],
                    "isRecurring": event["isRecurring"],
                    "tags": event["tags"] + ["Tech"],
                    "direct": False,
                    "links": event.get("links", []),
                    "notes": f"Macro event impact on NVDA: {event.get('notes', '')}"
                }
                nvda_event = self.add_metadata(nvda_event, event.get("source", "Macro"))
                nvda_events.append(nvda_event)
        
        return nvda_events
    
    def load_existing_events(self, ticker: str) -> List[Dict[str, Any]]:
        """Load existing events from JSON file."""
        events_file = self.data_dir / "company" / f"{ticker.lower()}_events.json"
        
        if events_file.exists():
            try:
                with open(events_file, 'r') as f:
                    return json.load(f)
            except Exception as e:
                logger.warning(f"Error loading existing events: {e}")
        
        return []
    
    def save_events(self, ticker: str, events: List[Dict[str, Any]]) -> None:
        """Save events to JSON file."""
        events_file = self.data_dir / "company" / f"{ticker.lower()}_events.json"
        events_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Sort events by date
        events.sort(key=lambda x: x["date"])
        
        with open(events_file, 'w') as f:
            json.dump(events, f, indent=2)
        
        # Save recently added events
        self.save_recently_added(ticker)
        
        logger.info(f"Saved {len(events)} events to {events_file}")
    
    def save_recently_added(self, ticker: str) -> None:
        """Save recently added events to a separate file."""
        added_file = self.data_dir / "company" / f"{ticker.lower()}_events_added_latest.json"
        
        # Create lightweight version of added events
        lightweight_added = []
        for event in self.added_this_run:
            lightweight_event = {
                "id": event["id"],
                "title": event["title"],
                "date": event["date"],
                "source": event.get("source", "Unknown"),
                "createdAt": event.get("createdAt", datetime.utcnow().isoformat() + "Z")
            }
            lightweight_added.append(lightweight_event)
        
        with open(added_file, 'w') as f:
            json.dump(lightweight_added, f, indent=2)
        
        logger.info(f"Saved {len(lightweight_added)} recently added events to {added_file}")
    
    def fetch_events(self, ticker: str, start_date: str, end_date: str) -> None:
        """Main method to fetch and save events."""
        logger.info(f"Fetching events for {ticker} from {start_date} to {end_date}")
        
        # Reset added events tracking
        self.added_this_run = []
        
        # Load existing events
        existing_events = self.load_existing_events(ticker)
        existing_ids = {event["id"] for event in existing_events}
        
        # Fetch new events
        all_events = existing_events.copy()
        
        # Fetch company-specific events
        if ticker.upper() == "NVDA":
            company_events = self.fetch_nvda_ir_events(start_date, end_date)
            for event in company_events:
                if event["id"] not in existing_ids:
                    all_events.append(event)
                    existing_ids.add(event["id"])
                    self.added_this_run.append(event)
        
        # Fetch macro events
        macro_events = []
        macro_events.extend(self.fetch_fomc_events(start_date, end_date))
        macro_events.extend(self.fetch_treasury_auctions(start_date, end_date))
        macro_events.extend(self.fetch_ustr_tariff_actions(start_date, end_date))
        
        # Convert macro events to company events
        company_macro_events = self.create_nvda_company_events(macro_events)
        for event in company_macro_events:
            if event["id"] not in existing_ids:
                all_events.append(event)
                existing_ids.add(event["id"])
                self.added_this_run.append(event)
        
        # Save updated events
        self.save_events(ticker, all_events)
        
        logger.info(f"Total events: {len(all_events)} (added {len(self.added_this_run)} new)")

def main():
    parser = argparse.ArgumentParser(description='Fetch events for company calendars')
    parser.add_argument('--ticker', required=True, help='Company ticker (e.g., NVDA)')
    parser.add_argument('--start', required=True, help='Start date (YYYY-MM-DD)')
    parser.add_argument('--end', required=True, help='End date (YYYY-MM-DD)')
    parser.add_argument('--data-dir', default='src/data', help='Data directory path')
    
    args = parser.parse_args()
    
    # Validate dates
    try:
        datetime.strptime(args.start, '%Y-%m-%d')
        datetime.strptime(args.end, '%Y-%m-%d')
    except ValueError:
        logger.error("Invalid date format. Use YYYY-MM-DD")
        sys.exit(1)
    
    # Fetch events
    fetcher = EventFetcher(args.data_dir)
    fetcher.fetch_events(args.ticker, args.start, args.end)

if __name__ == "__main__":
    main()
