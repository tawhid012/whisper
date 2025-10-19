# Whispr Design Guidelines

## Design Approach
**System:** Minimal Dark Design inspired by privacy-focused applications (Signal, ProtonMail)
**Rationale:** Utility tool prioritizing security, trust, and simplicity. Dark mode emphasizes focus and modern aesthetic while reducing eye strain.

## Core Design Principles
1. **Trust Through Simplicity:** Clean, distraction-free interface reinforces security
2. **Progressive Disclosure:** Show only what's needed at each step
3. **Instant Feedback:** Clear visual confirmation for all actions

## Color Palette

**Dark Mode (Primary):**
- Background Primary: 217 33% 7%
- Background Secondary: 217 33% 10%
- Background Elevated: 217 33% 13%
- Text Primary: 210 40% 98%
- Text Secondary: 217 19% 60%
- Accent/Primary: 217 91% 60% (vibrant blue for trust/security)
- Success: 142 76% 45%
- Danger/Expired: 0 65% 51%

## Typography
- **Font Family:** 'Inter' from Google Fonts (fallback: system-ui, sans-serif)
- **Heading (h1):** 2.5rem/3rem, weight 700, tight letter-spacing
- **Body:** 1rem/1.5rem, weight 400
- **Button Text:** 0.875rem, weight 600, uppercase tracking-wide
- **Footer:** 0.75rem, weight 400

## Layout System
**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16 for consistency
- Container: max-w-2xl centered with px-4
- Vertical rhythm: gap-6 between major sections, gap-4 within components
- Component padding: p-8 for cards, p-4 for inputs

## Component Library

**A. Message Creation Card**
- Elevated dark card with subtle border (border-white/10)
- Rounded corners (rounded-xl)
- Padding: p-8
- Components inside:
  - Header: "Create Secret Message" (text-2xl font-bold)
  - Subtext: Security reminder in muted color
  - Textarea: Full-width, min-height 150px, rounded-lg, dark background with lighter border on focus
  - Character count indicator (text-sm, muted)
  - Primary CTA button: Full-width, accent blue, rounded-lg, py-3

**B. Link Generated State**
- Success card with green accent border-l-4
- Display generated link in monospace font within a code-like box
- Copy button: Secondary style with clipboard icon (from Heroicons)
- "Create Another" link below

**C. Message Display Page**
- Centered card with message content
- Animated reveal (fade-in)
- Self-destruct countdown visual (optional animation)
- Message displayed in elevated card with max-width prose

**D. Expired State**
- Centered message with ghost emoji 💨
- Muted text explaining expiration
- "Create Your Own" CTA

**E. Navigation/Header**
- Minimal: Logo/wordmark "Whispr" (left), no complex nav needed
- Height: h-16, border-b with subtle divider

**F. Footer**
- Fixed to bottom or static at page end
- Text-center, text-sm, muted color
- "Built with ❤️ by Tawhid Laskar"

## Interactions & States

**Buttons:**
- Primary: Accent blue background, white text, subtle shadow, hover: brightness-110
- Secondary/Outline: Transparent with border, hover: background-white/5
- Disabled: Opacity-50, cursor-not-allowed

**Textarea:**
- Default: Background secondary, border-white/10
- Focus: Border-accent, ring-2 ring-accent/20
- Error: Border-danger with red ring

**Copy Button:**
- Default state with icon
- Success state: Check icon + "Copied!" text (2s timeout)

## Responsive Behavior
- Mobile-first approach
- Breakpoint at md (768px) for wider screens
- Card padding reduces to p-6 on mobile
- Typography scales down by 0.125rem on mobile

## Animation Guidelines
**Use Sparingly:**
- Fade-in on message reveal (300ms ease)
- Success state transitions (200ms)
- Copy button feedback (100ms)
- NO complex scroll animations or page transitions

## Images
**No hero image required** - this is a utility tool, not a marketing page. Focus remains on the functional interface. If decorative elements are needed, use subtle geometric patterns or gradients in the background (very low opacity).