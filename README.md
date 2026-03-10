# Agentic OS

Your complete Agentic Operating System for your business. A skills-based
agent that learns your brand, remembers your context, and gets sharper
every time you use it.

Built for Claude Code. Designed for founders, solo marketers, and small
teams who need senior-level output without the senior-level headcount.

---

## Quick Start

```
/start-here
```

That is the only command you need to remember. The orchestrator scans your
project, asks a few questions, builds your brand foundation, and routes
you to the right skill for whatever you are working on.

---

## What You Get

### Foundation Skills

These run first. They build your brand memory so every skill that follows
writes like you, for your audience, with your angle.

| Skill | What it does |
|-------|-------------|
| `mkt-brand-voice` | Extracts or builds a voice profile so every piece of content sounds like you |
| `mkt-positioning` | Finds the market angle that makes your offer stand out and sell |
| `mkt-icp` | Maps your ideal customer — their pain, language, objections, and buying triggers |

### Meta Skills

| Skill | What it does |
|-------|-------------|
| `meta-skill-creator` | Build and validate new skills — extend the system for any domain |

New execution skills are added over time. The architecture supports
unlimited skills across any domain — marketing, operations, sales,
client onboarding, or anything else.

---

## How It Works

### Brand Memory

Every skill reads from `brand_context/` (brand data) and `context/`
(agent state, learnings, session logs). This is how the system remembers
who you are across sessions.

The first time you run `/start-here`, it creates your brand foundation:
- `brand_context/voice-profile.md` — How your brand sounds
- `brand_context/positioning.md` — Your market angle and differentiators
- `brand_context/icp.md` — Your ideal customer profile
- `brand_context/samples.md` — Gold-standard copy from real sources
- `context/learnings.md` — Performance feedback that makes future output sharper

Skills only load the brand files they need. Selective context keeps
output focused and specific.

### Learnings Loop

`context/learnings.md` is the system's long-term memory. After major
deliverables, skills ask for feedback. Responses are logged with domain
tags. Every skill reads relevant learnings before running — it's like a
CLAUDE.md for each individual skill. The more you use it, the better the
system gets at matching your preferences.

### Projects

Output is organised by type, not by skill. Each output type gets its own
folder inside `projects/` with a category prefix:

```
projects/
├── mkt-landing-page/        <- Landing pages and sales pages
├── mkt-email-sequence/      <- Email flows
├── mkt-blog-post/           <- SEO articles
├── mkt-linkedin-carousel/   <- LinkedIn carousels
└── ...                      <- Folders created on first use
```

Category prefixes: `mkt` (marketing), `str` (strategy), `ops` (operations),
`vid` (video/visual). New categories are added as the system grows.

### Schemas

Schemas validate structured data and live next to what they describe:

| What it validates | Where the schema lives |
|-------------------|----------------------|
| Brand context data | `brand_context/schemas/` |
| Output files | `projects/{folder}/00-schemas/` |

Not every output needs a schema. They are created when structured,
repeatable data contracts are useful for downstream automation.

---

## File Structure

```
agentic-os/
├── context/                           <- Agent, user, and session state
│   ├── SOUL.md                        <- Agent identity and behaviour
│   ├── USER.md                        <- Your preferences (built by /start-here)
│   ├── MEMORY.md                      <- Long-term business knowledge
│   ├── learnings.md                   <- Skill-specific performance feedback
│   └── memory/                        <- Daily session logs (YYYY-MM-DD.md)
│
├── .env                               <- API keys (gitignored)
│
├── .claude/
│   ├── settings.json                  <- Permissions and hooks
│   ├── commands/
│   │   └── start-here.md              <- The one command you need
│   └── skills/
│       ├── mkt-brand-voice/           <- Voice extraction and building
│       ├── mkt-positioning/           <- Market angle discovery
│       ├── mkt-icp/                   <- Ideal customer profiling
│       ├── meta-wrap-up/              <- End-of-session checklist
│       ├── meta-skill-creator/        <- Build new skills
│       └── ...                        <- New skills added over time
│
├── brand_context/                     <- Client brand data (version controlled)
│   ├── schemas/                       <- Data contracts for brand context
│   │   └── voice-profile.schema.json
│   ├── voice-profile.md
│   ├── positioning.md
│   ├── icp.md
│   └── samples.md
│
└── projects/                          <- Everything the system produces
    └── {category}-{output-type}/
        ├── 00-schemas/                <- Output-specific schemas (when needed)
        └── {name}_{YYYY-MM-DD}.md     <- Generated content
```

---

## Notifications

Agentic OS includes [CCNotify](https://github.com/dazuiba/CCNotify) for
desktop notifications. You get alerted when Claude finishes a task or
needs your input — no need to watch the terminal.

**What it does:**
- Desktop notification when a task completes
- Desktop notification when Claude needs your input
- Task duration tracking
- Click-to-jump to the VS Code project

**Setup:**

CCNotify is pre-configured in this project. To install on a fresh machine:

```bash
# 1. Install the notification dependency
brew install terminal-notifier

# 2. Set up the notify script
mkdir -p ~/.claude/ccnotify
cp ccnotify.py ~/.claude/ccnotify/ccnotify.py
chmod a+x ~/.claude/ccnotify/ccnotify.py

# 3. Verify it works
~/.claude/ccnotify/ccnotify.py   # Should output: ok
```

The hooks in `~/.claude/settings.json` handle the rest automatically.
Notifications fire on `UserPromptSubmit`, `Stop`, and `Notification`
events.

**Logs:** `~/.claude/ccnotify/ccnotify.log`

---

## Extending the System

Agentic OS is built to grow. The `meta-skill-creator` skill scaffolds new
skills that follow the system's architecture automatically.

Every skill is a self-contained folder:
```
.claude/skills/{category}-{skill-name}/
├── SKILL.md          <- Instructions (~200 lines max)
└── references/       <- Deep knowledge, one topic per file
```

Skills work at any context level:
- **No brand context** — standalone mode, solid generic output
- **Partial context** — uses what exists, defaults for the rest
- **Full context** — fully personalised to your brand

Brand context enhances. It never gates.

---

## FAQ

**How do I update my brand voice after it's set?**
Just talk about voice again. The skill detects the existing profile, shows
a summary, and offers targeted updates — adjust tone, update vocabulary,
add new samples, or full rebuild.

**How do I see my project status?**
Run `/start-here` at any time. It scans everything, shows what exists,
identifies gaps, and recommends the highest-impact next action.

**Can I edit the output files manually?**
Yes. Everything is human-readable markdown. Edit freely. Skills check for
existing files before overwriting and will show a diff before replacing
anything.

**Can I build skills for non-marketing work?**
Yes. The architecture is domain-agnostic. Use `meta-skill-creator` to build
skills for operations, sales, client onboarding, or anything else. The
category prefix system (`ops-`, `str-`, `vid-`) is already in place.

---

## System Requirements

**Required:**
- Claude Code (Claude's official CLI)
- macOS (for CCNotify desktop notifications)

**Optional:**
- API keys for connected tools added to `.env`
- Skills detect connected tools automatically and adapt

---

Built March 2026 by Simon Scrapes @ Agentic Academy
