*Input this document into Claude Code to build the Growth OS. Use Anthropic's meta-skill-creator to scaffold skills. When building any skill, ask for reference skills to study first. Claude Code sets up the framework — the user provides domain expertise and examples.*

# Growth OS — Project Requirements

**Version:** 0.3 (Architecture)
**Author:** Simon (Agentic Academy)
**Platform:** Claude Code
**Audience:** Business owners, Academy students, agency founders with multiple clients

---

## 1. What This Is

A Claude Code project template that turns any client folder into an intelligent business assistant. It has an agent identity (soul), remembers the client's brand across sessions, and gets sharper over time through a feedback loop.

The system ships with a core set of growth marketing skills but is designed to expand into anything: content creation, video production, operations, client management, and beyond. Any skill that follows the pattern plugs straight in.

One command to start: `/start-here`. Everything else is a skill that triggers automatically or gets invoked by the orchestrator.

### Who It's For

- **Solo business owners** using Claude Code directly — one project folder, one brand
- **Academy students** learning to build for clients — clone the template per client
- **Agency founders** managing multiple brands — one folder per client, same skills pack everywhere

### The Multi-Client Model

No switching, no config flags. One project folder per client. The skills pack (engine) is identical everywhere. The brand context (memory) is unique per client. Open the client's folder, Claude knows that client.

---

## 2. Core Architecture

### Three Layers

| Layer | What it is | Lifecycle | Version controlled? |
|-------|-----------|-----------|-------------------|
| **Agent identity** | CLAUDE.md + context files (context/SOUL.md, context/USER.md, context/MEMORY.md) | Configured once per project. Defines who the agent is and how it behaves. | Yes |
| **Skills pack** | Commands + skills (SKILL.md + references/) | Grows over time. New skills added as needed. | Yes |
| **Brand context** | brand_context/ folder with voice, positioning, ICP, schemas | Generated per client by /start-here. Grows over time. | Yes — this is the client's brand, it should be tracked |

### Extensibility Principle

The architecture is skill-agnostic. A growth marketing skill, a thumbnail generator, a UGC creator, a screen recording tool, and a client onboarding workflow all follow the same pattern:

```
.claude/skills/{category}-{skill-name}/
├── SKILL.md          ← Methodology (~200 lines)
└── references/       ← Depth material (~200-300 lines each)
```

New skills plug in by:
1. Adding the folder to `.claude/skills/`
2. Registering in CLAUDE.md's skill registry
3. Declaring which brand_context/ files they read (if any) in the context matrix
4. That's it. /start-here auto-detects installed skills for its showcase.

### Progressive Disclosure (from Anthropic's official guide)

Skills use a three-level system to minimise context usage:

**Level 1 — YAML frontmatter (~100 words)**
Always loaded in Claude's system prompt. Trigger conditions, description, name. Just enough for Claude to decide if the skill is relevant.

**Level 2 — SKILL.md body (~200 lines max)**
Loaded when the skill is invoked. The full methodology. Points to references but doesn't include their content.

**Level 3 — references/ (~200-300 lines each)**
Additional files Claude loads on-demand when a specific step requires deeper detail. Modular, one topic per file.

The 200-line SKILL.md limit matters. It's how much context Claude can efficiently scan to decide what to load next.

---

## 3. Project File Structure

```
client-project/
│
├── CLAUDE.md                              ← Entry point. Loads context files, skill registry,
│                                             context matrix, output standards.
│
├── context/                               ← Agent, user, and session state
│   ├── SOUL.md                            ← Agent identity: personality, values, behaviour rules
│   ├── USER.md                            ← Client/user context: who the human is, preferences
│   ├── MEMORY.md                          ← Long-term business knowledge: facts, decisions, dates
│   ├── learnings.md                       ← Skill performance feedback (append-only)
│   └── memory/                            ← Daily session logs
│       └── YYYY-MM-DD.md
│
├── .env                                   ← API keys (gitignored — the ONLY thing gitignored)
│
├── .claude/
│   ├── settings.json                      ← Permissions
│   │
│   ├── commands/
│   │   └── start-here.md                  ← The ONLY command. Entry point + orchestrator.
│   │
│   └── skills/                            ← All skills live here. Extensible.
│       │
│       ├── mkt-brand-voice/               ← Foundation: voice extraction
│       │   ├── SKILL.md
│       │   └── references/
│       │
│       ├── mkt-positioning/               ← Foundation: market positioning
│       │   ├── SKILL.md
│       │   └── references/
│       │
│       ├── mkt-icp/                       ← Foundation: ideal customer profile
│       │   ├── SKILL.md
│       │   └── references/
│       │
│       ├── {category}-{skill-name}/       ← Same pattern, any domain
│       │   ├── SKILL.md
│       │   └── references/
│       │
│       └── ...                            ← Thumbnails, UGC, screen recording, etc.
│
├── brand_context/                         ← Client brand data. Version controlled.
│   ├── schemas/                           ← Schemas that validate brand_context data
│   │   └── voice-profile.schema.json      ← Voice data contract
│   ├── voice-profile.md                   ← Output of brand-voice skill
│   ├── positioning.md                     ← Output of positioning skill
│   ├── icp.md                             ← Output of icp skill
│   └── samples.md                         ← Gold-standard copy from real sources
│
└── projects/                              ← Everything execution skills produce
    └── {category}-{output-type}/          ← e.g., mkt-linkedin-carousel, str-keyword-plan
        ├── 00-schemas/                    ← Output-specific schemas (optional)
        └── {descriptive-name}_{date}.md   ← Generated content
```

### Why This Structure

- **Only one command: /start-here.** All other skills trigger automatically or through the orchestrator. Users don't need to know skill names.
- **Context files in context/.** SOUL.md, USER.md, MEMORY.md, learnings.md, and daily memory logs live in context/ — separate files, separate concerns, loaded at session start.
- **Skills in `.claude/skills/`.** Official Claude Code location. Each self-contained. Drop a new skill folder in and it's available.
- **brand_context/ is version controlled.** Client's brand memory. Tracked, diffed, backed up. Only .env is gitignored.

---

## 4. Agent Identity — Workspace Files

Inspired by OpenClaw's workspace architecture. Each file has a distinct role. Separate because they change at different rates and for different reasons.

### 4.1 CLAUDE.md — The Entry Point

The file Claude Code reads first. Bootstraps everything else.

**Contains:**
- Instructions to read context/SOUL.md, context/USER.md, and context/MEMORY.md at session start
- Skill registry: dynamically lists all installed skills and their triggers
- Context matrix: which brand_context/ files each skill reads (Section 6)
- Output standards: formatting rules, file naming, where to save
- Loading instructions for brand_context/

**Does NOT contain:** Personality, values, or identity. That's SOUL.md's job.

**Template structure:**

```markdown
# CLAUDE.md

## Heartbeat
Before doing anything else:
1. Read `context/SOUL.md` — this is who you are
2. Read `context/USER.md` — this is who you're helping
3. Read `context/MEMORY.md` — long-term business knowledge
4. Read `context/memory/{today}.md` — recent session context
5. Scan `brand_context/` — check what exists, flag stale files

## Skill Registry
[auto-populated list of installed skills + triggers]

## Context Matrix
[which brand_context/ files each skill reads]
[new skills declare their own context needs when added]

## Output Standards
[formatting, file naming, save locations]
```

### 4.2 SOUL.md — Agent Identity

Who the agent is. Personality, values, behaviour rules.

**Template structure:**

```markdown
# SOUL.md — Who You Are

You're not a chatbot. You're a growth and business assistant —
part marketing strategist, part creative director, part operator.
You work across whatever the business needs: marketing, content,
video, operations, client work, and more.

## Core Truths

**Be genuinely helpful, not performatively helpful.**
No "Great question!" or "I'd be happy to help!" — just help.

**Have opinions.**
When asked "should I do X or Y?", recommend with reasoning.
An assistant with no perspective is just a search engine with extra steps.

**Be resourceful before asking.**
Check brand_context/. Read the files. Search. Then ask if stuck.

**Anticipate needs.**
Flag things the user should know about. Think owner, not employee.
If you spot a gap or an opportunity, say so.

**Own mistakes.**
If wrong, say so and fix it. Don't hedge.

**Work across domains.**
You're not limited to marketing. If a skill exists for it,
use it. If no skill exists, use your best judgement and suggest
building one later.

## Boundaries
- Client data stays in this project
- Check brand_context/voice-profile.md before writing in the client's voice
- Never overwrite brand_context/ files without asking

## Continuity
Each session, you wake up fresh. These files ARE your memory.
Read them. Update them. context/learnings.md is long-term knowledge.
```

### 4.3 MEMORY.md — Long-Term Knowledge

Business context, decisions, and facts that matter across weeks and months. Updated by `/wrap-up` when session insights are worth persisting. Read at every session start.

**Template structure:**

```markdown
# MEMORY.md — Long-Term Knowledge

## Key Facts
## Decisions & Preferences
## Important Dates
## Strategic Notes
```

### 4.4 USER.md — Client/User Context

Who the human is. Populated during /start-here.

**Template structure:**

```markdown
# USER.md — Who You're Helping

## About
- Name: [filled during setup]
- Business: [filled during setup]
- Role: [founder / marketer / agency]

## Preferences
- Communication style: [direct / detailed / casual]
- Output format: [markdown / files / both]

## Notes
[Anything learned about working style or preferences]
```

### 4.5 How Workspace Files Map to OpenClaw

| Our file | OpenClaw equivalent | Purpose |
|----------|-------------------|---------|
| CLAUDE.md | AGENTS.md | Operational rules, routing, loading instructions |
| context/SOUL.md | SOUL.md | Personality, values, behaviour |
| context/USER.md | USER.md | Human context, preferences |
| context/MEMORY.md | MEMORY.md | Long-term business knowledge |
| context/memory/ | Daily logs | Session history |
| brand_context/ | Domain files | Client brand knowledge (accumulated) |
| context/learnings.md | MEMORY.md (long-term) | Skill-specific feedback loop |

---

## 5. Skill Creation Rules

Every skill follows the same structure. Use Anthropic's `meta-skill-creator` skill to scaffold, then apply these rules.

**Critical: when building a new skill, Claude Code asks the user for reference skills to learn from.** The user provides example skills that Claude Code studies before building. Claude Code's job is to set up the correct framework — not to guess at methodology.

### 5.1 Folder Naming

- **Format:** `{category}-{skill-name}` in kebab-case (e.g., `mkt-brand-voice` not `Brand Voice`)
- **Must match the `name` field** in YAML frontmatter
- **Category prefix required** — see Skill Categories in CLAUDE.md for valid prefixes
- **Cannot contain** "claude" or "anthropic" (reserved)

### 5.2 YAML Frontmatter (Level 1)

```yaml
---
name: skill-name-in-kebab-case
description: >
  [Event/situation that triggers this skill].
  Triggers on "[keyword 1]", "[keyword 2]", "[keyword 3]".
  [What the skill actually does].
  Does NOT trigger for [negative triggers].
---
```

- Include BOTH what the skill does AND when to use it
- Include specific trigger phrases AND negative triggers
- ~100 words max. Under 1024 characters
- No XML angle brackets (< >)

### 5.3 SKILL.md Body (Level 2)

```markdown
---
name: skill-name
description: >
  [frontmatter]
---

# Skill Name

## Outcome
[What "done" looks like. 2 sentences max.]

## Context Needs
[Which brand_context/ files this skill reads, if any.
This gets added to the context matrix in CLAUDE.md.]

## Instructions

### Step 1: [Name]
[What Claude does. Which reference to read. What input needed.]

### Step 2: [Name]
...

## Troubleshooting
[Edge cases, missing data, graceful fallbacks.]
```

- ~200 lines max. Offload detail to references/
- Imperative form: "Ask the user", "Read the reference file"
- Be specific, not vague
- Reference files explicitly with paths
- Human-in-the-loop at decision points only
- **Declare context needs** — which brand_context/ files this skill reads and at what depth

### 5.4 References (Level 3)

- ~200-300 lines each. One topic per file
- Loaded only when a step points to them
- Knowledge, not instructions
- Self-contained

### 5.5 Building New Skills — The Process

1. **Ask for reference skills.** "Do you have example skills I can learn from?"
2. **Study the references.** Read examples, identify patterns in structure, triggers, flow
3. **Scaffold.** Create folder, SKILL.md with frontmatter, empty references/
4. **Fill methodology.** Write instructions based on learned patterns
5. **Declare context needs.** Add a `## Context Needs` section listing which brand_context/ files this skill reads
6. **Define output schema (if applicable).** If the skill produces structured or repeatable output, create a JSON schema and reference it from SKILL.md. Brand context schemas go in `brand_context/schemas/`. Output schemas go in `projects/{folder}/00-schemas/`. The schema defines the data contract so downstream skills and automation can consume the output reliably.
7. **Register.** Add to CLAUDE.md skill registry and context matrix
8. **Validate.** Frontmatter < 1024 chars? SKILL.md < 200 lines? References self-contained? Context needs declared? Output schema created (if structured output)?

---

## 6. Context Matrix

Defined in CLAUDE.md. Which brand_context/ files each skill reads. Extensible — new skills declare their own needs when added.

### How It Works

Each skill declares its context needs in its SKILL.md (`## Context Needs`). These get aggregated into the context matrix in CLAUDE.md. When a new skill is added, its context needs are added to the matrix.

### Foundation Skills (write to brand_context/)

| Skill | voice-profile | positioning | icp | samples | learnings |
|-------|:---:|:---:|:---:|:---:|:---:|
| mkt-brand-voice | **writes** | summary | — | **writes** | relevant |
| mkt-positioning | — | **writes** | full | — | relevant |
| mkt-icp | — | summary | **writes** | — | relevant |

### Execution Skills (read from brand_context/)

| Skill | voice-profile | positioning | icp | samples | learnings |
|-------|:---:|:---:|:---:|:---:|:---:|
| direct-response-copy | full | angle only | full | yes | copy-related |
| seo-content | full | — | expertise level | yes | content-related |
| email-sequences | full | angle only | full | yes | email-related |
| lead-magnet | tone only | angle only | full | — | relevant |
| keyword-research | — | full | language section | — | — |
| content-atomizer | full | — | — | yes | social-related |

### Future Skills (examples of how they'd plug in)

| Skill | voice-profile | positioning | icp | samples | learnings |
|-------|:---:|:---:|:---:|:---:|:---:|
| thumbnail-creator | tone only | — | — | — | visual-related |
| ugc-generator | full | angle only | full | yes | content-related |
| screen-recording | — | — | — | — | — |
| client-proposal | full | full | full | yes | relevant |
| social-scheduler | tone only | — | icp interests | — | social-related |

The point: any skill declares what it needs. Some skills (like screen-recording) might need nothing from brand_context/ and that's fine. Others (like client-proposal) need everything. The matrix grows as skills are added.

### Matrix Key

| Value | Meaning |
|-------|---------|
| **writes** | Skill creates/owns this file |
| **full** | Load entire file |
| **summary** | 1-2 sentence extract |
| **angle only** | Just the chosen angle |
| **tone only** | Just tone + vocabulary section |
| **language section** | Just "words they use" section |
| **relevant** | Entries tagged to skill's domain |
| **—** | Don't load |

### Why This Matters

More context does not equal better output. Each skill gets exactly what it needs. A thumbnail skill doesn't need the full ICP — it just needs tone direction for text overlays. A keyword research skill doesn't need voice profile — it needs how customers describe their problems.

---

## 7. The /start-here Command

The only user-facing command. Adapts to whatever skills are installed.

### 7.1 Mode Detection

Does brand_context/ exist? No → first-run. Yes → returning.

### 7.2 First-Run Mode

**Step 1: Project scan.** Check brand_context/, .env, workspace files. Show empty state.

**Step 2: Core questions.**

| Question | Feeds |
|----------|-------|
| "What does your business do? One sentence." | positioning + ICP |
| "Who's your ideal customer?" | ICP |
| "What makes you different from alternatives?" | positioning |
| "How do you want to come across?" | voice profile |

**Step 3: URL extraction (optional).** Offer to web_fetch website, YouTube, socials for voice patterns. Extract 5-10 gold-standard sentences.

**Step 4: Local file scan (conditional).** Offer to scan existing .md/.txt/.docx files.

**Step 5: Build brand_context/.** Run foundation skill methodologies. Write all brand files.

**Step 6: Update USER.md.** Populate with client info from conversation.

**Step 7: Show results.** Actual voice/positioning/ICP excerpts, not just filenames.

**Step 8: Dynamic skill showcase.**

Scan `.claude/skills/` for all installed skills. Group them by category (read from each skill's frontmatter or infer from name). Present what's available, framed around the client's business.

This is NOT a hardcoded list. If only foundation skills are installed, show those. If 20 skills are installed, group and show all of them. The showcase adapts to whatever's in the skills folder.

End with a personalised recommendation based on business context.

### 7.3 Returning Mode

1. Run session checks per CLAUDE.md Session Start protocol
2. Brief status: "I know your brand. [summary]."
3. Route or recommend

### 7.4 Anti-Patterns

1. Never ask more than 4 questions before doing work
2. Never present a skill menu — recommend, don't ask
3. Never rebuild brand_context/ without asking
4. Never give generic recommendations
5. Never silently produce generic output when foundation is missing
6. Every skill works standalone
7. Opportunity framing, not guilt

---

## 8. brand_context/ File Specifications

Version controlled. The client's brand memory. Used by any skill that needs brand awareness.

### voice-profile.md
Tone, sentence style, vocabulary, POV, do/don't rules, signature patterns.

### positioning.md
One-line statement, offer, unique mechanism, enemy, proof points, awareness level, alternative angles.

### icp.md
Who, primary pain, alternatives, desired outcome, objections, their language.

### samples.md
5-10 gold-standard sentences, tagged with source and why representative.

### context/learnings.md
Append-only. Sections tagged by domain (voice, content, email, visual, general, etc.). Each entry dated. New domains added as new skill types generate learnings. Skills read only their domain's entries. Lives in context/ alongside other agent/session state files.

---

## 9. Graceful Degradation

| Tier | State | Behaviour |
|------|-------|-----------|
| Zero context | No brand_context/ | Standalone. Asks what it needs. Solid but generic. |
| Partial | Some files | Uses what's there, defaults for rest. |
| Full | All files present | Fully personalised. |

Brand context enhances. Never gates. A thumbnail skill works without brand_context/ — it just won't have brand colour or tone context.

---

## 10. Foundation Skills (build first)

These create the brand_context/ that everything else reads from. They ship with the template.

### mkt-brand-voice
**Trigger:** tone, writing style, brand voice, how they sound
**Outcome:** brand_context/voice-profile.md + brand_context/samples.md
**Reads:** brand_context/positioning.md (summary)
**Methodology:** Extract from URLs, analyse local files, interview for preferences. Measure 6 dimensions. Build do/don't rules. Test with rewrite.

### mkt-positioning
**Trigger:** differentiation, angle, hooks, USP
**Outcome:** brand_context/positioning.md
**Reads:** brand_context/icp.md (full)
**Methodology:** Web search competitors. Assess market sophistication. Generate 3-5 angles. Score. Recommend primary.

### mkt-icp
**Trigger:** target audience, buyer persona, ideal customer
**Outcome:** brand_context/icp.md
**Reads:** brand_context/positioning.md (summary)
**Methodology:** Extract from answers, URL content, social signals. Map pain in customer's language. Identify objections.

---

## 11. Execution Skills — Initial Set

These ship with the template as the core growth marketing toolkit.

| Skill | Produces | Key brand_context needed |
|-------|---------|------------------------|
| direct-response-copy | Landing pages, sales copy | Full voice + ICP + angle + samples |
| seo-content | Long-form articles | Full voice + ICP expertise + samples |
| email-sequences | Welcome, nurture, launch | Full voice + ICP + angle + samples |
| lead-magnet | Opt-in deliverables | ICP full + angle + voice tone |
| keyword-research | Topic clusters | Positioning full + ICP language |
| content-atomizer | Platform-native posts | Full voice + samples |

---

## 12. Future Skills — Examples of Extensibility

These don't ship with the template but demonstrate how the architecture handles any domain.

| Skill | Domain | brand_context usage | Notes |
|-------|--------|-------------------|-------|
| thumbnail-creator | Content/visual | Tone for text overlays | Could use Replicate API for generation |
| ugc-generator | Content/video | Full voice + ICP + angle | Script generation for user-generated content |
| screen-recording | Production | None | Pure workflow skill, no brand context needed |
| client-proposal | Business ops | Full everything | Pulls brand context for personalised proposals |
| social-scheduler | Distribution | Tone + ICP interests | Integrates with Buffer/Hootsuite via MCP |
| competitor-monitor | Strategy | Positioning + ICP | Web search for competitor activity |
| ad-creative | Paid media | Voice + angle + ICP | Hook-format testing matrices |
| newsletter | Content | Full voice + ICP | Edition creation + format templates |
| onboarding-sequence | Client ops | Voice + positioning | Welcome flow for new clients |
| invoice-generator | Business ops | None | Pure operations skill |

Each follows the same pattern: SKILL.md + references/, declares context needs, plugs into the matrix. Some need deep brand context, some need none. The architecture handles both.

---

## 13. Distribution

### Template Repo

**Version controlled (everything except .env):**
- CLAUDE.md, context/SOUL.md, context/USER.md, context/MEMORY.md (template)
- .claude/commands/ and .claude/skills/
- brand_context/ (generated per client — tracked in git)
- projects/ (tracked)

### .gitignore

```
.env
```

That's it. Everything else is tracked.

### Adding New Skills

Two paths:

1. **From the Academy:** You build a new skill, push to template repo. Students pull the update. brand_context/ and projects/ are unique to their client so no merge conflicts.
2. **User-built:** Student creates a skill for a specific need. Follows Section 5 creation rules. Can share back to the community.

---

## 14. Build Order

**Phase 1 — Agent Identity:**
1. CLAUDE.md (entry point, skill registry, context matrix, heartbeat checks)
2. context/SOUL.md (personality and values)
3. context/USER.md (template)
4. context/MEMORY.md (long-term knowledge template)

**Phase 2 — Command + Foundation Skills:**
5. .claude/commands/start-here.md (the only command)
6. .claude/skills/mkt-brand-voice/ — ask for reference skills before building
7. .claude/skills/mkt-positioning/ — ask for reference skills before building
8. .claude/skills/mkt-icp/ — ask for reference skills before building

**Phase 3 — Validate:**
9. Run /start-here end-to-end on a real business
10. Verify brand_context/ creation
11. Verify returning mode (heartbeat + routing)
12. Verify standalone skill operation
13. Verify dynamic skill showcase detects installed skills

**Phase 4 — Execution skills (build incrementally):**
14. Ask user for reference skills
15. Build, test with/without brand context
16. Verify context matrix updates correctly
17. Repeat

**Phase 5 — Expand beyond marketing:**
18. Build first non-marketing skill (e.g., thumbnail-creator)
19. Verify it plugs in cleanly — no architecture changes needed
20. Verify /start-here showcase groups it correctly

---

## 15. Open Questions

- [ ] Should execution skills also be invokable as direct commands?
- [ ] Skill categories — should skills declare a category in frontmatter for showcase grouping?
- [ ] Right threshold for "stale" brand_context files? (Currently 30 days)
- [ ] Should learnings.md have pruning? Or archive old entries?
- [ ] Add TOOLS.md (OpenClaw concept) for tracking MCP servers + API keys?
- [ ] Should USER.md auto-update as agent learns preferences?
- [ ] Should brand_context/ support additional files beyond the core 5? (e.g., brand_context/visual-identity.md for colour palette, fonts, logo references that visual skills would use)
- [ ] Skill versioning — should skills declare a version in metadata for update tracking?

---

## 16. Permissions

Add this permissions file to the settings.json

{
  "permissions": {
    "allow": [
      "Bash(cat:*)",
      "Bash(ls:*)",
      "Bash(npm run *)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(git status:*)",
      "Bash(git diff:*)",
      "Edit(/src/**)"
    ],
    "deny": [
      "Bash(npm install *)",
      "Bash(npm uninstall *)",
      "Bash(yarn add *)",
      "Bash(pip install *)",
      "Bash(rm *)",
      "Bash(rm -rf *)",
      "Bash(rmdir *)",
      "Bash(curl *)",
      "Bash(wget *)",
      "Bash(ssh *)",
      "Bash(scp *)",
      "Read(.env)",
      "Read(.env.*)",
      "Read(**/secrets/*)",
      "Read(**/*credential*)",
      "Read(**/*.pem)",
      "Read(**/*.key)"
    ]
  }
}

---