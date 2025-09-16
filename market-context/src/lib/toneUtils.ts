import { MarketEvent, ToneInfo } from './events';

export function computeToneInfo(event: MarketEvent): ToneInfo {
  if (event.type === "Treasury Auction") {
    return computeTreasuryTone(event);
  } else if (event.type === "Tariff") {
    return computeTariffTone(event);
  } else if (event.type === "FOMC") {
    return computeFOMCTone(event);
  }
  
  // Default to neutral for unknown event types
  return {
    toneLabel: "Neutral",
    toneWhy: "Event type not recognized"
  };
}

function computeTreasuryTone(event: MarketEvent): ToneInfo {
  // If we have auction results
  if (event.stopResult !== undefined && event.wiResult !== undefined) {
    const isStrong = event.stopResult < event.wiResult;
    
    if (isStrong) {
      return {
        toneLabel: "Risk-on",
        toneWhy: "Strong auction = lower yields → duration bid"
      };
    } else {
      return {
        toneLabel: "Risk-off",
        toneWhy: "Weak auction = higher yields → duration lagged"
      };
    }
  }
  
  // Pre-result: neutral
  return {
    toneLabel: "Neutral",
    toneWhy: "Auction result unknown"
  };
}

function computeTariffTone(event: MarketEvent): ToneInfo {
  if (event.tariffOutcome === "hike" || event.tariffOutcome === "widen") {
    return {
      toneLabel: "Risk-off",
      toneWhy: "Higher input costs & trade frictions weigh on risk"
    };
  } else if (event.tariffOutcome === "status-quo" || event.tariffOutcome === "delay") {
    return {
      toneLabel: "Risk-on",
      toneWhy: "Relief from escalation; risk stabilizes"
    };
  }
  
  // Default for unknown tariff outcomes
  return {
    toneLabel: "Neutral",
    toneWhy: "Tariff outcome uncertain"
  };
}

function computeFOMCTone(event: MarketEvent): ToneInfo {
  if (event.guidanceTone === "dovish") {
    return {
      toneLabel: "Risk-on",
      toneWhy: "Dovish guidance supports risk assets"
    };
  } else if (event.guidanceTone === "hawkish") {
    return {
      toneLabel: "Risk-off",
      toneWhy: "Hawkish guidance weighs on risk assets"
    };
  }
  
  return {
    toneLabel: "Neutral",
    toneWhy: "Neutral policy stance"
  };
}

export function generateActionInsight(event: MarketEvent) {
  if (event.type === "Treasury Auction") {
    return generateTreasuryActionInsight(event);
  } else if (event.type === "Tariff") {
    return generateTariffActionInsight(event);
  }
  
  return null;
}

function generateTreasuryActionInsight(event: MarketEvent) {
  const bullishScenario = "Yields ↓; duration (TLT/IEF) historically outperforms over next 24h; watch ES/NQ breadth for confirmation.";
  const bearishScenario = "Yields ↑; duration lags; watch USD/Financials; risk appetite typically softens.";
  const whatToWatch = "10Y yield, TLT, IEF, SPY, QQQ";
  
  return {
    bullishScenario,
    bearishScenario,
    whatToWatch
  };
}

function generateTariffActionInsight(event: MarketEvent) {
  if (event.tariffOutcome === "hike" || event.tariffOutcome === "widen") {
    const bullishScenario = "Limited escalation; targeted sectors may outperform expectations.";
    const bearishScenario = "Input costs ↑ / supply-chain risk; tone = risk-off; small caps/materials often underperform; watch SPY/QQQ/IWM.";
    const whatToWatch = "SPY, QQQ, IWM";
    
    return {
      bullishScenario,
      bearishScenario,
      whatToWatch
    };
  } else {
    const bullishScenario = "Relief tone; cyclicals/tech stabilize; watch follow-through in SPY/QQQ.";
    const bearishScenario = "Delayed decision creates uncertainty; market remains cautious.";
    const whatToWatch = "SPY, QQQ, IWM";
    
    return {
      bullishScenario,
      bearishScenario,
      whatToWatch
    };
  }
}
