# Design system

Cairn's visual language is **calm, layered, and quiet**. This document captures the rules, tokens, and components.

## Contents

1. [Golden rules](#golden-rules)
2. [Surfaces & layering](#surfaces--layering)
3. [Themes](#themes)
4. [Typography](#typography)
5. [Spacing & rhythm](#spacing--rhythm)
6. [Motion](#motion)
7. [Iconography](#iconography)
8. [Components](#components)
9. [Accessibility](#accessibility)
10. [Brand](#brand)

---

## Golden rules

These are non-negotiable. They're enforced by code review, not lint.

1. **No glassmorphism.** No `backdrop-blur`, no translucent frosted panes.
2. **No border colors as decoration.** Borders, if used at all, are `border-[color:var(--hairline)]` only — never tinted.
3. **No blurry effects.** No `blur-*`, no `backdrop-blur-*`, no soft-focus.
4. **Minimal shadows.** Prefer flat. A single subtle elevation only (`.elev-1`). Never stacked. No colored glows.
5. **No emojis** in UI or code unless explicitly requested.

When separation is needed, use **background contrast** (`bg-surface-1` → `bg-surface-2` → `bg-surface-3`), **spacing**, or **weight**. Not borders. Not blur. Not shadow.

---

## Surfaces & layering

The whole UI is layered backgrounds, no borders.

| Token | Meaning | Typical use |
|---|---|---|
| `--bg`         | App background     | `<html>` |
| `--surface-1`  | Cards, panels      | Sidebar, modal, list item |
| `--surface-2`  | Nested / inputs    | Form fields, hover state of surface-1 |
| `--surface-3`  | Hovered / pressed  | Hover state of surface-2, pressed |
| `--hairline`   | Optional thin rule | One-pixel dividers between dense rows |

Tailwind utilities follow the CSS-var names: `bg-bg`, `bg-surface-1`, `bg-surface-2`, `bg-surface-3`.

### Text

| Token | Tailwind | Use |
|---|---|---|
| `--fg`        | `text-fg`        | Primary text |
| `--fg-muted`  | `text-fg-muted`  | Secondary copy, captions |
| `--fg-subtle` | `text-fg-subtle` | Tertiary, hints, "meta" rows |

### Status

| Token | Tailwind | Use |
|---|---|---|
| `--accent`     | `bg-accent`, `text-accent`, `text-accent-fg` | Primary actions, focused state |
| `--positive`   | `text-[color:var(--positive)]` | Success states |
| `--warning`    | `text-[color:var(--warning)]`  | At-risk, warnings |
| `--danger`     | `text-[color:var(--danger)]`   | Destructive |

---

## Themes

5 themes, each is just a CSS variable override on `[data-theme="…"]`. Components never hardcode colors — they reference tokens — so a theme change re-skins the entire app.

| Theme    | Mood | Default? |
|---|---|---|
| `obsidian` | Calm dark, purple accent | Yes |
| `paper`    | Soft light, parchment    | — |
| `oceanic`  | Deep teal                | — |
| `sunset`   | Warm brown / orange      | — |
| `forest`   | Deep green               | — |

All theme palettes use **OKLCH** for perceptual consistency across hues. Tokens are defined in [`app/globals.css`](../app/globals.css). The theme registry (id, label, swatch) is in [`lib/theme/themes.ts`](../lib/theme/themes.ts) and consumed by the switcher and onboarding wizard.

### Bootstrap (no flash)

A 4-line inline script in [`app/layout.tsx`](../app/layout.tsx) reads `localStorage` synchronously before paint and sets `<html data-theme="…">`. There is no light/dark flash on first load.

### Switching at runtime

[`<ThemeProvider>`](../components/theme/theme-provider.tsx) writes the chosen theme to localStorage and updates `document.documentElement.dataset.theme`. The transition is instant; nothing animated — the calm rule wins.

---

## Typography

| Family | Tailwind | Used for |
|---|---|---|
| Geist Sans (variable) | `font-sans`    | Body, UI |
| Geist Mono            | `font-mono`    | Numbers, kbds, code, timestamps |

### Scale

`12 / 14 / 16 / 20 / 24 / 32 / 48` — no in-between values. Tailwind defaults to these; we use bracket sizes for the page-specific values (`text-[15px]`, `text-[28px]`).

### Weight

`400` (default), `500` (medium — emphasis, labels), `600` (semibold — headlines), `700` (bold — hero only).

### Numbers

`tabular-nums` on every numeric column or counter so digits don't jitter.

---

## Spacing & rhythm

Tailwind defaults. Prefer `4 / 6 / 8 / 12 / 16 / 24`. Avoid odd values. Cards and modals favor `p-4` to `p-6`. The standard pad for list-item rows is `px-3 py-2.5`.

Vertical rhythm in long-form pages: `space-y-6` between major sections, `space-y-3` between cards.

---

## Motion

Library: **`motion`** (the maintained Framer Motion successor). Always import from `motion/react`.

### Durations

| Use | Duration |
|---|---|
| Micro (hover, press) | **150ms** |
| Default (tabs, presence) | **240ms** |
| Page-level transitions | **400ms** |

### Curve

The house easing is `cubic-bezier(0.22, 1, 0.36, 1)` — apply as `transition={{ ease: [0.22, 1, 0.36, 1] }}`. Springs are reserved for `layoutId` morphing.

### Patterns

| Pattern | Where |
|---|---|
| `layoutId` morphing | Active tab pill, theme-active ring, selected date in DatePicker |
| `<AnimatePresence>` enter/exit | Modals, command palette, focus mode, error toasts |
| `whileTap` | Buttons, milestone toggles |
| Stagger via `delay: i * 0.04` | Goal cards, leaderboard rows, projects grid |

### Reduced motion

`@media (prefers-reduced-motion: reduce)` in [`globals.css`](../app/globals.css) zeroes every animation and transition. No JS guard needed for new components.

---

## Iconography

`lucide-react` only. Two conventions:

- **Stroke**: `strokeWidth={1.75}` for body icons, `{2}` for buttons, `{2.25}` for emphasis (badge chips).
- **Size**: `12` (kbd-row inline), `13–14` (button icons), `16` (default), `18–22` (heading slots).

Logo and animated illustrations are hand-crafted SVG, themed via CSS vars. See [`components/brand/logo.tsx`](../components/brand/logo.tsx) and [`components/auth/auth-visual.tsx`](../components/auth/auth-visual.tsx).

---

## Components

### Primitives

Located in `components/ui/`. Custom-built (no Radix / shadcn dependency) so every prop is controlled and every visual obeys the golden rules.

| Component | What it does | File |
|---|---|---|
| `<Button>`        | Variants: `primary`, `secondary`, `ghost`. 3 sizes. Loading state. Tap animation. | [button.tsx](../components/ui/button.tsx) |
| `<Input>`         | Floating-label, leading icon, trailing slot, error/hint | [input.tsx](../components/ui/input.tsx) |
| `<Modal>`         | Focus-trapped, body-scroll-locked, mobile sheet on narrow viewports | [modal.tsx](../components/ui/modal.tsx) |
| `<Popover>`       | Anchor-positioned, viewport-clamped, outside-click + Esc to close | [popover.tsx](../components/ui/popover.tsx) |
| `<Select>`        | Typed-generic listbox with `layoutId` active state | [select.tsx](../components/ui/select.tsx) |
| `<DatePicker>`    | Month grid, prev/next, today, clear | [date-picker.tsx](../components/ui/date-picker.tsx) |
| `<TimePicker>`    | Scrolling hour/minute columns, configurable step | [time-picker.tsx](../components/ui/time-picker.tsx) |
| `<Markdown>`      | Minimal markdown → HTML renderer (~80 LOC) | [markdown.tsx](../components/ui/markdown.tsx) |
| `<ConfirmProvider>` + `useConfirm()` | Promise-based confirm dialogs (`if (await confirm(…))`) | [confirm.tsx](../components/ui/confirm.tsx) |
| `<PageHeader>` / `<PageBody>` / `<Empty>` | Standard page chrome | [page.tsx](../components/ui/page.tsx) |
| `<Divider>`       | Hairline separator with optional label | [divider.tsx](../components/ui/divider.tsx) |

**Native form controls are deliberately replaced.** No `<input type="date">`, no `<input type="time">`, no `<select>`. The custom primitives keep the look consistent across OSes and themes.

### Composition pattern

Pages keep their own layout markup; components handle interaction. A typical page is:

```tsx
<>
  <PageHeader icon={Icon} title="…" subtitle="…" actions={<Button …/>} />
  <PageBody>
    {/* filters or stats strip */}
    {empty ? <Empty …/> : <List items={…} />}
  </PageBody>
</>
```

---

## Accessibility

- **Keyboard**: every interactive element is reachable. Modals trap focus and return it on close. The command palette uses `aria-activedescendant` for the listbox highlight.
- **Reduced motion**: respected via CSS media query (no opt-in needed per component).
- **Color contrast**: at least 4.5:1 for body text on every theme. `text-fg` on `--bg`, `text-fg-muted` on `--surface-1`, etc. all clear AA.
- **Screen reader**: every icon button carries `aria-label`. Modals have `role="dialog"`, `aria-modal="true"`, and `aria-label`. Tabs use `role="tab"` + `aria-selected`.
- **Skip link**: hidden link in `(app)/layout.tsx` jumps to `#main` for keyboard users.
- **Forms**: floating labels are visible above the input when focused; placeholders never carry essential information.

---

## Brand

- **Name:** **Cairn** — a stack of stones marking a path on a trail. Signals: small steps, marked progress, finding your way.
- **Wordmark:** `cairn`, all lowercase, Geist Sans semibold, `tracking-tight`.
- **Mark:** a stroked partial circle with a center dot, drawn live via SVG with the accent color. See [`components/brand/logo.tsx`](../components/brand/logo.tsx).
- **Tone:** calm, direct, kind. Concrete. Honors silence.

### Voice in copy

Every empty state, error message, and CTA follows the [`STYLE`](../lib/ai/prompts.ts) block (which is also the AI assistant's system prompt):

- Concrete. Specifics over generalities.
- Short. Compact lists and headings only when they earn their keep.
- Markdown is fine — headings, bold, bullets, code. No emojis.
- If the system proposes new work, it labels it clearly as a suggestion.

The AI is held to the same voice as the UI. They sound like the same product.
