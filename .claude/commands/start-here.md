# /start-here

The entry point for every session. Detects state and routes accordingly.

## Mode Detection

Check whether `brand_context/` exists and contains populated files.
- No brand_context/ files → First-run mode
- Files exist → Returning mode

## Always (both modes)

Create today's memory file per CLAUDE.md's **Daily Memory** section:
- If `context/memory/{YYYY-MM-DD}.md` doesn't exist → create it with a `## Session — {HH:MM}` header
- If it already exists → append a new `## Session — {HH:MM}` block
- Fill in `### Goal` once the user states what they're working on

---

## First-Run Mode

### Step 1: Project Scan + Intro

Check what exists:
- `brand_context/` files (which ones, which are missing)
- `context/USER.md` (populated or template?)
- `.claude/skills/` (which skills are installed)

Read README.md and give the user a brief, genuine explanation of what they've set up:
- What Agentic OS does (business OS that learns their brand, gets sharper each session)
- How it works in practice (answer a few questions → brand foundation → every skill uses it)
- The learnings loop (feedback improves future output)
- That skills can be built for any domain as needs grow
- What skills are currently installed (scan `.claude/skills/` dynamically)

Keep it conversational — 4-6 sentences max, not a feature dump. End with the first question.

### Step 2: Core Questions (ONE AT A TIME)

Ask these four questions sequentially. Wait for each answer before asking the next.
Do NOT present all four at once.

**Question 1:** "What does your business do? Give me the one-sentence version."
→ Wait for answer.

**Question 2:** "Who's your ideal customer — who do you help?"
→ Wait for answer.

**Question 3:** "What makes you different from the alternatives?"
→ Wait for answer.

**Question 4:** "How do you want to come across? (e.g. direct, warm, authoritative, playful)"
→ Wait for answer.

Capture all answers. You'll use them to build brand_context/.

### Step 3: Collect Brand Assets + URL Extraction

Ask: "Got a website, LinkedIn, YouTube, or any other links I should know about — both business and personal?"

If yes:
- Separate into business vs personal links and handles
- Save all to `brand_context/assets.md` under the correct sections
- Use web_fetch to retrieve content from provided URLs for voice extraction
- Extract 5-10 gold-standard sentences that represent their voice
- Note what makes each sentence representative

If no: skip URL extraction, but still create `brand_context/assets.md` with empty fields so it's ready for later.

### Step 4: Local File Scan (Conditional)

If the user mentions they have existing copy, docs, or emails:
"Want to share any files? I can scan them for voice patterns."

If yes: read provided files, extract voice signals and strong sentences.

### Step 5: Build brand_context/

Run the foundation skill methodologies to create the brand files.
Use answers from Step 2 + extracted content from Steps 3-4.

Read each skill's SKILL.md for the full methodology:
- `.claude/skills/mkt-brand-voice/SKILL.md` → produces `voice-profile.md` + `samples.md`
- `.claude/skills/mkt-positioning/SKILL.md` → produces `positioning.md`
- `.claude/skills/mkt-icp/SKILL.md` → produces `icp.md`

Create `context/learnings.md` with sections matching installed skill folder names (e.g., `## mkt-brand-voice`).

### Step 6: Update context/USER.md

Populate context/USER.md with what you've learned:
- Name and business from the conversation
- Communication style signals observed
- Role (founder / marketer / agency / student)

### Step 7: Show Results

Show actual excerpts — not just filenames.

Example format:
```
Here's what I built:

**Your voice:** [2-sentence excerpt from voice-profile.md]
**Your positioning:** [one-line statement from positioning.md]
**Your ICP:** [primary pain statement from icp.md]

Everything's saved in brand_context/. I'll use this in every skill going forward.
```

### Step 8: Dynamic Skill Showcase

Scan `.claude/skills/` for all installed skills.
Read each skill's frontmatter to get name and description.
Group by category (foundation / execution / other).

Present what's available, framed around this specific business:

```
Here's what I can do for [business name]:

**Foundation** (done)
✓ mkt-brand-voice, mkt-positioning, mkt-icp — complete

**Growth Marketing**
- [skill]: [what it does for their specific business]
- [skill]: [what it does for their specific business]
```

End with ONE recommendation based on business context:
"Given you're [situation], I'd start with [skill] — [reason]."

Do NOT present a menu and ask them to pick. Recommend.

---

## Returning Mode

### Step 1: Run session checks

Check freshness, gaps, available skills per CLAUDE.md Session Start protocol.

### Step 2: Session recap + capabilities + goal question

Read the most recent `context/memory/*.md` file(s) to understand what happened last session. Scan `.claude/skills/` to know what's installed.

Open with three things:

**1. Last session recap (1-2 sentences)**
Pull from the most recent memory file. What did they work on? What was produced?
Example: "Last time we built out your email sequence for the course launch — three emails, all in your voice."

If no memory files exist, skip the recap.

**2. High-level capabilities (grouped by business goal, not skill names)**
Scan installed skills and translate them into what the user can actually *do*. Group by outcome, not by skill folder name. Keep it to 2-4 lines max.

Example:
```
Right now I can help you with:
- **Brand & messaging** — refine your voice, positioning, or audience profile
- **Content creation** — emails, landing pages, blog posts in your voice
- **Strategy** — keyword planning, competitor analysis
- **System** — build new skills, wrap up sessions
```

Only show categories where at least one skill is installed. Use plain language, not skill names. If there's only one category (e.g. just foundation + meta), keep it to one line.

**3. Goal question**
End with: "What are you working on today?" or a contextual variant based on the recap (e.g. "Want to keep going on the launch sequence, or something different?").

### Step 3: Route or Recommend

If user states a clear task → execute it using the relevant skill.

If user says they're unsure → recommend the highest-leverage next action based on what's missing, what learnings suggest, or what naturally follows from the last session.

Mention stale files or gaps only if directly relevant to their stated goal (once, with opportunity framing).

Do NOT:
- Summarise their brand back to them unprompted
- Default to recommending brand/foundation tasks
- Assume they want to create or refine brand context
- List individual skill names unless the user asks for specifics

---

## Anti-Patterns

1. Never ask more than 4 questions before doing work
2. Never present all questions at once — ask one, wait, then ask the next
3. Never present a skill menu — recommend, don't ask
4. Never rebuild brand_context/ without explicitly asking first
5. Never give generic recommendations — tie them to the specific business
6. Never silently produce generic output when context is missing — note the gap
7. Never use a hardcoded skill list — always scan `.claude/skills/` dynamically
8. Frame gaps as opportunities, not failures
