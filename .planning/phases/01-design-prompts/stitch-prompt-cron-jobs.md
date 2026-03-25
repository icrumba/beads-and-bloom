# Stitch Prompt: Cron Jobs View

Paste the following prompt into Google Stitch to generate the Cron Jobs view design.

---

## Prompt

Design a desktop dashboard screen (1440x900 viewport) for the "Cron Jobs" tab of the Agentic OS Command Centre -- a local dashboard where non-technical business users manage scheduled recurring AI agent tasks. This is NOT a Kanban board -- it is a table/list view showing all scheduled jobs with their run history, costs, and controls. Clean, minimal, professional aesthetic. No dark mode, no gradients, no emojis, no avatars.

### Design Language (inline tokens -- use these exact values)

**Colours:**
- Page background: #FAFBFC
- Card/row background: #FFFFFF
- Sidebar background: #FFFFFF with 1px solid #F3F4F6 right border
- Stats bar background: #F9FAFB with 1px solid #F3F4F6 bottom border
- Table header background: #F9FAFB
- Text primary: #111827 (headings, job names)
- Text secondary: #4B5563 (body, descriptions)
- Text muted: #9CA3AF (metadata, timestamps)
- Accent: #3B82F6 (active elements); hover: #2563EB
- Active nav tint: #EFF6FF
- Border default: #E5E7EB
- Border light: #F3F4F6

**Status colours (used as badge backgrounds):**
- Running: #3B82F6 (tinted bg: #EFF6FF)
- Done/Success: #10B981 (tinted bg: #ECFDF5)
- Error/Failed: #EF4444 (tinted bg: #FEF2F2)
- Paused: #8B5CF6 (tinted bg: #F5F3FF)
- Scheduled/Active: #6B7280 (tinted bg: #F3F4F6)

**Typography:**
- Font: Inter, -apple-system, BlinkMacSystemFont, sans-serif
- Monospace: JetBrains Mono for cost values, durations, cron expressions
- Page title: 20px, semibold (600), #111827
- Section heading: 16px, semibold (600), #111827
- Card/row title: 14px, medium (500), #111827
- Body text: 14px, regular (400), #4B5563
- Caption: 12px, regular (400), #9CA3AF
- Badge text: 11px, medium (500)
- Stat number: 24px, semibold (600), #111827
- Stat label: 12px, regular (400), #9CA3AF
- Table header: 12px, medium (500), uppercase, #9CA3AF

**Spacing:**
- Sidebar width: 240px
- Page margins: 40px left/right, 32px top
- Stats bar height: 72px
- Table row padding: 12px 16px
- Card padding: 16px

**Icons:** Outline-style (Lucide/Heroicons). 18px for nav, 16px inline.

### Layout Architecture

**Fixed left sidebar (240px):**
- Same sidebar as the Board view for consistency
- "Command Centre" title at top (16px semibold, outline icon)
- Navigation items stacked vertically with 4px gaps:
  - Board (layout-kanban icon)
  - Cron Jobs (clock icon) -- ACTIVE: #EFF6FF background, #3B82F6 text, 2px left border #3B82F6
  - Context (file-text icon)
  - Brand (palette icon)
  - Skills (zap icon)
- Each nav item: 36px height, 8px 16px padding, 14px regular, #4B5563, 6px border-radius
- Section divider and client switcher dropdown at bottom showing "Root"

**Stats bar (full width of content area, 72px):**
- Four stat blocks with vertical separators:
  1. "Active Jobs" -- "5" in 24px semibold
  2. "Paused Jobs" -- "2" in 24px semibold
  3. "Runs Today" -- "8" in 24px semibold
  4. "Today's Cron Spend" -- "$2.15" in 24px semibold JetBrains Mono
- #F9FAFB background, 1px #F3F4F6 bottom border, 16px 40px padding

**Page header area (below stats bar):**
- Title: "Cron Jobs" in 20px semibold #111827
- Right side: primary button "New Cron Job" -- #3B82F6 background, #FFFFFF text, 14px medium, 8px 16px padding, 6px border-radius, 36px height
- 24px bottom margin before the table

### Cron Jobs Table

**Table header row:**
- Background: #F9FAFB
- Columns (left to right): Job Name, Schedule, Next Run, Last Run, Avg Duration, Avg Cost, Status, Actions
- Header text: 12px medium uppercase #9CA3AF
- Padding: 12px 16px

**Table rows (one per cron job):**
- Background: #FFFFFF
- Border bottom: 1px solid #F3F4F6
- Padding: 12px 16px
- Hover: #F9FAFB background
- Row is clickable (cursor pointer) to expand run history

**Column content for each row:**
- **Job Name:** 14px medium #111827. Below the name, the task description in 12px #9CA3AF truncated to one line ("Weekly competitor pricing scan across 5 markets")
- **Schedule:** Human-readable in 14px regular #4B5563 ("Every Monday 9am") with the raw cron expression below in 12px JetBrains Mono #9CA3AF ("0 9 * * 1")
- **Next Run:** Relative timestamp "in 2 days" in 14px regular #4B5563, with absolute date below "Mon 31 Mar, 9:00am" in 12px #9CA3AF
- **Last Run:** Relative "4h ago" in 14px regular, with status badge inline -- small pill: "Success" with #ECFDF5 background and #10B981 text, 11px medium, 2px 8px padding, 4px border-radius
- **Avg Duration:** "4m 12s" in 14px JetBrains Mono #4B5563
- **Avg Cost:** "$0.18" in 14px JetBrains Mono #4B5563
- **Status:** Toggle switch -- active (filled #3B82F6 track, white circle) or paused (#E5E7EB track). 36px wide, 20px tall.
- **Actions:** Three-dot menu icon (more-horizontal, 18px, #9CA3AF). On hover: #4B5563.

### Expanded Run History (one row shown expanded)

When a row is clicked, it expands to reveal a sub-table of past runs below the job row. The expanded area has a #F9FAFB background, 16px padding, 1px solid #E5E7EB top border.

**Run history sub-table headers:** Run Date, Status, Duration, Cost, Output Files -- in 12px medium uppercase #9CA3AF

**Run history rows (compact, 8px vertical padding):**
1. "Today, 9:02am" -- Success badge (green) -- "3m 58s" mono -- "$0.16" mono -- "competitor-scan-2026-03-25.md" as a small file badge with file icon
2. "Mon 24 Mar, 9:01am" -- Success badge -- "4m 22s" -- "$0.19" -- "competitor-scan-2026-03-24.md"
3. "Mon 17 Mar, 9:03am" -- Failed badge (red, #FEF2F2 bg, #EF4444 text) -- "1m 05s" -- "$0.04" -- no output file, error text "API rate limit exceeded" in 12px #EF4444
4. "Mon 10 Mar, 9:00am" -- Success badge -- "4m 10s" -- "$0.17" -- "competitor-scan-2026-03-10.md"

### Job Creation Form (modal or slide-out panel)

Show a slide-out panel from the right (480px wide, #FFFFFF background, -4px 0 16px rgba(0,0,0,0.08) shadow, rgba(0,0,0,0.4) overlay on the rest of the page).

**Panel header:** "New Cron Job" in 16px semibold, close X button (ghost style) top-right. 56px height, 1px #E5E7EB bottom border.

**Form fields (24px padding, 20px gap between fields):**
1. **Task Description** -- textarea, 80px min-height, placeholder "Describe the recurring task..." in #9CA3AF
2. **Schedule** -- dropdown selector with options: Daily, Weekly, Monthly, Custom. Default "Weekly".
   - If Weekly selected: day-of-week pill selector (Mon-Sun, single select, active pill has #EFF6FF bg and #3B82F6 text) + time input (e.g., "09:00")
   - If Custom selected: text input for cron expression with placeholder "0 9 * * 1" in JetBrains Mono
3. **Skill (optional)** -- dropdown with "Auto-detect" as default, list of skills as options

**Form footer:** "Cancel" secondary button (left), "Create Job" primary button (right). 16px padding, 1px #E5E7EB top border.

### Realistic Content (populate the table with these jobs)

| Job Name | Schedule | Next Run | Last Run | Avg Duration | Avg Cost | Status |
|----------|----------|----------|----------|-------------|----------|--------|
| Weekly Competitor Scan | Every Monday 9am | in 2 days | 4h ago (Success) | 4m 12s | $0.18 | Active |
| Daily Social Media Posts | Every day 7am | in 14 hours | 10h ago (Success) | 2m 30s | $0.09 | Active |
| Monthly Client Report | 1st of every month | in 6 days | 25 days ago (Success) | 8m 45s | $0.52 | Active |
| Weekly SEO Keyword Check | Every Friday 2pm | in 4 days | 3 days ago (Success) | 5m 20s | $0.23 | Active |
| Weekly Newsletter Draft | Every Wednesday 8am | in 1 day | 5 days ago (Failed) | 3m 10s | $0.14 | Active |
| Quarterly Market Analysis | 1st of Jan/Apr/Jul/Oct | in 7 days | 85 days ago (Success) | 15m 30s | $1.20 | Paused |
| Daily Inbox Summary | Every day 8:30am | in 13 hours | 9h ago (Success) | 1m 45s | $0.06 | Active |

---

## State Variants

### Empty State
The table area is replaced with a centred empty state:
- Outline clock icon, 48px, #9CA3AF
- Heading: "No scheduled jobs" in 16px semibold #111827
- Description: "Set up recurring tasks to automate your regular workflows. Create your first cron job to get started." in 14px regular #9CA3AF, max-width 320px, centred
- Primary button: "Create First Job" -- #3B82F6 background, #FFFFFF text
- Stats bar shows all zeroes

### Loading State
- Stats bar: skeleton shimmer blocks (same pattern as Board view)
- Table header row visible
- 5 skeleton table rows: each row has shimmer-animated rectangles matching column widths. Skeleton colour #E5E7EB, left-to-right gradient sweep, 1.5s infinite.

### Running State
- One table row is highlighted: left border 3px solid #3B82F6
- The "Last Run" cell shows a pulsing blue dot (8px, scale animation 2s infinite) + "Running now..." in 14px #3B82F6
- Duration cell shows a live counter "1m 23s..." counting up in JetBrains Mono #3B82F6
- Cost cell shows live accumulating cost "$0.06..." in JetBrains Mono #3B82F6
- "Runs Today" stat in the stats bar increments, pulsing dot next to the number

### Completed State
- The most recent run in the expanded history shows a green "Success" badge (#ECFDF5 bg, #10B981 text)
- Output file badges in the run history row: file icon + filename in 11px text, #ECFDF5 background, #10B981 text, 4px border-radius
- Last Run cell in the main table shows the relative time + Success badge

### Error State
- A table row with a failed last run:
  - "Last Run" cell: "12m ago" + red "Failed" badge (#FEF2F2 bg, #EF4444 text)
  - Row has a subtle red-tinted background: #FEF2F2
  - In expanded run history, the failed run shows: error text "API rate limit exceeded" in 12px #EF4444, no output files
  - Retry button: small secondary button "Retry" inline in the Actions column

Design constraints: No emojis. No dark mode. No gradients. No heavy shadows (max opacity 0.12). Table design should feel like a clean spreadsheet with good information hierarchy -- large readable job names, compact metadata, and clear status communication through colour.
