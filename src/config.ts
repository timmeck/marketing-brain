import path from 'node:path';
import fs from 'node:fs';
import type { MarketingBrainConfig } from './types/config.types.js';
import { getDataDir, getPipeName } from './utils/paths.js';

const defaults: MarketingBrainConfig = {
  dataDir: getDataDir(),
  dbPath: path.join(getDataDir(), 'marketing-brain.db'),
  ipc: {
    pipeName: getPipeName(),
    timeout: 5000,
  },
  api: {
    port: 7780,
    enabled: true,
  },
  mcpHttp: {
    port: 7781,
    enabled: true,
  },
  learning: {
    intervalMs: 900_000, // 15 min
    minOccurrences: 3,
    minConfidence: 0.60,
    pruneThreshold: 0.20,
    decayHalfLifeDays: 30,
  },
  matching: {
    similarityThreshold: 0.8,
    maxResults: 10,
  },
  synapses: {
    initialWeight: 0.1,
    learningRate: 0.15,
    decayHalfLifeDays: 45,
    pruneThreshold: 0.05,
    decayAfterDays: 14,
    maxDepth: 3,
    minActivationWeight: 0.2,
  },
  research: {
    intervalMs: 3_600_000, // 1 hour
    initialDelayMs: 300_000, // 5 min
    minDataPoints: 5,
    trendWindowDays: 7,
    insightExpiryDays: 30,
  },
  log: {
    level: 'info',
    file: path.join(getDataDir(), 'marketing-brain.log'),
    maxSize: 10 * 1024 * 1024,
    maxFiles: 3,
  },
  retention: {
    postDays: 365,
    strategyDays: 365,
    insightDays: 30,
  },
};

function applyEnvOverrides(config: MarketingBrainConfig): void {
  if (process.env['MARKETING_BRAIN_DATA_DIR']) {
    config.dataDir = process.env['MARKETING_BRAIN_DATA_DIR'];
    config.dbPath = path.join(config.dataDir, 'marketing-brain.db');
    config.log.file = path.join(config.dataDir, 'marketing-brain.log');
  }
  if (process.env['MARKETING_BRAIN_DB_PATH']) config.dbPath = process.env['MARKETING_BRAIN_DB_PATH'];
  if (process.env['MARKETING_BRAIN_LOG_LEVEL']) config.log.level = process.env['MARKETING_BRAIN_LOG_LEVEL'];
  if (process.env['MARKETING_BRAIN_PIPE_NAME']) config.ipc.pipeName = process.env['MARKETING_BRAIN_PIPE_NAME'];
  if (process.env['MARKETING_BRAIN_API_PORT']) config.api.port = Number(process.env['MARKETING_BRAIN_API_PORT']);
  if (process.env['MARKETING_BRAIN_API_KEY']) config.api.apiKey = process.env['MARKETING_BRAIN_API_KEY'];
}

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): void {
  for (const key of Object.keys(source)) {
    const val = source[key];
    if (val && typeof val === 'object' && !Array.isArray(val) && target[key] && typeof target[key] === 'object') {
      deepMerge(target[key] as Record<string, unknown>, val as Record<string, unknown>);
    } else if (val !== undefined) {
      target[key] = val;
    }
  }
}

export function loadConfig(configPath?: string): MarketingBrainConfig {
  const config = structuredClone(defaults);

  if (configPath) {
    const filePath = path.resolve(configPath);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const fileConfig = JSON.parse(raw) as Partial<MarketingBrainConfig>;
      deepMerge(config as unknown as Record<string, unknown>, fileConfig as unknown as Record<string, unknown>);
    }
  } else {
    const defaultConfigPath = path.join(getDataDir(), 'config.json');
    if (fs.existsSync(defaultConfigPath)) {
      const raw = fs.readFileSync(defaultConfigPath, 'utf-8');
      const fileConfig = JSON.parse(raw) as Partial<MarketingBrainConfig>;
      deepMerge(config as unknown as Record<string, unknown>, fileConfig as unknown as Record<string, unknown>);
    }
  }

  applyEnvOverrides(config);
  return config;
}
