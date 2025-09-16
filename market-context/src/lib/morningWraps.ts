// Simple HTML parsing without JSDOM dependency

export interface MorningWrap {
  source: 'Reuters' | 'Yahoo' | 'MarketWatch' | 'AP';
  url: string;
  title: string;
  lead: string;
  fetchedAt: string;
}

export interface SceneData {
  marketTrend: 'up' | 'flat' | 'mixed' | 'down';
  sentiment: 'firmer' | 'neutral' | 'cautious';
  rates: 'easing' | 'steady' | 'climbing';
  fear: 'calm' | 'normal' | 'picking up';
  nextEvent: {
    type: 'CPI' | 'Fed meeting' | 'Jobs report' | '10-yr auction' | 'Tariff update';
    weekday: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
    why: string;
  };
  sources: string[];
  attribution?: string;
}

// Rate limiting and caching
const cache = new Map<string, { data: MorningWrap[]; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

async function fetchWithRetry(url: string, retries = 2): Promise<string | null> {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; MarketContext/1.0; +https://example.com/bot)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (response.status === 429 || response.status === 403) {
        if (i < retries) {
          await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1))); // Exponential backoff
          continue;
        }
        return null;
      }

      if (!response.ok) {
        return null;
      }

      return await response.text();
    } catch (error) {
      if (i === retries) {
        console.warn(`Failed to fetch ${url}:`, error);
        return null;
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  return null;
}

function extractTextFromHtml(html: string, selectors: string[]): string {
  try {
    // Simple regex-based HTML parsing
    for (const selector of selectors) {
      let pattern = '';
      
      if (selector.includes('[data-testid=')) {
        const attr = selector.match(/\[data-testid="([^"]+)"\]/)?.[1];
        const tag = selector.split('[')[0] || 'div';
        pattern = new RegExp(`<${tag}[^>]*data-testid="${attr}"[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
      } else if (selector.includes('.')) {
        const parts = selector.split('.');
        const tag = parts[0] || 'div';
        const className = parts[1];
        pattern = new RegExp(`<${tag}[^>]*class="[^"]*${className}[^"]*"[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
      } else {
        pattern = new RegExp(`<${selector}[^>]*>([\\s\\S]*?)</${selector}>`, 'i');
      }
      
      const match = html.match(pattern);
      if (match && match[1]) {
        // Remove HTML tags and clean up text
        const text = match[1]
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .replace(/&[^;]+;/g, ' ') // Remove HTML entities
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();
        
        if (text.length > 10) { // Only return meaningful text
          return text;
        }
      }
    }
    return '';
  } catch (error) {
    console.warn('Error parsing HTML:', error);
    return '';
  }
}

async function fetchReuters(): Promise<MorningWrap | null> {
  try {
    const html = await fetchWithRetry('https://www.reuters.com/business/finance/morning-bid/');
    if (!html) return null;

    const title = extractTextFromHtml(html, [
      'h1[data-testid="headline"]',
      'h1',
      '.headline'
    ]);

    const lead = extractTextFromHtml(html, [
      'p[data-testid="paragraph"]',
      '.article-body p',
      'p'
    ]);

    if (!title || !lead) return null;

    return {
      source: 'Reuters',
      url: 'https://www.reuters.com/business/finance/morning-bid/',
      title: title.substring(0, 200),
      lead: lead.substring(0, 300),
      fetchedAt: new Date().toISOString()
    };
  } catch (error) {
    console.warn('Reuters fetch failed:', error);
    return null;
  }
}

async function fetchYahoo(): Promise<MorningWrap | null> {
  try {
    const html = await fetchWithRetry('https://finance.yahoo.com/news/');
    if (!html) return null;

    const title = extractTextFromHtml(html, [
      'h3[data-testid="headline"]',
      'h3 a',
      'h2 a'
    ]);

    const lead = extractTextFromHtml(html, [
      'p[data-testid="summary"]',
      '.summary',
      'p'
    ]);

    if (!title || !lead) return null;

    return {
      source: 'Yahoo',
      url: 'https://finance.yahoo.com/news/',
      title: title.substring(0, 200),
      lead: lead.substring(0, 300),
      fetchedAt: new Date().toISOString()
    };
  } catch (error) {
    console.warn('Yahoo fetch failed:', error);
    return null;
  }
}

async function fetchMarketWatch(): Promise<MorningWrap | null> {
  try {
    const html = await fetchWithRetry('https://www.marketwatch.com/markets');
    if (!html) return null;

    const title = extractTextFromHtml(html, [
      'h1.article__headline',
      'h1',
      '.headline'
    ]);

    const lead = extractTextFromHtml(html, [
      '.article__content p',
      '.article-body p',
      'p'
    ]);

    if (!title || !lead) return null;

    return {
      source: 'MarketWatch',
      url: 'https://www.marketwatch.com/markets',
      title: title.substring(0, 200),
      lead: lead.substring(0, 300),
      fetchedAt: new Date().toISOString()
    };
  } catch (error) {
    console.warn('MarketWatch fetch failed:', error);
    return null;
  }
}

export async function fetchMorningWraps(): Promise<MorningWrap[]> {
  const cacheKey = 'morning-wraps';
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  console.log('Fetching morning wraps...');
  
  const results = await Promise.allSettled([
    fetchReuters(),
    fetchYahoo(),
    fetchMarketWatch()
  ]);

  const wraps: MorningWrap[] = results
    .filter((result): result is PromiseFulfilledResult<MorningWrap> => 
      result.status === 'fulfilled' && result.value !== null
    )
    .map(result => result.value);

  // Cache the results
  cache.set(cacheKey, { data: wraps, timestamp: Date.now() });
  
  console.log(`Fetched ${wraps.length} morning wraps`);
  return wraps;
}

export function sceneFromWraps(wraps: MorningWrap[]): SceneData {
  if (wraps.length === 0) {
    return getDefaultSceneData();
  }

  // Combine first 2-3 items into text blob
  const textBlob = wraps
    .slice(0, 3)
    .map(wrap => `${wrap.title} ${wrap.lead}`)
    .join(' ')
    .toLowerCase();

  console.log('Analyzing text blob:', textBlob.substring(0, 200) + '...');

  // Extract market trend
  const marketTrend = extractMarketTrend(textBlob);
  
  // Extract sentiment
  const sentiment = extractSentiment(textBlob);
  
  // Extract rates
  const rates = extractRates(textBlob);
  
  // Extract fear
  const fear = extractFear(textBlob);
  
  // Extract next event
  const nextEvent = extractNextEvent(textBlob);

  const sources = wraps.map(wrap => wrap.source);

  return {
    marketTrend,
    sentiment,
    rates,
    fear,
    nextEvent,
    sources,
    attribution: `Based on reporting from ${sources.join(', ')}`
  };
}

function extractMarketTrend(text: string): 'up' | 'flat' | 'mixed' | 'down' {
  const upKeywords = ['rises', 'higher', 'gains', 'advances', 'edges up', 'nudged higher', 'climbs', 'jumps', 'surges'];
  const downKeywords = ['falls', 'lower', 'slips', 'retreats', 'edges down', 'selloff', 'drops', 'declines', 'plunges'];
  const mixedKeywords = ['mixed', 'little changed', 'sideways', 'choppy'];

  if (mixedKeywords.some(keyword => text.includes(keyword))) {
    return 'mixed';
  }

  const upCount = upKeywords.filter(keyword => text.includes(keyword)).length;
  const downCount = downKeywords.filter(keyword => text.includes(keyword)).length;

  if (upCount > downCount) return 'up';
  if (downCount > upCount) return 'down';
  return 'flat';
}

function extractSentiment(text: string): 'firmer' | 'neutral' | 'cautious' {
  const firmerKeywords = ['optimism', 'bid', 'risk appetite', 'relief', 'rally', 'confidence', 'bullish'];
  const cautiousKeywords = ['jitters', 'worries', 'risk aversion', 'fears', 'selloff', 'uncertain', 'nervous', 'bearish'];

  const firmerCount = firmerKeywords.filter(keyword => text.includes(keyword)).length;
  const cautiousCount = cautiousKeywords.filter(keyword => text.includes(keyword)).length;

  if (firmerCount > cautiousCount) return 'firmer';
  if (cautiousCount > firmerCount) return 'cautious';
  return 'neutral';
}

function extractRates(text: string): 'easing' | 'steady' | 'climbing' {
  const ratesKeywords = ['yields', 'rates', 'treasury', 'bond', 'interest'];
  const easingKeywords = ['fall', 'ease', 'slip', 'down', 'decline', 'drop'];
  const climbingKeywords = ['rise', 'climb', 'spike', 'up', 'surge', 'jump'];

  if (!ratesKeywords.some(keyword => text.includes(keyword))) {
    return 'steady';
  }

  const easingCount = easingKeywords.filter(keyword => text.includes(keyword)).length;
  const climbingCount = climbingKeywords.filter(keyword => text.includes(keyword)).length;

  if (easingCount > climbingCount) return 'easing';
  if (climbingCount > easingCount) return 'climbing';
  return 'steady';
}

function extractFear(text: string): 'calm' | 'normal' | 'picking up' {
  const vixKeywords = ['vix', 'volatility'];
  const calmKeywords = ['down', 'calm', 'muted', 'low', 'quiet'];
  const nervousKeywords = ['up', 'spike', 'jumpy', 'nervous', 'high', 'elevated'];

  if (!vixKeywords.some(keyword => text.includes(keyword))) {
    return 'normal';
  }

  const calmCount = calmKeywords.filter(keyword => text.includes(keyword)).length;
  const nervousCount = nervousKeywords.filter(keyword => text.includes(keyword)).length;

  if (calmCount > nervousCount) return 'calm';
  if (nervousCount > calmCount) return 'picking up';
  return 'normal';
}

function extractNextEvent(text: string): SceneData['nextEvent'] {
  // Extract event type
  let type: SceneData['nextEvent']['type'] = 'CPI';
  
  if (text.includes('cpi') || text.includes('inflation')) {
    type = 'CPI';
  } else if (text.includes('fed') || text.includes('fomc') || text.includes('rate decision')) {
    type = 'Fed meeting';
  } else if (text.includes('jobs') || text.includes('payrolls') || text.includes('nfp') || text.includes('unemployment')) {
    type = 'Jobs report';
  } else if (text.includes('10-year') || text.includes('10yr') || text.includes('treasury auction') || text.includes('note auction')) {
    type = '10-yr auction';
  } else if (text.includes('tariff') || text.includes('trade')) {
    type = 'Tariff update';
  }

  // Extract weekday
  let weekday: SceneData['nextEvent']['weekday'] = 'Thu';
  const weekdayMap: { [key: string]: SceneData['nextEvent']['weekday'] } = {
    'monday': 'Mon', 'tuesday': 'Tue', 'wednesday': 'Wed', 'thursday': 'Thu', 'friday': 'Fri',
    'mon': 'Mon', 'tue': 'Tue', 'wed': 'Wed', 'thu': 'Thu', 'fri': 'Fri'
  };

  for (const [key, value] of Object.entries(weekdayMap)) {
    if (text.includes(key)) {
      weekday = value;
      break;
    }
  }

  // Map why phrases
  const whyMap: { [key in SceneData['nextEvent']['type']]: string } = {
    'CPI': 'checks price pressures',
    'Fed meeting': 'sets tone on interest rates',
    'Jobs report': 'signals how hot the economy is',
    '10-yr auction': 'shows demand for government bonds',
    'Tariff update': 'affects costs and global trade'
  };

  return {
    type,
    weekday,
    why: whyMap[type]
  };
}

function getDefaultSceneData(): SceneData {
  return {
    marketTrend: 'flat',
    sentiment: 'neutral',
    rates: 'steady',
    fear: 'normal',
    nextEvent: {
      type: 'CPI',
      weekday: 'Thu',
      why: 'checks price pressures'
    },
    sources: [],
    attribution: 'auto summary (defaults)'
  };
}
