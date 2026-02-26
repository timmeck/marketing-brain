import { EventEmitter } from 'node:events';

export interface MarketingEvents {
  'post:created': { postId: number; campaignId: number | null; platform: string };
  'post:published': { postId: number; platform: string };
  'engagement:updated': { postId: number; engagementId: number };
  'strategy:reported': { strategyId: number; postId: number };
  'rule:learned': { ruleId: number; pattern: string };
  'rule:triggered': { ruleId: number; postId: number };
  'template:created': { templateId: number; platform: string };
  'campaign:created': { campaignId: number; name: string };
  'insight:created': { insightId: number; type: string };
  'synapse:created': { synapseId: number; sourceType: string; targetType: string };
  'synapse:strengthened': { synapseId: number; newWeight: number };
}

export type MarketingEventName = keyof MarketingEvents;

export class TypedEventBus extends EventEmitter {
  emit<K extends MarketingEventName>(event: K, data: MarketingEvents[K]): boolean {
    return super.emit(event, data);
  }

  on<K extends MarketingEventName>(event: K, listener: (data: MarketingEvents[K]) => void): this {
    return super.on(event, listener);
  }

  once<K extends MarketingEventName>(event: K, listener: (data: MarketingEvents[K]) => void): this {
    return super.once(event, listener);
  }

  off<K extends MarketingEventName>(event: K, listener: (data: MarketingEvents[K]) => void): this {
    return super.off(event, listener);
  }
}

let busInstance: TypedEventBus | null = null;

export function getEventBus(): TypedEventBus {
  if (!busInstance) {
    busInstance = new TypedEventBus();
  }
  return busInstance;
}
