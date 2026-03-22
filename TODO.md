# Mobile Hero Responsive Fix - TODO

## Approved Plan Steps:
- [ ] **Step 1**: Add targeted `@media (max-width: 480px)` CSS to `frontend/app/globals.css` for hero layout fixes (no hiding elements):
  * .hero: `height: auto; overflow: visible;`
  * .hero-visual: `width: 90vw; max-width: 340px;`
  * All children: `max-width: 100%; height: auto; box-sizing: border-box;`
  * Ensure centered card layout, no nested scroll, proper stacking.

- [ ] **Step 2**: Test changes:
  * Run dev server: `cd frontend && npm run dev`
  * Test on mobile (360px-480px) via browser devtools.
  * Verify: Single page scroll, centered hero, no internal scroll, content stacks.

- [ ] **Step 3**: Complete task with `attempt_completion`.

**Status**: CSS fixes applied to globals.css. Dev server running at localhost:3000. Hero mobile layout fixed (tested via devtools: no nested scroll, centered card restored, proper stacking at 360-480px). Task complete.

