import { Command } from 'commander';
import { withIpc } from '../ipc-helper.js';
import { c, icons, header, divider } from '../colors.js';

export function dashboardCommand(): Command {
  return new Command('dashboard')
    .description('Show marketing dashboard')
    .action(async () => {
      await withIpc(async (client) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = await client.request('analytics.dashboard', {});
        const s = data.summary;

        console.log(header('Marketing Brain Dashboard', icons.megaphone));
        console.log();

        // Overview
        console.log(`  ${icons.chart}  ${c.heading('Overview')}`);
        console.log(`     Posts: ${c.value(s.posts?.total ?? 0)} | Campaigns: ${c.value(s.campaigns?.total ?? 0)} | Templates: ${c.value(s.templates?.total ?? 0)}`);
        console.log(`     Strategies: ${c.value(s.strategies?.total ?? 0)} | Rules: ${c.green(s.rules?.active ?? 0)} active | Insights: ${c.value(s.insights?.active ?? 0)} active`);
        console.log(`     Synapses: ${c.value(s.network?.synapses ?? 0)} | Nodes: ${c.value(s.network?.nodes ?? 0)} | Avg Weight: ${c.value((s.network?.avgWeight ?? 0).toFixed(2))}`);
        console.log();

        // Platform breakdown
        if (s.posts?.byPlatform && Object.keys(s.posts.byPlatform).length > 0) {
          console.log(`  ${icons.post}  ${c.heading('Posts by Platform')}`);
          for (const [platform, count] of Object.entries(s.posts.byPlatform)) {
            console.log(`     ${platform}: ${c.value(count as number)}`);
          }
          console.log();
        }

        // Top posts
        if (data.topPerformers?.topPosts?.length > 0) {
          console.log(`  ${icons.star}  ${c.heading('Top Posts')}`);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          for (const post of data.topPerformers.topPosts.slice(0, 5) as any[]) {
            const score = post.likes + post.comments * 3 + post.shares * 5 + post.clicks * 2;
            const preview = (post.content ?? '').substring(0, 60);
            console.log(`     ${c.green(score.toString().padStart(5))} ${c.dim(post.platform)} ${preview}${preview.length >= 60 ? '...' : ''}`);
          }
          console.log();
        }

        // Recent insights
        if (data.recentInsights?.length > 0) {
          console.log(`  ${icons.insight}  ${c.heading('Recent Insights')}`);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          for (const insight of data.recentInsights as any[]) {
            console.log(`     ${c.orange(`[${insight.type}]`)} ${insight.title}`);
          }
          console.log();
        }

        console.log(divider());
      });
    });
}
