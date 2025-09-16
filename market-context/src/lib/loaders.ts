/**
 * Data loaders for the application
 */

export interface RecentlyAddedEvent {
  id: string;
  title: string;
  date: string;
  source?: string;
  createdAt?: string;
}

export async function loadRecentlyAddedNVDA(): Promise<RecentlyAddedEvent[]> {
  try {
    const res = await fetch("/data/company/nvda_events_added_latest.json", { 
      cache: "no-store" 
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.warn("Failed to load recently added NVDA events:", error);
    return [];
  }
}
