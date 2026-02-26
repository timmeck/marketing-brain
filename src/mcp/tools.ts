import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { IpcClient } from '../ipc/client.js';

export function registerTools(server: McpServer, ipc: IpcClient): void {

  // 1. post.draft — Check a post draft against rules
  server.tool(
    'marketing_post_draft',
    'Check a post draft against learned marketing rules before publishing. Returns violations and recommendations.',
    {
      content: z.string().describe('The post content/text to check'),
      platform: z.string().describe('Target platform (x, reddit, linkedin, bluesky)'),
    },
    async ({ content, platform }) => {
      const result = await ipc.request('rule.check', { content, platform });
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    },
  );

  // 2. post.report — Report a published post
  server.tool(
    'marketing_post_report',
    'Report a published post to track in the marketing brain. Stores content, platform, format, and creates synapse connections.',
    {
      platform: z.string().describe('Platform (x, reddit, linkedin, bluesky)'),
      content: z.string().describe('Post content/text'),
      format: z.string().optional().describe('Post format (text, image, video, thread, article)'),
      url: z.string().optional().describe('Post URL'),
      hashtags: z.string().optional().describe('Hashtags (comma-separated)'),
      campaign: z.string().optional().describe('Campaign name (creates if not exists)'),
    },
    async ({ platform, content, format, url, hashtags, campaign }) => {
      let campaignId: number | null = null;
      if (campaign) {
        const camp = await ipc.request('campaign.create', { name: campaign }) as { id: number };
        campaignId = camp.id;
      }
      const result = await ipc.request('post.report', {
        platform, content, format: format ?? 'text',
        url, hashtags, campaign_id: campaignId,
        status: 'published', published_at: new Date().toISOString(),
      });
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    },
  );

  // 3. post.engagement — Update engagement metrics
  server.tool(
    'marketing_post_engagement',
    'Update engagement metrics for a tracked post. Provide post ID and current metrics.',
    {
      post_id: z.number().describe('Post ID'),
      likes: z.number().optional().describe('Current likes count'),
      comments: z.number().optional().describe('Current comments count'),
      shares: z.number().optional().describe('Current shares/retweets count'),
      impressions: z.number().optional().describe('Current impressions count'),
      clicks: z.number().optional().describe('Current clicks count'),
      saves: z.number().optional().describe('Current saves/bookmarks count'),
      reach: z.number().optional().describe('Current reach count'),
    },
    async (params) => {
      const result = await ipc.request('post.engagement', params);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    },
  );

  // 4. post.similar — Find similar posts
  server.tool(
    'marketing_post_similar',
    'Find posts similar to a given post using synapse network spreading activation.',
    {
      post_id: z.number().describe('Post ID to find similar posts for'),
    },
    async ({ post_id }) => {
      const result = await ipc.request('post.similar', { id: post_id });
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    },
  );

  // 5. campaign.create — Create a new campaign
  server.tool(
    'marketing_campaign_create',
    'Create a new marketing campaign to group and track related posts.',
    {
      name: z.string().describe('Campaign name'),
      brand: z.string().optional().describe('Brand name (e.g., REPOSIGNAL, Brain)'),
      goal: z.string().optional().describe('Campaign goal'),
      platform: z.string().optional().describe('Primary platform'),
    },
    async (params) => {
      const result = await ipc.request('campaign.create', params);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    },
  );

  // 6. campaign.stats — Campaign performance
  server.tool(
    'marketing_campaign_stats',
    'Get performance statistics for a campaign including total engagement and post count.',
    {
      campaign_id: z.number().describe('Campaign ID'),
    },
    async ({ campaign_id }) => {
      const result = await ipc.request('campaign.stats', { id: campaign_id });
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    },
  );

  // 7. strategy.report — Report a successful strategy
  server.tool(
    'marketing_strategy_report',
    'Report a marketing strategy that worked. The brain will learn from it and suggest similar strategies later.',
    {
      description: z.string().describe('Strategy description'),
      approach: z.string().optional().describe('Approach taken'),
      outcome: z.string().optional().describe('Outcome/result'),
      post_id: z.number().optional().describe('Related post ID'),
    },
    async (params) => {
      const result = await ipc.request('strategy.report', params);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    },
  );

  // 8. strategy.suggest — Get strategy suggestions
  server.tool(
    'marketing_strategy_suggest',
    'Get strategy suggestions based on a topic or context. Searches past successful strategies.',
    {
      query: z.string().describe('Topic or context to search for'),
      limit: z.number().optional().describe('Max results (default: 5)'),
    },
    async ({ query, limit }) => {
      const result = await ipc.request('strategy.suggest', { query, limit: limit ?? 5 });
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    },
  );

  // 9. template.find — Find content templates
  server.tool(
    'marketing_template_find',
    'Find reusable content templates that match a query or platform.',
    {
      query: z.string().optional().describe('Search query'),
      platform: z.string().optional().describe('Filter by platform'),
      limit: z.number().optional().describe('Max results'),
    },
    async ({ query, platform, limit }) => {
      let result;
      if (platform) {
        result = await ipc.request('template.byPlatform', { platform, limit: limit ?? 10 });
      } else {
        result = await ipc.request('template.find', { query: query ?? '', limit: limit ?? 10 });
      }
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    },
  );

  // 10. rule.check — Check draft against rules
  server.tool(
    'marketing_rule_check',
    'Check a post draft against all learned marketing rules. Returns violations and recommendations.',
    {
      content: z.string().describe('Post content to check'),
      platform: z.string().describe('Target platform'),
    },
    async ({ content, platform }) => {
      const result = await ipc.request('rule.check', { content, platform });
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    },
  );

  // 11. insight.list — List current insights
  server.tool(
    'marketing_insight_list',
    'Get current active marketing insights (trends, gaps, synergies, optimizations).',
    {
      type: z.string().optional().describe('Filter by type: trend, gap, synergy, template, optimization'),
      limit: z.number().optional().describe('Max results'),
    },
    async ({ type, limit }) => {
      let result;
      if (type) {
        result = await ipc.request('insight.byType', { type, limit: limit ?? 20 });
      } else {
        result = await ipc.request('insight.list', { limit: limit ?? 20 });
      }
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    },
  );

  // 12. analytics.summary — Overall analytics
  server.tool(
    'marketing_analytics_summary',
    'Get a complete analytics summary: posts, campaigns, strategies, rules, insights, and network stats.',
    {},
    async () => {
      const result = await ipc.request('analytics.summary', {});
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    },
  );

  // 13. analytics.bestOf — Top performing content
  server.tool(
    'marketing_analytics_best',
    'Get top performing posts, best strategies, and platform-level engagement stats.',
    {
      limit: z.number().optional().describe('Max results per category'),
    },
    async ({ limit }) => {
      const result = await ipc.request('analytics.top', { limit: limit ?? 10 });
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    },
  );
}
