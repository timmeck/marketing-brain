# Marketing Brain

**Self-Learning Marketing Intelligence System for Claude Code**

Marketing Brain is an MCP server that gives Claude Code a persistent marketing memory. It tracks every post you publish, learns what works across platforms, and builds a Hebbian synapse network connecting posts, campaigns, strategies, templates, and insights. Over time, it learns your best-performing patterns and proactively suggests what to post, when, and where.

## Why Marketing Brain?

Without Marketing Brain, your marketing knowledge lives in your head. With it:

- **Posts are tracked** — Every post on X, Reddit, LinkedIn, Bluesky is stored with engagement metrics
- **Patterns emerge** — The learning engine finds your best posting times, formats, and platforms automatically
- **Strategies compound** — Successful strategies are recorded and suggested for similar future contexts
- **Rules are learned** — "Posts at 15:00 CET perform 2x better" — discovered and enforced automatically
- **Templates are extracted** — High-performing post structures become reusable templates
- **Gaps are detected** — "You never post on LinkedIn — potential?" — the research engine spots blind spots
- **Campaigns are connected** — Cross-promotion synergies between brands surface through the synapse network
- **Knowledge persists** — Every session builds on everything before it

## Features

### Core Intelligence
- **Post Tracking** — Store posts with platform, format, hashtags, URL, and full engagement history
- **Campaign Management** — Group posts into campaigns, track aggregate performance
- **Hebbian Synapse Network** — Weighted graph connecting posts, campaigns, strategies, templates, rules, audiences, and insights
- **Spreading Activation** — Explore related content by activating nodes in the network
- **Full-Text Search** — FTS5 indexes on posts, strategies, and templates

### Learning Engine (runs every 15 min)
- **Timing Patterns** — Discovers best/worst posting hours from engagement data
- **Format Patterns** — Finds which formats (text, image, video, thread) perform best
- **Platform Patterns** — Identifies your top-performing platform with Wilson Score confidence
- **Strategy Confidence** — Updates strategy scores based on real engagement
- **Rule Confidence** — Prunes low-confidence rules, promotes high-confidence ones
- **Similar Post Wiring** — Automatically connects similar posts in the synapse network

### Research Engine (runs every hour)
- **Trend Detection** — "Engagement on X is up 30% this week"
- **Gap Analysis** — "You haven't posted on LinkedIn yet — consider expanding"
- **Synergy Detection** — "Video + Monday = your best combo on Reddit"
- **Template Suggestions** — "Post #42 has high engagement — extract as template"
- **Optimization Ideas** — "Cross-post your top tweet as a LinkedIn article"

### MCP Tools (13 tools for Claude Code)
- **Draft Checking** — Check a post against learned rules before publishing
- **Post Reporting** — Track published posts with one command
- **Engagement Updates** — Feed in likes, shares, impressions as they come
- **Strategy Memory** — Report what worked, get suggestions for what's next
- **Template Library** — Find and reuse high-performing post structures
- **Analytics** — Full dashboard data accessible from Claude Code

## Quick Start

### Installation

```bash
git clone https://github.com/timmeck/marketing-brain.git
cd marketing-brain
npm install
npm run build
```

### Setup with Claude Code

Add to `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "marketing-brain": {
      "command": "npx",
      "args": ["tsx", "C:/path/to/marketing-brain/src/index.ts", "mcp-server"],
      "cwd": "C:/path/to/marketing-brain"
    }
  }
}
```

### Start the Daemon

```bash
marketing start
marketing status
marketing doctor    # verify everything works (5/5 green)
```

## CLI Commands

```
marketing start                  Start the daemon
marketing stop                   Stop the daemon
marketing status                 Show stats (posts, campaigns, synapses, insights)
marketing doctor                 Health check (daemon, DB, MCP, data dir)
marketing post <platform> [url]  Report a published post
marketing campaign create <name> Create a campaign
marketing campaign list          List all campaigns
marketing campaign stats <id>    Show campaign performance
marketing insights               Show current marketing insights
marketing rules                  Show learned marketing rules
marketing suggest <topic>        Get content suggestions for a topic
marketing dashboard              Full marketing dashboard
marketing import <file.json>     Bulk import posts from JSON
```

### Example Workflow

```bash
# Track a new post
marketing post x --content "Just shipped v2.0!" --campaign "Product Launch" --hashtags "#launch,#dev"

# Update engagement later
# (via MCP tool or API: marketing_post_engagement)

# See what the brain learned
marketing insights
marketing rules
marketing dashboard

# Get suggestions before your next post
marketing suggest "developer tools"
```

## MCP Tools

These tools are available to Claude Code when Marketing Brain is configured:

| Tool | Description |
|------|-------------|
| `marketing_post_draft` | Check a post draft against learned rules |
| `marketing_post_report` | Report a published post |
| `marketing_post_engagement` | Update engagement metrics (likes, shares, etc.) |
| `marketing_post_similar` | Find similar posts via synapse network |
| `marketing_campaign_create` | Create a new campaign |
| `marketing_campaign_stats` | Get campaign performance stats |
| `marketing_strategy_report` | Report a strategy that worked |
| `marketing_strategy_suggest` | Get strategy suggestions for a context |
| `marketing_template_find` | Find reusable content templates |
| `marketing_rule_check` | Check content against all learned rules |
| `marketing_insight_list` | Get active insights (trends, gaps, synergies) |
| `marketing_analytics_summary` | Full analytics overview |
| `marketing_analytics_best` | Top performing posts and strategies |

## REST API

Marketing Brain includes a REST API on port 7780 (default).

```bash
# Health check
curl http://localhost:7780/api/v1/health

# List all available methods
curl http://localhost:7780/api/v1/methods

# Call any method via RPC
curl -X POST http://localhost:7780/api/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{"method": "analytics.summary", "params": {}}'
```

## Architecture

```
+------------------+     +------------------+
|   Claude Code    |     |  Browser/CI/CD   |
|   (MCP stdio)    |     |  (REST API)      |
+--------+---------+     +--------+---------+
         |                        |
         v                        v
+--------+---------+     +--------+---------+
|   MCP Server     |     |    REST API      |
|   (stdio)        |     |   (port 7780)    |
+--------+---------+     +--------+---------+
         |                        |
         +----------+-------------+
                    |
                    v
         +----------+-----------+
         |    MarketingCore     |
         |  (Daemon / Services) |
         +----------+-----------+
                    |
    +-------+-------+--------+-------+
    |       |       |        |       |
    v       v       v        v       v
+---+--+ +--+---+ +-+-----+ +-+--+ +-+------+
|Post  | |Camp- | |Synapse| |Rule| |Template|
|Track | |aigns | |Network| |Eng.| |Library |
+---+--+ +--+---+ +-+-----+ +-+--+ +-+------+
    |       |       |        |       |
    v       v       v        v       v
+---+--+ +--+---+ +-+-----+ +-+--+ +-+------+
|Learn | |Strat-| |Hebbian| |Ins-| |Audience|
|Engine| |egies | |Learn  | |ight| |Segments|
+------+ +------+ +-------+ +----+ +--------+
                    |
                    v
         +----------+-----------+
         |     SQLite (DB)      |
         |  better-sqlite3      |
         +----------------------+
```

### Synapse Types

```
post → campaign        (belongs_to)
post → post            (similar_to)
post → audience        (engages_with)
strategy → post        (improves)
rule → post            (prevents / recommends)
template → post        (generated_from)
campaign → campaign    (cross_promotes)
insight → campaign     (informs)
```

## How It Learns

1. **Post Reported** — You publish a post and report it via CLI or MCP tool
2. **Engagement Tracked** — Likes, shares, impressions are updated over time
3. **Synapses Form** — Post ↔ Campaign, Post ↔ Post (similar), Strategy ↔ Post connections are created
4. **Patterns Extracted** — Learning engine finds timing, format, and platform patterns
5. **Rules Generated** — High-confidence patterns become rules with Wilson Score confidence
6. **Research Runs** — Trends, gaps, and synergies are surfaced as actionable insights
7. **Next Time** — When you draft a new post, Marketing Brain checks it against rules and suggests proven strategies

## Configuration

Configure via environment variables or `~/.marketing-brain/config.json`:

| Env Variable | Default | Description |
|---|---|---|
| `MARKETING_BRAIN_DATA_DIR` | `~/.marketing-brain` | Data directory |
| `MARKETING_BRAIN_LOG_LEVEL` | `info` | Log level |
| `MARKETING_BRAIN_API_PORT` | `7780` | REST API port |
| `MARKETING_BRAIN_API_KEY` | — | API authentication key |
| `MARKETING_BRAIN_DB_PATH` | `~/.marketing-brain/marketing-brain.db` | Database path |

## Tech Stack

- **TypeScript** — Full type safety, ES2022, ESM modules
- **better-sqlite3** — Embedded SQLite with WAL mode
- **MCP SDK** — Model Context Protocol integration (stdio transport)
- **Commander** — CLI framework
- **Chalk** — Colored terminal output
- **Winston** — Structured logging

## Related

- [Brain](https://github.com/timmeck/brain) — Adaptive error memory & code intelligence (same architecture, applied to debugging)

## License

[MIT](LICENSE)
