interface UsageRecord {
  ip: string;
  totalTokens: number;
  estimatedCost: number;
  requestCount: number;
  lastUsed: Date;
  blocked: boolean;
}

interface ApiUsage {
  inputTokens: number;
  outputTokens: number;
}

// Claude pricing (as of 2024)
const CLAUDE_PRICING = {
  INPUT_TOKENS_PER_DOLLAR: 1000000 / 3,  // $3 per 1M input tokens
  OUTPUT_TOKENS_PER_DOLLAR: 1000000 / 15, // $15 per 1M output tokens
};

const USAGE_LIMIT_DOLLARS = 1.0;
const USAGE_FILE_KEY = 'scout_chat_usage';

export class UsageTracker {
  private static getUsageData(): Map<string, UsageRecord> {
    if (typeof window === 'undefined') return new Map();
    
    const stored = localStorage.getItem(USAGE_FILE_KEY);
    if (!stored) return new Map();
    
    try {
      const data = JSON.parse(stored);
      const usageMap = new Map<string, UsageRecord>();
      
      for (const [ip, record] of Object.entries(data)) {
        usageMap.set(ip, {
          ...record as UsageRecord,
          lastUsed: new Date((record as UsageRecord).lastUsed)
        });
      }
      
      return usageMap;
    } catch {
      return new Map();
    }
  }

  private static saveUsageData(usageMap: Map<string, UsageRecord>): void {
    if (typeof window === 'undefined') return;
    
    const data: Record<string, UsageRecord> = {};
    for (const [ip, record] of usageMap.entries()) {
      data[ip] = record;
    }
    
    localStorage.setItem(USAGE_FILE_KEY, JSON.stringify(data));
  }

  static getClientIP(): string {
    // For client-side, we'll use a combination of factors as a proxy for IP
    // This is not perfect but works for basic rate limiting
    const userAgent = navigator.userAgent;
    const screen = `${window.screen.width}x${window.screen.height}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    return btoa(`${userAgent}_${screen}_${timezone}`).substr(0, 32);
  }

  static calculateCost(usage: ApiUsage): number {
    const inputCost = usage.inputTokens / CLAUDE_PRICING.INPUT_TOKENS_PER_DOLLAR;
    const outputCost = usage.outputTokens / CLAUDE_PRICING.OUTPUT_TOKENS_PER_DOLLAR;
    return inputCost + outputCost;
  }

  static estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token for Claude
    return Math.ceil(text.length / 4);
  }

  static checkUsageLimit(ip: string): { allowed: boolean; usage: UsageRecord | null } {
    const usageMap = this.getUsageData();
    const record = usageMap.get(ip);
    
    if (!record) {
      return { allowed: true, usage: null };
    }

    // Reset usage if it's been more than 24 hours
    const now = new Date();
    const lastUsed = new Date(record.lastUsed);
    const hoursSinceLastUse = (now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceLastUse > 24) {
      // Reset usage after 24 hours
      const resetRecord: UsageRecord = {
        ...record,
        totalTokens: 0,
        estimatedCost: 0,
        requestCount: 0,
        lastUsed: now,
        blocked: false
      };
      usageMap.set(ip, resetRecord);
      this.saveUsageData(usageMap);
      return { allowed: true, usage: resetRecord };
    }

    const isBlocked = record.blocked || record.estimatedCost >= USAGE_LIMIT_DOLLARS;
    
    return { 
      allowed: !isBlocked, 
      usage: record 
    };
  }

  static recordUsage(ip: string, inputTokens: number, outputTokens: number): UsageRecord {
    const usageMap = this.getUsageData();
    const currentRecord = usageMap.get(ip);
    
    const additionalCost = this.calculateCost({ inputTokens, outputTokens });
    const totalTokens = (currentRecord?.totalTokens || 0) + inputTokens + outputTokens;
    const totalCost = (currentRecord?.estimatedCost || 0) + additionalCost;
    
    const record: UsageRecord = {
      ip,
      totalTokens,
      estimatedCost: totalCost,
      requestCount: (currentRecord?.requestCount || 0) + 1,
      lastUsed: new Date(),
      blocked: totalCost >= USAGE_LIMIT_DOLLARS
    };
    
    usageMap.set(ip, record);
    this.saveUsageData(usageMap);
    
    return record;
  }

  static getUsageSummary(ip: string): {
    used: number;
    remaining: number;
    percentage: number;
    requestCount: number;
  } {
    const usageMap = this.getUsageData();
    const record = usageMap.get(ip);
    
    if (!record) {
      return {
        used: 0,
        remaining: USAGE_LIMIT_DOLLARS,
        percentage: 0,
        requestCount: 0
      };
    }
    
    const used = record.estimatedCost;
    const remaining = Math.max(0, USAGE_LIMIT_DOLLARS - used);
    const percentage = Math.min(100, (used / USAGE_LIMIT_DOLLARS) * 100);
    
    return {
      used,
      remaining,
      percentage,
      requestCount: record.requestCount
    };
  }
} 