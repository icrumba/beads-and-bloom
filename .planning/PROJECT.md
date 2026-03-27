# Beads & Bloom E-Commerce Website

## What This Is

A mobile-friendly e-commerce website for Beads & Bloom, a handmade ocean-inspired jewelry brand founded by 13-year-old twins. The site lets customers browse products, place orders with Stripe checkout, and request custom color combinations. The founders receive order notifications via email, SMS, and an admin dashboard, and track fulfillment from new order through delivery.

## Core Value

Customers can browse, order, and pay for handmade jewelry on mobile — and the founders get notified and can track every order from placement to delivery.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Mobile-friendly product catalog with simple admin management
- [ ] Stripe payment processing for secure checkout
- [ ] Order notifications via email, SMS, and admin dashboard
- [ ] Customer database with contact info, order history, and custom request tracking
- [ ] Fulfillment status tracking (New → Making → Shipped → Delivered) for both ready-to-ship and made-to-order pieces
- [ ] Flat-rate shipping
- [ ] Custom color request option on products
- [ ] Running charity donation counter on homepage
- [ ] Clean, minimal design aesthetic — products front and center
- [ ] Founder story / about page with mission and charity info

### Out of Scope

- Native mobile app — web-first, mobile-responsive is sufficient for v1
- Calculated shipping by weight/location — flat rate keeps it simple
- User accounts / login for customers — guest checkout only for v1
- Blog or content section — focus on the shop experience
- Inventory management — small-batch handmade means manual tracking is fine for now
- Multi-currency / international checkout — domestic only for v1
- Live chat support — email/DM support is sufficient at this scale

## Context

- **Founders:** Twin 13-year-olds running a real business — the admin interface needs to be simple and intuitive
- **Current sales channels:** Instagram and Etsy — this is their first standalone website
- **Product range:** Heishi clay bead bracelets, pearl + charm pieces, gold chain necklaces with ocean-themed charms (sea turtles, starfish, seashells, plumeria flowers, crosses)
- **Order volume:** Small-batch handmade — not high volume, but needs to handle occasional spikes (holidays, viral posts)
- **Fulfillment model:** Mix of ready-to-ship and made-to-order (especially custom color requests)
- **Charity mission:** $1 from every sale goes to charity — this is core brand identity, not a marketing add-on
- **Brand voice:** Warm, charming teen energy that impresses adults — see brand_context/voice-profile.md
- **Target audience:** Moms/aunts (25-45) buying for themselves and daughters/nieces (8-15)

## Constraints

- **Tech stack**: Must work within the agentic-os project containment rule — all code inside `projects/briefs/beads-and-bloom-website/`
- **Mobile-first**: Primary audience shops on phones via Instagram links — mobile experience is the priority
- **Stripe**: Payment processing must use Stripe (user-specified requirement)
- **Simplicity**: Admin interface must be simple enough for 13-year-olds to use confidently
- **Hosting**: Needs to be deployable to a standard hosting platform (Vercel, Netlify, etc.)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Flat-rate shipping | Simplicity for small-batch handmade business | — Pending |
| Guest checkout only (no customer accounts) | Reduces complexity for v1, customers don't need accounts to buy jewelry | — Pending |
| All three notification channels (email, SMS, dashboard) | Founders want redundancy — never miss an order | — Pending |
| Clean minimal design over ocean-themed | Products should be the visual focus, not the site chrome | — Pending |
| Running charity counter | Builds trust and shows real impact — core to brand identity | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-27 after initialization*
