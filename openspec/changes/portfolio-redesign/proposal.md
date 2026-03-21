# Proposal: Portfolio Redesign with i18n (ES/EN)

## Intent

Enable bilingual portfolio for global recruiter reach by adding English version alongside Spanish. Remove conversion-killing "Junior Developer" self-label and reframe as "Mobile Developer" with impact-focused project descriptions. This addresses the core problem: Spanish-only content limits recruiter reach to LATAM market, and "Junior" labels cause automatic filtering before content is read.

## Scope

### In Scope
- Create `translations/` folder with ES/EN JSON files
- Build `i18n.js` module for language switching
- Create `/en/` directory with English version of index.html
- Add hreflang tags and language detection
- Remove "Junior Developer" label, reframe as "Mobile Developer"
- Add impact statements to projects (even estimated metrics)
- Add GitHub/social links to hero section

### Out of Scope
- Adding more than 2 languages (EN/ES only for now)
- Build step / CI/CD pipeline
- Analytics integration
- Blog section

## Approach

### URL Structure
- Spanish (default): `cristianvillalobos.com/`
- English: `cristianvillalobos.com/en/`

### Implementation Details

1. **Translations**: Create `translations/es.json` and `translations/en.json` with all UI text (hero, about, projects, experience, contact sections, navigation, and footer).

2. **i18n.js**: Module that:
   - Detects browser language on first visit (navigator.language)
   - Stores preference in localStorage
   - Provides `t(key)` function for translations
   - Handles URL-based language routing (/ vs /en/)
   - Syncs language preference across tabs

3. **HTML Updates**:
   - Add `<link rel="alternate" hreflang="es" href="/">`
   - Add `<link rel="alternate" hreflang="en" href="/en/">`
   - Add `<link rel="alternate" hreflang="x-default" href="/">`
   - Add language toggle button (ES | EN) in header
   - Update `lang` attribute dynamically

4. **Content Improvements**:
   - Hero: "Mobile Developer | Flutter & Kotlin" instead of "Junior Developer"
   - Projects: Add impact lines like "+10K songs played", "4.8★ rating", "#1 Trending on GitHub"
   - Add GitHub stats pill to hero section
   - Reframe generic descriptions with concrete outcomes

### File Structure After Changes

```
/
├── index.html              ← Spanish (updated with hreflang, toggle)
├── en/
│   └── index.html          ← English version (mirrors ES structure)
├── translations/
│   ├── es.json             ← Spanish content (all UI text)
│   └── en.json             ← English content (all UI text)
├── i18n.js                 ← Language switching logic module
├── script.js               ← Updated to use translations
└── styles.css              ← Minimal changes (toggle button styling)
```

### Technical Decisions

| Decision | Rationale |
|----------|-----------|
| JSON content files | Maintainable, easy to sync, no build step |
| Dual HTML files (/ and /en/) | Simple, SEO-friendly, no routing logic needed |
| localStorage + browser detection | Seamless UX, respects user preference |
| hreflang x-default | Handles edge cases (no language preference) |

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `index.html` | Modified | hreflang tags, language toggle, content refactor (remove Junior, add impact) |
| `en/index.html` | New | Complete English version mirroring ES structure |
| `translations/es.json` | New | All Spanish UI text structured by section |
| `translations/en.json` | New | All English UI text (mirror of ES structure) |
| `i18n.js` | New | Language detection, storage, t() function, URL routing |
| `script.js` | Modified | Use translations instead of hardcoded ES text |
| `styles.css` | Modified | Language toggle button styling (minimal) |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Content drift between EN/ES | Medium | Keep JSON structures identical, add sync check script |
| SEO issues without proper hreflang | Low | Follow Google's hreflang specification exactly (mutual references) |
| JavaScript dependency for content | Low | Core content accessible even before JS loads (SSR-ready structure) |
| Dual maintenance burden | Medium | Shared structure between JSONs, updates in one place propagate conceptually |

## Rollback Plan

If issues arise:

1. Revert `index.html` to previous version: `git checkout HEAD -- index.html`
2. Delete new artifacts: `rm -rf translations/ i18n.js en/`
3. Revert `script.js` to original ES-only version: `git checkout HEAD -- script.js`
4. Revert `styles.css` changes: `git checkout HEAD -- styles.css`
5. Deploy previous commit if needed: `git revert HEAD`

## Dependencies

- None (pure static JS, no npm packages, no backend changes)
- Cloudflare Workers routing already configured for static hosting

## Success Criteria

- [ ] Both EN and ES versions load correctly (manual test)
- [ ] Language toggle switches content without page reload
- [ ] Browser language detection works (ES browser → Spanish default)
- [ ] hreflang tags present and correct (verify with Google Search Console)
- [ ] "Junior Developer" no longer appears anywhere (grep check)
- [ ] At least 3 projects have impact statements (metric + context)
- [ ] GitHub link visible in hero section
- [ ] Lighthouse SEO score ≥ 90
- [ ] All links functional (projects, contact, LinkedIn, GitHub)
- [ ] Mobile responsive (toggle usable on small screens)
