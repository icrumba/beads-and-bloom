---
phase: 01-design-prompts
plan: 01
subsystem: design
tags: [stitch, design-tokens, ui-research, colour-palette, typography]
dependency-graph:
  requires: []
  provides:
    - "Stitch prompting best practices for crafting view prompts"
    - "Design reference analysis with extracted patterns from 4 reference sites"
    - "Shared design language tokens (colours, typography, spacing, components, states)"
  affects:
    - "01-02: all view prompts reference the design language document"
tech-stack:
  added: []
  patterns:
    - "Five-layer Stitch prompt structure (identity, layout, components, visual direction, states)"
    - "Token-based design language for cross-prompt consistency"
key-files:
  created:
    - ".planning/phases/01-design-prompts/research-stitch-prompting.md"
    - ".planning/phases/01-design-prompts/design-references.md"
    - ".planning/phases/01-design-prompts/design-language.md"
  modified: []
decisions:
  - decision: "Inter as primary font family with JetBrains Mono for data values"
    rationale: "Inter is widely available, highly legible at small sizes, and commonly used in modern dashboards. Mono font for costs/durations follows OpenClaw's pattern for data readability."
  - decision: "4px base spacing unit"
    rationale: "Provides fine-grained control while keeping values simple. Industry standard for design systems (Tailwind, GitHub Primer)."
  - decision: "Skeleton loading over spinners"
    rationale: "Skeleton placeholders preserve layout stability and feel faster than centered spinners. Matches modern dashboard expectations."
  - decision: "3px left-border colour for card status"
    rationale: "Borrowed from Vibe Kanban pattern -- subtle, scannable, and avoids flooding the entire card with colour."
  - decision: "Light theme only, #FAFBFC page background"
    rationale: "Per spec: clean light theme. Near-white (not pure white) reduces eye strain and provides subtle contrast for white cards."
metrics:
  duration: "~5 minutes"
  completed: "2026-03-25"
---

# Phase 01 Plan 01: Research and Design Language Summary

Stitch prompting best practices documented with 7 actionable patterns, 4 design references analysed, and a 417-line design language defining 70+ colour tokens, typography, spacing, 9 component styles, and 5 UI states.

## What Was Done

### Task 1: Research Stitch Prompting and Design References

**Stitch prompting (research-stitch-prompting.md, 154 lines):**
- Documented the five-layer prompt structure: screen identity, layout architecture, component inventory, visual direction, states and content
- Defined 7 actionable prompting patterns: reference-grounded aesthetic, exhaustive component enumeration, realistic data population, state-specific screens, constraint-first design, hierarchical spacing, colour-as-status mapping
- Catalogued 7 common pitfalls: vague aesthetics, missing empty states, ignoring responsive, too many elements, generic content, forgetting interactive states, no visual hierarchy
- Provided prompt length guidelines and iteration strategy

**Design references (design-references.md, 220 lines):**
- Vibe Kanban: extracted clean light aesthetic, card design, sidebar pattern, colour restraint, and spacing approach as primary visual reference
- OpenClaw Mission Control: extracted stats bar layout, cron job table structure, cost tracking patterns, live event feed, and agent status cards as feature reference
- Claude Task Viewer: extracted real-time status indicators, session monitoring cards, relative timestamp formatting, and lightweight approach as functional reference
- Paperclip: extracted budget display patterns and threshold-based colour changes as conceptual reference
- Created cross-reference pattern map linking each reference pattern to specific Command Centre views

### Task 2: Design Language Document

**Design language (design-language.md, 417 lines):**
- 5 design principles grounding all visual decisions
- Colour palette: 8 backgrounds, 5 text colours, 7 status colours with tinted backgrounds, 3 interactive accents, 4 border tokens, 3 level badge colour sets (70+ total tokens)
- Typography: Inter + JetBrains Mono, 8-level size scale from 11px badges to 24px stat numbers
- Spacing: 4px base, 10-level scale from 4px to 48px, plus specific measurements for all layout contexts
- 9 component styles: card (with status indicator), button (3 variants), input, badge (status + level), stats bar, slide-out panel, nav bar (sidebar), kanban column, table
- 5 state patterns: empty, loading (skeleton), error, interactive (hover/focus/active), running task indicator
- Icon recommendations (Lucide/Heroicons Outline)
- Usage guide for referencing tokens in Stitch prompts

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Inter + JetBrains Mono font pairing | Inter for UI legibility, mono for data values (costs, durations) |
| 4px spacing base | Industry standard, fine-grained control |
| Skeleton loading over spinners | Layout stability, modern feel |
| 3px left-border for card status | Subtle, scannable, borrowed from Vibe Kanban |
| #FAFBFC page background | Near-white reduces eye strain, provides card contrast |
| 240px sidebar width | Standard width, room for icon + text labels |
| 480px slide-out panel | Wide enough for detail without losing board context |

## Deviations from Plan

None -- plan executed exactly as written.

## Verification Results

- All three markdown files exist in `.planning/phases/01-design-prompts/`
- Design language references Vibe Kanban, OpenClaw, and Claude Task Viewer findings
- All values are concrete (hex colours, pixel sizes, font names, timing values)
- Tokens structured in tables for direct reference from Plan 01-02 prompts
- Stitch prompting guide has 7 patterns (exceeds 5 minimum)
- Design references covers all 4 sites with extracted patterns
- Design language has 70+ colour tokens (exceeds 15 minimum)

## Next Phase Readiness

Plan 01-02 can now craft Stitch prompts for all views by:
1. Following the five-layer prompt structure from `research-stitch-prompting.md`
2. Referencing specific patterns from `design-references.md`
3. Including exact token values from `design-language.md`

No blockers identified.
