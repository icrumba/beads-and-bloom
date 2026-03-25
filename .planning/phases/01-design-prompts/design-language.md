# Command Centre Design Language

Shared visual foundation for all Stitch prompts. Every view prompt references this document for consistent colours, typography, spacing, and component styles.

Derived from reference analysis (see `design-references.md`): Vibe Kanban's clean light aesthetic, OpenClaw's data display patterns, Claude Task Viewer's real-time indicators.

---

## Design Principles

1. **Clean and minimal** -- no decorative elements, no gradients, no heavy shadows. Every element serves a function.
2. **Status through colour** -- task state is communicated primarily through colour (borders, badges, indicators), not icons or text alone.
3. **Numbers are scannable** -- key metrics (cost, duration, count) are large, bold, and immediately readable.
4. **Progressive detail** -- cards show a summary; the detail panel shows everything. Don't cram information into cards.
5. **Business-first language** -- no developer jargon. "Cost" not "tokens". "Duration" not "execution time". "Running" not "in-progress".

---

## Colour Palette

### Backgrounds

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-page` | `#FAFBFC` | Page background |
| `bg-card` | `#FFFFFF` | Cards, panels, modals |
| `bg-sidebar` | `#FFFFFF` | Sidebar navigation |
| `bg-stats-bar` | `#F9FAFB` | Stats bar background strip |
| `bg-column` | `#F3F4F6` | Kanban column background |
| `bg-input` | `#FFFFFF` | Text inputs, textareas, selects |
| `bg-hover` | `#F9FAFB` | Card hover, row hover, nav item hover |
| `bg-overlay` | `rgba(0,0,0,0.4)` | Slide-out panel backdrop |

### Text

| Token | Hex | Usage |
|-------|-----|-------|
| `text-primary` | `#111827` | Headings, card titles, primary content |
| `text-secondary` | `#4B5563` | Body text, descriptions |
| `text-muted` | `#9CA3AF` | Metadata, timestamps, captions |
| `text-on-primary` | `#FFFFFF` | Text on primary-colour backgrounds |
| `text-on-status` | `#FFFFFF` | Text on status badge backgrounds |

### Status Colours

| Token | Hex | Usage | Tinted Background |
|-------|-----|-------|--------------------|
| `status-backlog` | `#9CA3AF` | Backlog column, backlog badges | `#F3F4F6` |
| `status-queued` | `#6B7280` | Queued column, queued badges | `#F3F4F6` |
| `status-running` | `#3B82F6` | Running column, active indicators, pulsing dot | `#EFF6FF` |
| `status-review` | `#F59E0B` | Review column, needs-attention badges | `#FFFBEB` |
| `status-done` | `#10B981` | Done column, success badges, completed checkmarks | `#ECFDF5` |
| `status-error` | `#EF4444` | Failed tasks, error messages, error badges | `#FEF2F2` |
| `status-paused` | `#8B5CF6` | Paused cron jobs | `#F5F3FF` |

### Interactive

| Token | Hex | Usage |
|-------|-----|-------|
| `accent-primary` | `#3B82F6` | Primary buttons, links, active nav indicator |
| `accent-primary-hover` | `#2563EB` | Primary button hover |
| `accent-primary-light` | `#EFF6FF` | Selected/active background tint |

### Borders and Dividers

| Token | Hex | Usage |
|-------|-----|-------|
| `border-default` | `#E5E7EB` | Card borders, input borders, table borders |
| `border-light` | `#F3F4F6` | Subtle dividers, section separators |
| `border-focus` | `#3B82F6` | Input focus ring |
| `border-hover` | `#D1D5DB` | Card hover border |

### Level Badges

| Level | Background | Text | Border |
|-------|-----------|------|--------|
| Task | `#F3F4F6` | `#4B5563` | `#E5E7EB` |
| Project | `#EFF6FF` | `#1D4ED8` | `#BFDBFE` |
| GSD | `#F5F3FF` | `#6D28D9` | `#DDD6FE` |

---

## Typography

### Font Family

| Token | Value | Usage |
|-------|-------|-------|
| `font-sans` | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | All UI text |
| `font-mono` | `'JetBrains Mono', 'SF Mono', 'Fira Code', monospace` | Cost values, durations, token counts |

### Size Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `text-page-title` | 20px | 600 (semibold) | 28px | Page titles ("Board", "Cron Jobs") |
| `text-section-heading` | 16px | 600 (semibold) | 24px | Section headings, column headers |
| `text-card-title` | 14px | 500 (medium) | 20px | Card titles, list item names |
| `text-body` | 14px | 400 (regular) | 20px | Body text, descriptions |
| `text-caption` | 12px | 400 (regular) | 16px | Metadata, timestamps, skill labels |
| `text-badge` | 11px | 500 (medium) | 14px | Status badges, level badges |
| `text-stat-number` | 24px | 600 (semibold) | 32px | Stats bar numbers |
| `text-stat-label` | 12px | 400 (regular) | 16px | Stats bar labels |

---

## Spacing Scale

Base unit: 4px. All spacing values are multiples of 4.

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Inline gaps (icon to text), badge internal padding vertical |
| `space-2` | 8px | Between related items (card title to metadata), badge internal padding horizontal |
| `space-3` | 12px | Card internal element spacing, input padding |
| `space-4` | 16px | Card padding, column header padding, nav item padding |
| `space-5` | 20px | Between form fields |
| `space-6` | 24px | Column gap, section spacing |
| `space-8` | 32px | Page top/bottom margin, large section gaps |
| `space-10` | 40px | Page left/right margin |
| `space-12` | 48px | Major section breaks |

### Specific Spacing

| Context | Value |
|---------|-------|
| Page margin (left/right) | 40px (`space-10`) |
| Page margin (top) | 32px (`space-8`) |
| Card padding | 16px (`space-4`) |
| Card gap (between cards in column) | 8px (`space-2`) |
| Column gap (between columns) | 24px (`space-6`) |
| Sidebar width | 240px |
| Sidebar padding | 16px (`space-4`) |
| Nav item height | 36px |
| Nav item gap | 4px (`space-1`) |
| Stats bar height | 72px |
| Stats bar card gap | 16px (`space-4`) |

---

## Component Styles

### Card

| Property | Value |
|----------|-------|
| Background | `bg-card` (#FFFFFF) |
| Border | 1px solid `border-default` (#E5E7EB) |
| Border radius | 8px |
| Padding | 16px (`space-4`) |
| Shadow (resting) | `0 1px 2px rgba(0,0,0,0.05)` |
| Shadow (hover) | `0 4px 6px rgba(0,0,0,0.07)` |
| Border (hover) | 1px solid `border-hover` (#D1D5DB) |
| Transition | `all 150ms ease` |
| Status indicator | 3px left border in status colour |
| Cursor | `pointer` |

Card internal layout:
- Title: `text-card-title` (14px, medium, #111827)
- Row below title: level badge + skill label on the same line
- Bottom row: timestamp (left, muted) + cost (right, mono font)

### Button

**Primary:**

| Property | Value |
|----------|-------|
| Background | `accent-primary` (#3B82F6) |
| Background (hover) | `accent-primary-hover` (#2563EB) |
| Text | `text-on-primary` (#FFFFFF) |
| Font | 14px, 500 (medium) |
| Padding | 8px 16px |
| Border radius | 6px |
| Border | none |
| Shadow | `0 1px 2px rgba(0,0,0,0.05)` |
| Height | 36px |

**Secondary:**

| Property | Value |
|----------|-------|
| Background | `bg-card` (#FFFFFF) |
| Background (hover) | `bg-hover` (#F9FAFB) |
| Text | `text-secondary` (#4B5563) |
| Border | 1px solid `border-default` (#E5E7EB) |
| All other properties | Same as primary |

**Ghost:**

| Property | Value |
|----------|-------|
| Background | transparent |
| Background (hover) | `bg-hover` (#F9FAFB) |
| Text | `text-muted` (#9CA3AF), hover: `text-secondary` (#4B5563) |
| Border | none |
| All other properties | Same as primary |

### Input

| Property | Value |
|----------|-------|
| Background | `bg-input` (#FFFFFF) |
| Border | 1px solid `border-default` (#E5E7EB) |
| Border (focus) | 1px solid `border-focus` (#3B82F6) + `0 0 0 3px rgba(59,130,246,0.1)` ring |
| Border radius | 6px |
| Padding | 8px 12px |
| Font | `text-body` (14px, regular) |
| Placeholder colour | `text-muted` (#9CA3AF) |
| Height (single-line) | 36px |
| Textarea min-height | 80px |

### Badge / Tag

**Status badge:**

| Property | Value |
|----------|-------|
| Background | Status colour tinted background (see Status Colours table) |
| Text | Corresponding status colour (full saturation) |
| Font | `text-badge` (11px, medium) |
| Padding | 2px 8px |
| Border radius | 4px |
| Text transform | capitalize |

**Level badge (Task / Project / GSD):**

| Property | Value |
|----------|-------|
| Background | See Level Badges table |
| Text | See Level Badges table |
| Border | 1px solid (see Level Badges table) |
| Font | `text-badge` (11px, medium) |
| Padding | 2px 8px |
| Border radius | 4px |

### Stats Bar

| Property | Value |
|----------|-------|
| Background | `bg-stats-bar` (#F9FAFB) |
| Height | 72px |
| Border bottom | 1px solid `border-light` (#F3F4F6) |
| Padding | 16px 40px (matches page margins) |
| Layout | Horizontal flex, items spaced evenly |

**Stat card (within stats bar):**

| Property | Value |
|----------|-------|
| Number | `text-stat-number` (24px, semibold, `text-primary`) |
| Label | `text-stat-label` (12px, regular, `text-muted`) |
| Layout | Number above label, left-aligned |
| Gap | 4px between number and label |
| Separator | 1px solid `border-light` between stat cards (vertical) |

Stats to display: Tasks Running (with `status-running` dot), Tasks Completed, Active Crons, Today's Spend (mono font for value).

### Slide-out Panel

| Property | Value |
|----------|-------|
| Width | 480px |
| Background | `bg-card` (#FFFFFF) |
| Shadow | `-4px 0 16px rgba(0,0,0,0.08)` |
| Overlay | `bg-overlay` (rgba(0,0,0,0.4)) |
| Animation | Slide in from right, 200ms ease-out |
| Header height | 56px |
| Header border bottom | 1px solid `border-default` (#E5E7EB) |
| Padding | 24px (`space-6`) |
| Close button | Top-right, ghost button with X icon |

### Nav Bar (Sidebar)

| Property | Value |
|----------|-------|
| Width | 240px |
| Background | `bg-sidebar` (#FFFFFF) |
| Border right | 1px solid `border-light` (#F3F4F6) |
| Logo/title area | 56px height, 16px padding, `text-section-heading` |
| Nav item height | 36px |
| Nav item padding | 8px 16px |
| Nav item font | `text-body` (14px, regular), `text-secondary` colour |
| Nav item (active) | `accent-primary-light` background (#EFF6FF), `accent-primary` text (#3B82F6), 2px left border `accent-primary` |
| Nav item (hover) | `bg-hover` background (#F9FAFB) |
| Nav item border radius | 6px |
| Nav item icon size | 18px, 8px gap to label |
| Section divider | 1px solid `border-light`, 16px vertical margin |

Navigation items: Board, Cron Jobs, Context, Brand, Skills. Client switcher dropdown at the bottom of the sidebar.

### Kanban Column

| Property | Value |
|----------|-------|
| Background | `bg-column` (#F3F4F6) |
| Border radius | 8px |
| Padding | 12px |
| Min width | 260px |
| Header | `text-section-heading` (16px, semibold) + count badge inline |
| Header padding bottom | 12px |
| Header border bottom | 1px solid `border-default` (#E5E7EB) |
| Card gap | 8px (`space-2`) |
| Drop zone (drag active) | 2px dashed `accent-primary` (#3B82F6) border, `accent-primary-light` background |
| Overflow | Vertical scroll, hidden scrollbar |

### Table (Cron Jobs View)

| Property | Value |
|----------|-------|
| Header background | `bg-stats-bar` (#F9FAFB) |
| Header text | `text-caption` (12px, medium, uppercase, `text-muted`) |
| Header padding | 12px 16px |
| Row background | `bg-card` (#FFFFFF) |
| Row border bottom | 1px solid `border-light` (#F3F4F6) |
| Row padding | 12px 16px |
| Row hover | `bg-hover` (#F9FAFB) |
| Cell alignment | Left-aligned text, right-aligned numbers |

---

## States

### Empty State

| Property | Value |
|----------|-------|
| Layout | Centred vertically and horizontally in content area |
| Icon | Outline-style, 48px, `text-muted` colour (#9CA3AF) |
| Heading | `text-section-heading` (16px, semibold, `text-primary`) |
| Description | `text-body` (14px, regular, `text-muted`), max-width 320px, centred |
| Action | Primary button below description, 16px gap |

Examples:
- Board empty: "No tasks yet" + "Describe what you need done" + input field
- Cron Jobs empty: "No scheduled jobs" + "Set up recurring tasks from the board"
- Column empty: No message, just empty space (columns are never truly "empty state" -- they exist but have no cards)

### Loading State

| Property | Value |
|----------|-------|
| Pattern | Skeleton placeholders (not spinners) |
| Skeleton colour | `#E5E7EB` with shimmer animation |
| Shimmer | Left-to-right gradient sweep, 1.5s duration, infinite |
| Card skeleton | Same dimensions as a real card, with 3 rectangular blocks (title, badge line, timestamp line) |
| Stats skeleton | Same dimensions as stat cards, with 2 rectangular blocks (number, label) |

### Error State

| Property | Value |
|----------|-------|
| Background | `status-error` tinted (#FEF2F2) |
| Border | 1px solid #FCA5A5 |
| Border radius | 8px |
| Padding | 16px |
| Icon | Exclamation circle, `status-error` (#EF4444), 20px |
| Heading | `text-card-title` (14px, medium, `status-error`) |
| Description | `text-body` (14px, regular, `text-secondary`) |
| Retry button | Secondary button style |

### Interactive States

| Element | Hover | Focus | Active |
|---------|-------|-------|--------|
| Card | Border -> `border-hover`, shadow -> hover shadow | -- | -- |
| Button (primary) | Background -> `accent-primary-hover` | Ring: `0 0 0 3px rgba(59,130,246,0.15)` | Scale 0.98 |
| Button (secondary) | Background -> `bg-hover` | Ring: `0 0 0 3px rgba(59,130,246,0.1)` | Scale 0.98 |
| Nav item | Background -> `bg-hover` | Ring: inner | -- |
| Input | -- | Border -> `border-focus` + ring | -- |
| Table row | Background -> `bg-hover` | -- | -- |
| Badge | -- | -- | -- |

### Running Task Indicator

| Property | Value |
|----------|-------|
| Dot | 8px circle, `status-running` (#3B82F6) |
| Animation | Pulse: scale 1 -> 1.3 -> 1, opacity 1 -> 0.5 -> 1, 2s infinite |
| Card border-left | 3px solid `status-running` (#3B82F6) |
| Position | Dot appears left of status badge text |

---

## Icons

Use outline-style icons (Lucide or Heroicons Outline). 18px default size for nav, 16px for inline, 48px for empty states.

| Context | Icon Suggestion |
|---------|----------------|
| Board | `layout-kanban` or `columns` |
| Cron Jobs | `clock` |
| Context | `brain` or `file-text` |
| Brand | `palette` or `megaphone` |
| Skills | `zap` or `puzzle` |
| Task level | -- (use text badge, no icon) |
| Running status | Pulsing dot (custom, not icon) |
| Cost | `dollar-sign` (12px, inline) |
| Duration | `clock` (12px, inline) |
| Close panel | `x` |
| Error | `alert-circle` |
| Empty state | Context-specific outline icon |

---

## Usage in Stitch Prompts

When writing a Stitch prompt for any Command Centre view, include:

1. **Reference this file:** "Following the Command Centre design language..."
2. **Colours:** Copy the exact hex values from the palette tables
3. **Typography:** Reference the token name and values (e.g., "card titles use Inter 14px medium weight #111827")
4. **Spacing:** Use the specific pixel values from the spacing scale
5. **Components:** Describe components using the styles defined here (e.g., "cards with 8px border-radius, 1px #E5E7EB border, 16px padding, subtle 0 1px 2px rgba(0,0,0,0.05) shadow")
6. **States:** Include status colour mapping and interactive states

This ensures all view prompts produce visually consistent designs without repeating the full design specification in each prompt.
