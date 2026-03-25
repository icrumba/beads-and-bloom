# Stitch Prompt: Board View

Paste the following prompt into Google Stitch to generate the Board view design.

---

## Prompt

Design a desktop dashboard screen (1440x900 viewport) for the "Agentic OS Command Centre" -- a local Kanban board where non-technical business users manage AI agent tasks. The aesthetic is clean, minimal, and professional -- inspired by Linear's information density and Notion's content-first layout, but lighter and more spacious. No dark mode, no gradients, no emojis, no avatars, no decorative elements. Every element serves a function.

### Design Language (inline tokens -- use these exact values)

**Colours:**
- Page background: #FAFBFC
- Card background: #FFFFFF with 1px solid #E5E7EB border, 8px border-radius, 0 1px 2px rgba(0,0,0,0.05) shadow
- Card hover: border becomes #D1D5DB, shadow becomes 0 4px 6px rgba(0,0,0,0.07)
- Sidebar background: #FFFFFF with 1px solid #F3F4F6 right border
- Stats bar background: #F9FAFB with 1px solid #F3F4F6 bottom border
- Column background: #F3F4F6, 8px border-radius, 12px padding
- Text primary: #111827 (headings, titles)
- Text secondary: #4B5563 (body, descriptions)
- Text muted: #9CA3AF (metadata, timestamps, captions)
- Accent: #3B82F6 (active nav, primary buttons, links); hover: #2563EB
- Active nav background tint: #EFF6FF

**Status colours (used as 3px left-border on cards and badge backgrounds):**
- Backlog: #9CA3AF (tinted bg: #F3F4F6)
- Queued: #6B7280 (tinted bg: #F3F4F6)
- Running: #3B82F6 (tinted bg: #EFF6FF)
- Review: #F59E0B (tinted bg: #FFFBEB)
- Done: #10B981 (tinted bg: #ECFDF5)
- Error: #EF4444 (tinted bg: #FEF2F2)

**Level badges (small pills, 11px medium text, 2px 8px padding, 4px border-radius):**
- Task: bg #F3F4F6, text #4B5563, border #E5E7EB
- Project: bg #EFF6FF, text #1D4ED8, border #BFDBFE
- GSD: bg #F5F3FF, text #6D28D9, border #DDD6FE

**Typography:**
- Font: Inter, -apple-system, BlinkMacSystemFont, sans-serif for all UI text
- Monospace: JetBrains Mono for cost values, durations, token counts
- Page title: 20px, semibold (600), #111827
- Section heading / column header: 16px, semibold (600), #111827
- Card title: 14px, medium (500), #111827
- Body text: 14px, regular (400), #4B5563
- Caption / metadata: 12px, regular (400), #9CA3AF
- Badge text: 11px, medium (500)
- Stat number: 24px, semibold (600), #111827
- Stat label: 12px, regular (400), #9CA3AF

**Spacing (base unit 4px):**
- Card padding: 16px
- Card gap (within column): 8px
- Column gap: 24px
- Sidebar width: 240px
- Page margins: 40px left/right, 32px top
- Stats bar height: 72px
- Nav item height: 36px

**Icons:** Outline-style (Lucide/Heroicons). 18px for nav, 16px inline, 48px empty states.

### Layout Architecture

**Fixed left sidebar (240px):**
- Top: "Command Centre" title in section-heading style (16px semibold), with a small outline icon to the left
- Navigation items below, stacked vertically with 4px gaps:
  - Board (layout-kanban icon) -- ACTIVE: #EFF6FF background, #3B82F6 text, 2px left border #3B82F6
  - Cron Jobs (clock icon)
  - Context (file-text icon)
  - Brand (palette icon)
  - Skills (zap icon)
- Each nav item: 36px height, 8px 16px padding, 14px regular text, #4B5563 colour, 6px border-radius
- Hover state: #F9FAFB background
- Section divider (1px solid #F3F4F6) above the client switcher area at the bottom
- Client switcher dropdown at sidebar bottom: shows "Root" with a chevron-down icon, #4B5563 text

**Stats bar (full width of content area, 72px height):**
- Horizontal row of four stat blocks, evenly spaced, with 1px solid #F3F4F6 vertical separators between them:
  1. "Tasks Running" -- number "2" in 24px semibold #111827, with a pulsing 8px #3B82F6 dot to the left of the number. Label "Tasks Running" in 12px #9CA3AF below.
  2. "Tasks Completed" -- number "14" in 24px semibold. Label below.
  3. "Active Crons" -- number "3" in 24px semibold. Label below.
  4. "Today's Spend" -- number "$1.24" in 24px semibold JetBrains Mono. Label below.
- Stats bar has #F9FAFB background with 1px #F3F4F6 bottom border
- 16px 40px padding

**Task creation area (below stats bar, 16px top margin):**
- Full-width input field: placeholder text "Describe what you need done..." in #9CA3AF
- Input: #FFFFFF background, 1px solid #E5E7EB border, 6px border-radius, 8px 12px padding, 14px regular text, 36px height
- On focus: border becomes #3B82F6 with 0 0 0 3px rgba(59,130,246,0.1) ring
- Primary submit button to the right: "Run" text, #3B82F6 background, #FFFFFF text, 14px medium, 8px 16px padding, 6px border-radius, 36px height
- 8px gap between input and button

**Main content area (five Kanban columns):**
- Five columns arranged horizontally: Backlog, Queued, Running, Review, Done
- Each column: #F3F4F6 background, 8px border-radius, 12px padding, min-width 260px
- Column header: name in 16px semibold #111827 + inline count badge (e.g., "3") as a small muted text
- 12px padding below header, 1px solid #E5E7EB bottom border
- Cards stack vertically with 8px gaps
- Columns scroll vertically with hidden scrollbar if content overflows
- 24px gap between columns
- Horizontal scroll on the content area if viewport is narrow

### Card Design (three levels)

**Task card (simple):**
- White background, 1px #E5E7EB border, 8px border-radius, 16px padding
- 3px left border in the column's status colour
- Title: "Draft LinkedIn carousel for product launch" -- 14px medium #111827
- Row below title (4px gap): Task level badge (grey) + skill label "mkt-brand-voice" in 12px #9CA3AF
- Bottom row (8px gap from badge row): timestamp "2m ago" in 12px #9CA3AF on the left, cost "$0.08" in 12px JetBrains Mono #9CA3AF on the right
- Grab handle: 6 small dots (2x3 grid) in #D1D5DB on the top-right corner, visible on hover
- Cursor: pointer

**Project card (expandable):**
- Same base styling as Task card but with Project level badge (blue-tinted)
- Title: "Q2 Content Calendar"
- Additional row: progress text "3/5 tasks complete" in 12px #4B5563 with a thin progress bar (4px height, #E5E7EB track, #3B82F6 fill at 60%, 2px border-radius)
- Output file count: small file icon + "3 files" in 12px #9CA3AF
- Expand chevron at bottom of card

**GSD card (expandable with progress):**
- Same base styling but with GSD level badge (purple-tinted)
- Title: "Website Rebuild"
- Progress bar: wider and more prominent, showing "Phase 2 of 5" text above the bar
- Sub-item count: "12 tasks, 3 projects" in 12px #9CA3AF
- Output file count: "8 files" with file icon
- Expand chevron at bottom

### Drag-and-Drop Affordances

- Grab handle (6-dot grip icon, #D1D5DB) appears on card hover at top-right
- While dragging: card lifts with 0 8px 16px rgba(0,0,0,0.12) shadow, slight scale(1.02), opacity 0.9
- Drop zone: target column shows 2px dashed #3B82F6 border, #EFF6FF background tint
- Adjacent cards shift apart to create a 40px gap where the card would land

### Realistic Content

**Backlog column (3 cards):**
1. Task: "Write Q2 newsletter draft" -- mkt-brand-voice -- 15m ago
2. Project: "Competitor Pricing Analysis" -- str-competitor-analysis -- 3/5 tasks -- 1h ago
3. Task: "Generate weekly social media posts" -- mkt-content-calendar -- 2h ago

**Queued column (2 cards):**
1. Task: "Research trending topics for blog" -- str-ai-seo -- 5m ago
2. GSD: "Website Rebuild" -- Phase 2 of 5 -- 12 tasks, 3 projects -- 1d ago

**Running column (2 cards):**
1. Task: "Draft LinkedIn carousel for product launch" -- mkt-brand-voice -- running 1m 23s -- $0.08 so far -- pulsing blue dot, 3px blue left border
2. Project: "Email Welcome Sequence" -- mkt-email-sequence -- 2/4 tasks -- running 3m 45s -- $0.31 so far

**Review column (1 card):**
1. Task: "Weekly competitor price scan" -- str-competitor-analysis -- completed 4m 12s -- $0.15 -- 2 files -- amber left border

**Done column (3 cards):**
1. Task: "Monday client briefing notes" -- 2m 05s -- $0.04 -- 1 file -- green left border
2. Task: "SEO keyword research for Q2" -- str-ai-seo -- 6m 30s -- $0.22 -- 3 files
3. Project: "March Newsletter" -- mkt-brand-voice -- 5/5 tasks -- 12m 15s -- $0.45 -- 4 files

---

## State Variants

Generate additional screens for these states:

### Empty State
The Kanban columns exist with their headers (Backlog, Queued, Running, Review, Done) but contain no cards. Centred in the main content area (vertically and horizontally), display:
- An outline layout-kanban icon, 48px, #9CA3AF colour
- Heading: "No tasks yet" in 16px semibold #111827
- Description: "Describe what you need done and hit Run. Your task will move through the board automatically." in 14px regular #9CA3AF, max-width 320px, centred
- The task creation input field above is prominent and empty, with the placeholder text visible
- Stats bar shows all zeroes: "0" for all counts, "$0.00" for spend

### Loading State
- Stats bar shows skeleton placeholders: 4 blocks, each with a shimmer-animated rectangle for the number (60x28px) and a smaller rectangle for the label (80x14px). Skeleton colour: #E5E7EB with a left-to-right gradient shimmer sweep, 1.5s infinite.
- Kanban columns show 2-3 skeleton card placeholders each: white rectangles matching card dimensions, with 3 internal skeleton lines (title-width rectangle, shorter badge-line rectangle, narrow timestamp rectangle). Same shimmer animation.
- Task creation input area is visible but disabled.

### Running State (already shown in the default populated view above)
- Cards in the Running column have a 3px solid #3B82F6 left border
- A pulsing dot (8px circle, #3B82F6, scale 1->1.3->1, opacity 1->0.5->1, 2s infinite loop) appears to the left of the status text on the card
- Live counters on the card: elapsed time counting up, cost accumulating
- The "Tasks Running" stat in the stats bar shows its pulsing blue dot

### Completed State
- Cards in Done column have 3px solid #10B981 left border
- A green checkmark icon (16px, #10B981) appears next to the status
- Output files shown as small file-icon + filename badges (e.g., "newsletter-draft.md") in 11px muted text with #ECFDF5 background and #10B981 text, 4px border-radius
- Cost and duration shown in JetBrains Mono

### Error State
- Card has 3px solid #EF4444 left border
- Red alert-circle icon (16px, #EF4444) next to status
- Error message preview on the card: "Skill not found: mkt-newsletter" in 12px #EF4444, truncated to one line
- Card background has a very subtle red tint: #FEF2F2
- Card border becomes 1px solid #FCA5A5
- Retry button on the card: small secondary button "Retry" with outline style

### Interactive States (apply to all states above)
- Card hover: border -> #D1D5DB, shadow -> 0 4px 6px rgba(0,0,0,0.07), grab handle appears
- Button (primary) hover: background -> #2563EB
- Button (primary) focus: ring 0 0 0 3px rgba(59,130,246,0.15)
- Nav item hover: background -> #F9FAFB
- Input focus: border -> #3B82F6, ring 0 0 0 3px rgba(59,130,246,0.1)
- Table row hover: background -> #F9FAFB

Design constraints: No emojis anywhere. No dark mode. No rounded avatars or profile images. No gradients. No heavy shadows (max opacity 0.12 on shadows). The interface should feel like a clean project management tool that happens to be beautiful.
