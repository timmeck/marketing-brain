import chalk from 'chalk';

export const c = {
  blue: chalk.hex('#5b9cff'),
  purple: chalk.hex('#b47aff'),
  cyan: chalk.hex('#47e5ff'),
  green: chalk.hex('#3dffa0'),
  red: chalk.hex('#ff5577'),
  orange: chalk.hex('#ffb347'),
  dim: chalk.hex('#8b8fb0'),
  dimmer: chalk.hex('#4a4d6e'),

  label: chalk.hex('#8b8fb0'),
  value: chalk.white.bold,
  heading: chalk.hex('#5b9cff').bold,
  success: chalk.hex('#3dffa0').bold,
  error: chalk.hex('#ff5577').bold,
  warn: chalk.hex('#ffb347').bold,
  info: chalk.hex('#47e5ff'),
};

export const icons = {
  megaphone: '📣',
  check: '✓',
  cross: '✗',
  arrow: '→',
  dot: '●',
  bar: '█',
  barLight: '░',
  dash: '─',
  star: '★',
  bolt: '⚡',
  chart: '📊',
  post: '📝',
  campaign: '🎯',
  synapse: '🔗',
  insight: '💡',
  rule: '📏',
  template: '📋',
  warn: '⚠',
  error: '❌',
  ok: '✅',
  clock: '⏱',
};

export function header(title: string, icon?: string): string {
  const prefix = icon ? `${icon}  ` : '';
  const line = c.dimmer(icons.dash.repeat(40));
  return `\n${line}\n${prefix}${c.heading(title)}\n${line}`;
}

export function keyValue(key: string, value: string | number, indent = 2): string {
  const pad = ' '.repeat(indent);
  return `${pad}${c.label(key + ':')} ${c.value(String(value))}`;
}

export function divider(width = 40): string {
  return c.dimmer(icons.dash.repeat(width));
}
