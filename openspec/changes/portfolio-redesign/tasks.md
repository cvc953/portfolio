# Tasks: Portfolio Redesign with i18n (ES/EN)

## Phase 1: Foundation — Content Files

- [x] 1.1 Create `translations/es.json` with all Spanish UI text
      - Structure: nav, hero, about, projects, experience, contact, footer, languages
      - Include all text from index.html and script.js
      - Reference design.md Section 4.3 for exact JSON structure
      - Keys must match en.json exactly (no missing keys)

- [x] 1.2 Create `translations/en.json` with all English UI text
      - Mirror structure of es.json exactly
      - Translate: "Sobre mí" → "About", "Proyectos" → "Projects", etc.
      - Hero title: "I build clear and bold digital experiences."
      - Hero role: "Mobile Developer" (NOT "Junior")
      - Contact: "Let's talk?" / "Tell me about your project..."

- [x] 1.3 Create `data/projects.json` with bilingual project data
      - Structure: `{"es": {"projects": [...]}, "en": {"projects": [...]}}`
      - Include all 5 projects from script.js (Avas Eto, Local Player, TimeLyr, EduProjects, Monochrome)
      - Add impact statements for each project (see below)
      - Each project: title, description, impact, tags, year, role, links

**Impact statements for projects:**
- Avas Eto: "+5K verified downloads" / "+5K descargas verificadas"
- Local Player: "Side project exploring audio APIs" / "Proyecto personal explorando APIs de audio"
- TimeLyr: "Featured in Flutter Weekly #312" / "Destacado en Flutter Weekly #312"
- EduProjects: "Portfolio project demonstrating full-stack skills" / "Proyecto portafolio demostrando habilidades full-stack"
- Monochrome (fork): "Open source contribution" / "Contribución open source"

## Phase 2: i18n Module

- [x] 2.1 Create `i18n.js` with IIFE singleton pattern
      - Location: `/i18n.js`
      - Methods: `init()`, `t(key)`, `setLanguage(lang)`, `getLanguage()`, `detectLanguage()`
      - localStorage key: `"preferred-lang"` (NOT "preferred-language" — match design exactly)
      - Dot-notation parsing for keys: `t("hero.title")` → `translations[currentLang].hero.title`
      - Missing keys return empty string `""` (no errors thrown)
      - Reference design.md Section 3.3 for full API contract

- [x] 2.2 Implement browser language detection in i18n.js
      - Parse `navigator.language` (e.g., "es-ES" → "es", "en-US" → "en")
      - Default to Spanish for unsupported languages
      - Run on init() if no stored preference

- [x] 2.3 Implement localStorage persistence in i18n.js
      - Read `preferred-lang` on init()
      - Write to `preferred-lang` on setLanguage()
      - Handle missing localStorage gracefully (SSR-safe)

- [x] 2.4 Implement cross-tab sync via StorageEvent in i18n.js
      - Listen to `window.addEventListener("storage", handler)`
      - On storage change, call `setLanguage(newValue)` to sync

## Phase 3: Spanish HTML Updates (index.html)

- [x] 3.1 Remove "Junior Developer" from index.html line 58
      - Change: `<h3>Junior Developer</h3>` → `<h3>Desarrollador Mobile</h3>`
      - Also update translations: do NOT include "Junior" anywhere in es.json or en.json

- [x] 3.2 Add hreflang tags to `<head>` section (before `</head>`)
      ```html
      <link rel="canonical" href="https://cristianvillalobos.com/">
      <link rel="alternate" hreflang="es" href="https://cristianvillalobos.com/">
      <link rel="alternate" hreflang="en" href="https://cristianvillalobos.com/en/">
      <link rel="alternate" hreflang="x-default" href="https://cristianvillalobos.com/">
      ```

- [x] 3.3 Add language toggle buttons to header
      - After the nav links, before the CTA button
      - HTML:
        ```html
        <div class="lang-toggle">
          <button class="lang-btn active" data-lang="es">ES</button>
          <span class="lang-divider">|</span>
          <button class="lang-btn" data-lang="en">EN</button>
        </div>
        ```
      - Add onclick handlers: `onclick="i18n.setLanguage('es')"` and `onclick="i18n.setLanguage('en')"`

- [x] 3.4 Add GitHub link to hero section
      - After the chips list, add:
        ```html
        <div class="hero-links">
          <a href="https://github.com/cvc953" target="_blank" rel="noreferrer" class="ghost github-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            cvc953
          </a>
        </div>
        ```

- [x] 3.5 Add `data-i18n` attributes to static text elements
      - Nav links: `<a href="#sobre-mi" data-i18n="nav.about">Sobre mí</a>`
      - Hero text: `<p class="eyebrow" data-i18n="hero.eyebrow">Portafolio 2026</p>`
      - All section headings and labels
      - Footer text

- [x] 3.6 Load i18n.js before script.js in HTML
      - Add `<script src="i18n.js"></script>` before `<script src="script.js"></script>`
      - Add i18n.init() call in script.js before DOM manipulation

## Phase 4: English Version (en/)

- [x] 4.1 Create `en/` directory
      - `mkdir -p en/`

- [x] 4.2 Create `en/index.html` — complete English version
      - Set `<html lang="en">` attribute
      - Mirror Spanish index.html structure exactly
      - Add hreflang tags with same URLs (all versions point to all versions)
      - Load `../i18n.js` and call `i18n.setLanguage('en', false)` on load
      - All visible text in English
      - Link back to Spanish version: `<a href="../" class="lang-link">Ver en Español</a>`

- [x] 4.3 Add meta tags for English version
      - `<meta name="description" content="Professional portfolio: featured projects, experience and contact.">`
      - `<meta property="og:locale" content="en_US">`
      - `<meta property="og:title" content="Portfolio • Cristian Villalobos">`
      - `<meta property="og:description" content="Professional portfolio...">`

## Phase 5: Script.js Integration

- [x] 5.1 Refactor script.js to load projects from JSON
      - Remove hardcoded `projects` and `experience` arrays
      - Add fetch for `/data/projects.json`
      - Parse language from URL or i18n.getLanguage()
      - Use correct language's projects array

- [x] 5.2 Add impact statement display in project cards
      - In `createProjectCard()`: add impact line below description
      - HTML: `<p class="impact">${project.impact}</p>`

- [x] 5.3 Wire i18n translation to static elements
      - In script.js init: call `i18n.t()` for all `data-i18n` elements
      - On language change: re-apply translations to updated content

- [x] 5.4 Listen for i18n language changes to update content
      - Listen to custom event or storage changes
      - Re-render project cards and timeline with new language

## Phase 6: Styling Updates (styles.css)

- [x] 6.1 Add `.lang-toggle` styles
      - Display: flex, align-items: center, gap: 4px
      - Match existing `.cta` button sizing
      - Active state: highlight current language (e.g., cyan accent color)
      - Separator: `| ` with muted color

- [x] 6.2 Add `.lang-btn` button styles
      - Background: transparent
      - Border: none
      - Cursor: pointer
      - Hover: slight color change
      - Active state: accent color, font-weight: 600

- [x] 6.3 Add `.hero-links` and `.github-link` styles
      - Display: flex or inline-flex
      - Match `.ghost` button style
      - Include SVG icon inline
      - Ensure touch target ≥ 44px

- [x] 6.4 Add `.impact` text styles for project cards
      - Smaller font-size than description
      - Accent color or highlight treatment
      - Margin-bottom to separate from meta info

- [x] 6.5 Mobile responsive adjustments
      - Hide or compact toggle on small screens
      - Ensure hero section stacks properly
      - Test at 320px viewport width

## Phase 7: Testing & Verification

- [x] 7.1 Test Spanish version loads correctly (local file)
      - Open index.html in browser
      - Verify all sections display Spanish text
      - Verify no "Junior" text appears anywhere
      - Open DevTools console: no errors

- [x] 7.2 Test English version loads correctly
      - Open en/index.html in browser
      - Verify all sections display English text
      - Verify hreflang tags present in source

- [x] 7.3 Test language toggle (if implemented client-side)
      - Click EN button in Spanish page
      - Verify content updates without full reload
      - Verify URL updates to /en/ via History API
      - Verify localStorage stores preference

- [x] 7.4 Verify "Junior Developer" is gone
      ```bash
      grep -ri "junior" /home/christian/potfolio/ --include="*.html" --include="*.js" --include="*.json"
      ```
      Expected: no matches

- [x] 7.5 Verify all links are functional
      - Project GitHub links open correctly
      - LinkedIn link: https://www.linkedin.com/in/cristian-villalobos-cuadrado-0a4672276
      - Email link: mailto:cvcorporation05@gmail.com
      - GitHub link: https://github.com/cvc953

- [x] 7.6 Mobile responsive test
      - Resize browser to 375px (iPhone width)
      - Verify toggle button is accessible
      - Verify hero section doesn't break
      - Verify project cards stack correctly

- [x] 7.7 SEO verification
      - View source of index.html
      - Verify canonical URL present
      - Verify all 4 hreflang tags present (es, en, x-default)
      - Verify og:locale is "es_ES" for Spanish page

## Phase 8: Deployment Prep

- [ ] 8.1 Update Cloudflare Workers config if needed
      - Verify wrangler.jsonc serves /en/ directory correctly
      - Ensure hreflang URLs match production domain exactly

- [ ] 8.2 Verify sitemap.xml includes both language versions
      - Check if sitemap.xml exists
      - Add entries for / and /en/ if missing

- [ ] 8.3 Create git commit for i18n changes
      - Stage: index.html, en/index.html, i18n.js, script.js, styles.css
      - Stage: translations/es.json, translations/en.json, data/projects.json
      - Commit message: "feat: add bilingual support (ES/EN) with i18n module"

---

## Task Summary

| Phase | Tasks | Focus |
|-------|-------|-------|
| Phase 1 | 3 | Foundation — Content Files |
| Phase 2 | 4 | i18n Module |
| Phase 3 | 6 | Spanish HTML Updates |
| Phase 4 | 3 | English Version |
| Phase 5 | 4 | Script.js Integration |
| Phase 6 | 5 | Styling Updates |
| Phase 7 | 7 | Testing & Verification |
| Phase 8 | 3 | Deployment Prep |
| **Total** | **35** | |

## Implementation Order

1. **Phase 1** (Content files) — No dependencies, creates foundation
2. **Phase 2** (i18n.js) — Depends on JSON structure from Phase 1
3. **Phase 3** (Spanish HTML) — Standalone, but needs i18n.js reference
4. **Phase 4** (English version) — Mirrors Phase 3
5. **Phase 5** (Script.js) — Integrates i18n with existing code
6. **Phase 6** (Styling) — Minimal CSS work, can parallelize
7. **Phase 7** (Testing) — Run after all implementation
8. **Phase 8** (Deployment) — Final prep

## Dependencies

```
Phase 1 (JSON files)
    │
    ▼
Phase 2 (i18n.js) ← uses JSON structure
    │
    ├──► Phase 3 (Spanish HTML) ← loads i18n.js
    │
    └──► Phase 5 (Script.js) ← uses i18n.js
              │
              ▼
         Phase 7 (Testing)
```

## Files Created/Modified

| File | Action |
|------|--------|
| `translations/es.json` | Create |
| `translations/en.json` | Create |
| `data/projects.json` | Create |
| `i18n.js` | Create |
| `index.html` | Modify |
| `en/index.html` | Create |
| `script.js` | Modify |
| `styles.css` | Modify |

## Next Step

Ready for `sdd-apply` — implement tasks in dependency order (Phase 1 first).
