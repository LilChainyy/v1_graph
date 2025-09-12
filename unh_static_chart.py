#!/usr/bin/env python3
# UNH stock line chart with earnings tooltips (Chart.js)
from __future__ import annotations
import json
from pathlib import Path
from datetime import date, timedelta
from typing import List, Tuple

import pandas as pd
import yfinance as yf

# ---------- CONFIG ----------
TICKER = "UNH"
START_DATE = date(2025, 1, 1)
LAST_KNOWN = date(2025, 9, 10)
YEAR_END   = date(2025, 12, 31)
OUTPUT_HTML = Path(f"{TICKER}_stock_chart.html")
# ----------------------------

def fetch_stock_data(ticker: str, start: date, end_inclusive: date) -> pd.DataFrame:
    yf_end = end_inclusive + timedelta(days=1)
    df = yf.Ticker(ticker).history(start=start.isoformat(), end=yf_end.isoformat(), auto_adjust=True)
    if df.empty:
        raise RuntimeError("No data returned from yfinance.")
    df.index = pd.to_datetime(df.index)
    if getattr(df.index, "tz", None) is not None:
        df.index = df.index.tz_localize(None)
    return df[["Close"]].copy()

def fetch_earnings_dates_2025(ticker: str) -> List[date]:
    dates: List[date] = []
    try:
        raw = yf.Ticker(ticker).get_earnings_dates(limit=30)
        if isinstance(raw, pd.DataFrame) and not raw.empty:
            tmp = raw.reset_index().rename(columns={"index": "Date"})
            for d in pd.to_datetime(tmp["Date"], errors="coerce").dropna():
                dd = d.to_pydatetime().date()
                if dd.year == 2025:
                    dates.append(dd)
        elif isinstance(raw, dict):
            for key in ("Earnings Date", "EarningsDate", "date", "dates"):
                if key in raw:
                    s = pd.to_datetime(pd.Series(raw[key]), errors="coerce").dropna()
                    for d in s:
                        dd = d.to_pydatetime().date()
                        if dd.year == 2025:
                            dates.append(dd)
                    break
    except Exception:
        pass
    if not dates:
        dates = [date(2025,1,16), date(2025,4,15), date(2025,7,16), date(2025,10,15)]
    return sorted({d for d in dates if START_DATE <= d <= YEAR_END})

def quarter_label_for_report_date(d: date) -> str:
    if 1 <= d.month <= 3: return "Q4"
    if 4 <= d.month <= 6: return "Q1"
    if 7 <= d.month <= 9: return "Q2"
    return "Q3"

def align_earnings(  # CHANGED: return $ move instead of %
    price_df: pd.DataFrame,
    earnings_days: List[date],
    last_close: float,
) -> Tuple[List[str], List[float], List[str], List[float]]:
    idx = price_df.index
    closes = price_df["Close"]
    e_dates, e_prices, e_quarters, e_dollars = [], [], [], []
    for d in earnings_days:
        ts = pd.Timestamp(d)
        p = idx.searchsorted(ts, side="left")
        if p >= len(idx):
            earn_price = float(last_close)
            p = len(idx) - 1
        else:
            earn_price = float(closes.iloc[p])
        prior_idx = max(0, p - 1)
        prior_price = float(closes.iloc[prior_idx])
        dollar_move = earn_price - prior_price  # CHANGED
        e_dates.append(d.isoformat())
        e_prices.append(earn_price)
        e_quarters.append(f"{quarter_label_for_report_date(d)} quarter")
        e_dollars.append(dollar_move)
    return e_dates, e_prices, e_quarters, e_dollars

def build_chart_html(
    dates: list[str],
    closes: list[float],
    last_known: date,
    year_end: date,
    earnings_dates: list[str],
    earnings_prices: list[float],
    earnings_quarters: list[str],
    earnings_dollars: list[float],   # CHANGED
) -> str:
    last_px = closes[-1]
    future_dates = pd.date_range(last_known + timedelta(days=1), year_end, freq="D")
    future_dates_str = [d.strftime("%Y-%m-%d") for d in future_dates]
    future_prices = [float(last_px)] * len(future_dates_str)

    # JSON
    json_actual_dates   = json.dumps(dates)
    json_actual_prices  = json.dumps([float(x) for x in closes])
    json_future_dates   = json.dumps(future_dates_str)
    json_future_prices  = json.dumps(future_prices)
    json_e_dates        = json.dumps(earnings_dates)
    json_e_prices       = json.dumps([float(x) for x in earnings_prices])
    json_e_quarters     = json.dumps(earnings_quarters)
    json_e_dollars      = json.dumps([float(x) for x in earnings_dollars])  # CHANGED

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>{TICKER} Stock Chart</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
  :root {{
    --green:#0a8a0a; --ink:#111; --bg:#fff; --muted:#6b7280; --purple:#6b46c1; --grey:#9ca3af;
  }}
  html,body {{ margin:0; padding:0; background:var(--bg); color:var(--ink);
    font:14px/1.45 -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; }}
  .wrap {{ max-width: 1000px; margin:24px auto; padding:0 16px; }}
  h1 {{ font-size:20px; margin:8px 0 16px; }}
  .chart-box {{ position:relative; height:520px; background:#fff; border-radius:12px;
    box-shadow:0 1px 4px rgba(0,0,0,.06); padding:16px; }}
  /* Base tooltip = dark bubble (for normal tracing) */
  .tooltip {{
    position:absolute; background:rgba(16,16,16,.92); color:#fff; padding:6px 8px; border-radius:8px;
    font-size:12px; pointer-events:none; transform:translate(6px,-6px); /* CHANGED: closer */
    opacity:0; transition:opacity .12s;
  }}
  .tooltip.show {{ opacity:1; }}
  /* Earnings style toggled via .earn class */
  .tooltip.earn {{ background:#fff; color:var(--ink); border:2px solid var(--purple);
    box-shadow:0 1px 6px rgba(0,0,0,.08); }}
  .legend {{ margin:10px 4px 0; color:var(--muted); font-size:12px; display:flex; gap:12px; align-items:center; }}
  .legend .dot::before {{ content:'●'; margin-right:6px; }}
  .legend .actual::before {{ color:var(--green); }}
  .legend .stub::before {{ color:var(--grey); }}
  .legend .earn::before {{ color:var(--purple); }}
  .q {{ color:var(--purple); font-weight:600; }}
  .up {{ color:#166534; font-weight:600; }}
  .down {{ color:#991b1b; font-weight:600; }}
</style>
</head>
<body>
  <div class="wrap">
    <h1>💹 {TICKER} — Close Price</h1>
    <div class="legend">
      <span class="dot actual">Actual through {last_known:%b %d, %Y}</span>
      <span class="dot stub">No prices yet (flat to Dec 31)</span>
      <span class="dot earn">Earnings dates</span>
    </div>
    <div class="chart-box">
      <canvas id="chart"></canvas>
      <div id="tooltip" class="tooltip"></div>
    </div>
  </div>

<script>
  const actualDates    = {json_actual_dates};
  const actualPrices   = {json_actual_prices};
  const stubDates      = {json_future_dates};
  const stubPrices     = {json_future_prices};
  const earningsDates  = {json_e_dates};
  const earningsPrices = {json_e_prices};
  const earningsQuarts = {json_e_quarters};
  const earningsDols   = {json_e_dollars};  // CHANGED ($ move)

  const labels = actualDates.concat(stubDates);
  const labelIndex = new Map(labels.map((d,i)=>[d,i]));

  const earningsSeries = Array(labels.length).fill(null);
  const eMeta = {{}}; // date -> quarter and dollars
  earningsDates.forEach((d, k) => {{
    const i = labelIndex.get(d);
    if (i != null) {{
      earningsSeries[i] = Number(earningsPrices[k]);
      eMeta[d] = {{quarter: earningsQuarts[k], dollars: Number(earningsDols[k])}};
    }}
  }});

  const ctx = document.getElementById('chart').getContext('2d');
  const tooltipEl = document.getElementById('tooltip');

  const chart = new Chart(ctx, {{
    type: 'line',
    data: {{
      labels,
      datasets: [
        {{
          label: 'Close (actual)',
          data: actualPrices,
          borderColor: '#0a8a0a',
          backgroundColor: 'transparent',
          borderWidth: 2.5,
          pointRadius: 0,
          tension: 0
        }},
        {{
          label: 'No prices yet',
          data: Array(actualPrices.length).fill(null).concat(stubPrices),
          borderColor: '#9ca3af',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [6,6],
          pointRadius: 0,
          tension: 0
        }},
        {{
          label: 'Earnings',
          data: earningsSeries,
          borderColor: 'transparent',
          backgroundColor: 'transparent',
          showLine: false,
          pointRadius: 7,
          pointHoverRadius: 9,
          pointBackgroundColor: '#6b46c1',
          pointBorderColor: '#6b46c1',
          pointBorderWidth: 2,
        }}
      ]
    }},
    options: {{
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {{ legend: {{ display:false }}, tooltip: {{ enabled:false }} }},
      scales: {{ x: {{ display:false }}, y: {{ display:false }} }},
      interaction: {{ mode: 'index', intersect: false }},
      onHover(evt, active) {{
        const rect = evt.chart.canvas.getBoundingClientRect();
        const idx = active.length ? active[0].index : null;
        if (idx == null) {{
          tooltipEl.classList.remove('show','earn'); // CHANGED: remove style
          return;
        }}
        const label = labels[idx];
        const isEarnings = earningsSeries[idx] != null;

        if (isEarnings) {{
          const meta = eMeta[label] || {{quarter:'', dollars:0}};
          const sign = meta.dollars >= 0 ? 'up' : 'down';
          const amt  = Math.abs(meta.dollars).toFixed(2);
          // CHANGED: earnings tooltip = white card + purple frame
          tooltipEl.classList.add('earn');
          tooltipEl.innerHTML = `
            <div class="q">${{meta.quarter}}</div>
            <div>Q earnings hit, price <span class="${{sign}}">${{sign}} $${{amt}}</span></div>
          `;
        }} else {{
          // CHANGED: normal tracing uses dark tooltip (no purple frame)
          tooltipEl.classList.remove('earn');
          let price = null;
          if (idx < actualPrices.length && actualPrices[idx] != null) {{
            price = Number(actualPrices[idx]);
          }} else {{
            const stubIdx = idx - actualPrices.length;
            if (stubIdx >= 0 && stubPrices[stubIdx] != null) {{
              price = Number(stubPrices[stubIdx]);
            }}
          }}
          tooltipEl.innerHTML = `${{label}}<br>Close: $${{price?.toFixed(2) ?? '—'}}`;
        }}

        tooltipEl.style.left = (evt.x - rect.left + 6) + 'px';  // CHANGED: closer
        tooltipEl.style.top  = (evt.y - rect.top  - 6) + 'px';  // CHANGED: closer
        tooltipEl.classList.add('show');
      }}
    }}
  }});
</script>
</body>
</html>
"""

def main() -> None:
    print("UNH Stock Chart with Earnings (custom tooltips)")
    try:
        price_df = fetch_stock_data(TICKER, START_DATE, LAST_KNOWN)
    except Exception as e:
        print(f"✖ Error fetching data: {e}")
        return
    dates = [ts.strftime("%Y-%m-%d") for ts in price_df.index]
    closes = [float(x) for x in price_df["Close"].tolist()]
    last_close = closes[-1]

    earnings_days = fetch_earnings_dates_2025(TICKER)
    e_dates, e_prices, e_quarters, e_dollars = align_earnings(price_df, earnings_days, last_close)

    html = build_chart_html(dates, closes, LAST_KNOWN, YEAR_END, e_dates, e_prices, e_quarters, e_dollars)
    OUTPUT_HTML.write_text(html, encoding="utf-8")

    print(f"✅ Wrote: {OUTPUT_HTML.name} — open it in your browser.")

if __name__ == "__main__":
    main()
