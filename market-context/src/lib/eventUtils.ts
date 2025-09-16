import { EventType, ImpactTag, EVENT_SCOPE, DIRECT_EVENT_TYPES, INDIRECT_EVENT_TYPES } from '@/types/company';

/**
 * Utility functions for event categorization and validation
 */

export function isDirectEventType(eventType: EventType): boolean {
  return DIRECT_EVENT_TYPES.includes(eventType as any);
}

export function isIndirectEventType(eventType: EventType): boolean {
  return INDIRECT_EVENT_TYPES.includes(eventType as any);
}

export function getEventScope(eventType: EventType): 'DIRECT' | 'INDIRECT' {
  return isDirectEventType(eventType) ? 'DIRECT' : 'INDIRECT';
}

export function getRecommendedTags(eventType: EventType): ImpactTag[] {
  const scope = getEventScope(eventType);
  
  if (scope === 'DIRECT') {
    switch (eventType) {
      case 'Earnings':
        return EVENT_SCOPE.DIRECT.EARNINGS.tags;
      case 'Product':
        return EVENT_SCOPE.DIRECT.PRODUCT.tags;
      case 'Conference':
        return EVENT_SCOPE.DIRECT.CONFERENCE.tags;
      case 'Legal/Reg':
        return EVENT_SCOPE.DIRECT.LEGAL_REG.tags;
      case 'Partnership':
        return EVENT_SCOPE.DIRECT.PARTNERSHIP.tags;
      default:
        return ['Tech', 'AI', 'Semis'];
    }
  } else {
    switch (eventType) {
      case 'FOMC':
        return EVENT_SCOPE.INDIRECT.FOMC.tags;
      case 'Treasury Auction':
        return EVENT_SCOPE.INDIRECT.TREASURY.tags;
      case 'Tariff':
        return EVENT_SCOPE.INDIRECT.TARIFF.tags;
      case 'Competitor':
        return EVENT_SCOPE.INDIRECT.COMPETITOR.tags;
      case 'MacroPrint':
        return EVENT_SCOPE.INDIRECT.MACRO.tags;
      default:
        return ['Broad Market'];
    }
  }
}

export function validateEventTags(eventType: EventType, tags: ImpactTag[]): {
  isValid: boolean;
  recommended: ImpactTag[];
  missing: ImpactTag[];
  extra: ImpactTag[];
} {
  const recommended = getRecommendedTags(eventType);
  const missing = recommended.filter(tag => !tags.includes(tag));
  const extra = tags.filter(tag => !recommended.includes(tag));
  
  return {
    isValid: missing.length === 0,
    recommended,
    missing,
    extra
  };
}

export function getEventDescription(eventType: EventType): string {
  const scope = getEventScope(eventType);
  
  if (scope === 'DIRECT') {
    switch (eventType) {
      case 'Earnings':
        return EVENT_SCOPE.DIRECT.EARNINGS.description;
      case 'Product':
        return EVENT_SCOPE.DIRECT.PRODUCT.description;
      case 'Conference':
        return EVENT_SCOPE.DIRECT.CONFERENCE.description;
      case 'Legal/Reg':
        return EVENT_SCOPE.DIRECT.LEGAL_REG.description;
      case 'Partnership':
        return EVENT_SCOPE.DIRECT.PARTNERSHIP.description;
      default:
        return 'Direct company event';
    }
  } else {
    switch (eventType) {
      case 'FOMC':
        return EVENT_SCOPE.INDIRECT.FOMC.description;
      case 'Treasury Auction':
        return EVENT_SCOPE.INDIRECT.TREASURY.description;
      case 'Tariff':
        return EVENT_SCOPE.INDIRECT.TARIFF.description;
      case 'Competitor':
        return EVENT_SCOPE.INDIRECT.COMPETITOR.description;
      case 'MacroPrint':
        return EVENT_SCOPE.INDIRECT.MACRO.description;
      default:
        return 'Indirect market event';
    }
  }
}

export function categorizeEventBySource(source: string): 'AUTO_UPDATABLE' | 'MANUAL' | 'SEED' | 'UNKNOWN' {
  const autoUpdatableSources = ['IR', 'FOMC', 'Treasury', 'USTR', 'BIS', 'BLS', 'SEC'];
  
  if (autoUpdatableSources.includes(source)) {
    return 'AUTO_UPDATABLE';
  } else if (source === 'Manual') {
    return 'MANUAL';
  } else if (source === 'Seed') {
    return 'SEED';
  } else {
    return 'UNKNOWN';
  }
}
