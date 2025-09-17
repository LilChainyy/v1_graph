/**
 * Event deduplication utilities
 * 
 * Uniqueness key: (tickerId, startDateTimeUTC, category, normalizedTitle)
 * normalizedTitle = lowercase, trimmed, collapse multiple spaces, strip symbols like parentheses/labels if already covered by category
 */

/**
 * Normalizes a title for deduplication purposes
 * - Converts to lowercase
 * - Trims whitespace
 * - Collapses multiple spaces into single space
 * - Strips common symbols that are already covered by category
 */
export function normalizeTitle(title: string, category: string): string {
  if (!title || typeof title !== 'string') {
    return '';
  }

  let normalized = title
    .toLowerCase()
    .trim()
    // Collapse multiple spaces into single space
    .replace(/\s+/g, ' ')
    // Remove common symbols that are redundant with category
    .replace(/[()[\]{}]/g, '')
    .replace(/[.,;:!?]/g, '')
    // Remove common prefixes/suffixes that are category-specific
    .replace(/^(earnings|q[1-4]|quarterly|annual)\s+/i, '')
    .replace(/\s+(call|conference|webcast|release)$/i, '')
    .replace(/^(fomc|federal\s+reserve)\s+/i, '')
    .replace(/^(cpi|consumer\s+price\s+index)\s+/i, '')
    .replace(/^(jobs|employment|nonfarm\s+payrolls)\s+/i, '')
    .replace(/^(gdp|gross\s+domestic\s+product)\s+/i, '')
    .replace(/^(sec|filing|10-k|10-q|8-k)\s+/i, '')
    .replace(/^(regulatory|compliance|deadline)\s+/i, '')
    // Remove year references that might cause duplicates
    .replace(/\s+(20\d{2}|q[1-4]\s+20\d{2})/g, '')
    // Remove time references
    .replace(/\s+(am|pm|et|pt|utc|est|pst)/g, '')
    .replace(/\s+\d{1,2}:\d{2}/g, '')
    // Final cleanup
    .trim();

  return normalized;
}

/**
 * Creates a unique key for event deduplication
 */
export function createEventUniqueKey(
  tickerId: string | null,
  start: string,
  category: string,
  title: string
): string {
  const normalizedTitle = normalizeTitle(title, category);
  return `${tickerId || 'GLOBAL'}|${start}|${category}|${normalizedTitle}`;
}

/**
 * Groups events by their unique key and returns the latest version of each
 */
export function deduplicateEvents<T extends { 
  id: string; 
  tickerId: string | null; 
  start: string; 
  category: string; 
  title: string; 
  updatedAt: string | Date;
}>(
  events: T[]
): T[] {
  const grouped = new Map<string, T[]>();
  
  // Group events by unique key
  events.forEach(event => {
    const key = createEventUniqueKey(
      event.tickerId,
      event.start,
      event.category,
      event.title
    );
    
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(event);
  });
  
  // For each group, keep only the latest event (by updatedAt)
  const deduplicated: T[] = [];
  
  grouped.forEach(group => {
    if (group.length === 1) {
      deduplicated.push(group[0]);
    } else {
      // Sort by updatedAt descending and take the first (latest)
      const sorted = group.sort((a, b) => {
        const dateA = new Date(a.updatedAt).getTime();
        const dateB = new Date(b.updatedAt).getTime();
        return dateB - dateA;
      });
      deduplicated.push(sorted[0]);
    }
  });
  
  return deduplicated;
}

/**
 * Creates upsert data for Prisma with normalized title
 */
export function createUpsertEventData(data: {
  id?: string;
  tickerId?: string | null;
  title: string;
  start: string;
  end?: string;
  category: string;
  timezone?: string;
  source: string;
  links?: string[];
  notes?: string;
  externalId?: string;
}) {
  const normalizedTitle = normalizeTitle(data.title, data.category);
  
  return {
    ...data,
    normalizedTitle,
    links: data.links ? JSON.stringify(data.links) : null,
    timezone: data.timezone || 'UTC',
  };
}
