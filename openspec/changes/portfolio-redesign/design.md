# Design: Portfolio Redesign with i18n

## Technical Approach

URL-based bilingual portfolio (ES/EN) with JSON content files and vanilla JS i18n module, deployed as static files on Cloudflare Workers. Spanish is the default language served at `/`, English at `/en/`. Language preference is detected from browser settings on first visit, persisted to localStorage, and synchronized across tabs via the StorageEvent API.

The approach prioritizes:
- **SEO**: Separate URLs for each language, proper hreflang tags, canonical URLs, static HTML (no JS required for content)
- **Performance**: Static files served via CDN, minimal JS footprint, no build step
- **Simplicity**: Vanilla JS only, no frameworks, maintainable JSON structure
- **Accessibility**: lang attributes, semantic HTML, keyboard navigation preserved

## Architecture Decisions

### Decision: Dual HTML Files vs Single HTML with Dynamic Content

**Choice**: Dual HTML files (`/` and `/en/`)
**Alternatives considered**: Single HTML with JS content swap, URL hash routing (#/en/)

**Rationale**: 
- SEO optimization — each URL has self-contained content, crawlers see complete pages
- Simpler caching — Cloudflare Workers serves static files directly, no edge runtime needed
- No flash of untranslated content — HTML arrives pre-rendered in correct language
- Easier hreflang validation — each file has its own `lang` attribute and canonical
- Spec requirement: "The `<html>` element SHALL have `lang="es"` in the static HTML file"

The URL structure enables:
- `https://cristianvillalobos.com/` → Spanish version
- `https://cristianvillalobos.com/en/` → English version
- Language toggle uses History API (`pushState`) to switch without full page reload

---

### Decision: JSON Content Files vs Inline Translation Object

**Choice**: External JSON files (`/translations/es.json`, `/translations/en.json`) loaded dynamically

**Alternatives considered**: 
- Inline JS translation objects (increases main bundle size)
- Build-time translation extraction (adds complexity, breaks "no build step" goal)
- CMS or external API (overkill for static portfolio)

**Rationale**:
- Lazy loading — translations only fetched when needed (especially for non-default language)
- Clean separation — content separate from code, designers can edit without touching JS
- Mirror structure — identical key paths in both files ensures consistency
- Human-readable — JSON is easily versioned and audited
- Extensible — easy to add new languages (just duplicate and translate)

---

### Decision: i18n.js Module with Singleton Pattern

**Choice**: IIFE singleton module exported as `window.i18n`

```javascript
// i18n.js structure
const i18n = (() => {
  let currentLang = 'es';
  let translations = {};
  
  return {
    init() { /* detect + load */ },
    t(key) { /* dot-notation lookup */ },
    setLanguage(lang) { /* localStorage + DOM update + History API */ },
    getLanguage() { return currentLang; },
    detectLanguage() { /* navigator.language parsing */ }
  };
})();
```

**Alternatives considered**:
- ES6 module exports (breaks compatibility with plain `<script>` tags)
- Class-based i18n (more verbose, same functionality)
- Dependency injection (over-engineered for single-page static site)

**Rationale**:
- IIFE pattern encapsulates state, prevents global pollution
- `window.i18n` interface is simple and testable from console
- Module pattern supports lazy initialization without requiring bundler
- Methods are chainable and composable

---

### Decision: Projects Data in Separate JSON File

**Choice**: `/data/projects.json` with language-keyed structure

```json
{
  "es": { "projects": [...] },
  "en": { "projects": [...] }
}
```

**Alternatives considered**:
- Include projects in translation files (mixes UI text with content data)
- Hardcode in script.js (defeats i18n purpose)
- External API endpoint (adds latency, requires backend)

**Rationale**:
- Projects are content data, not UI strings — separation of concerns
- Both languages share the same project cards but with translated descriptions
- Single file to update project data, no code changes needed
- Maintains consistency: JSON structure mirrors how script.js expects the data

---

### Decision: No Framework/Library for i18n

**Choice**: Custom vanilla JS implementation

**Alternatives considered**:
- i18next (14KB minified + locale files, overkill for 2 languages)
- Intl API (good for numbers/dates, not arbitrary string translation)
- polyglot.js (9KB, adds dependency for simple use case)

**Rationale**:
- Spec rule: "No frameworks nuevos - mantener vanilla"
- Only need: key lookup, language detection, localStorage, History API
- ~50 lines of custom code vs 14KB library
- Full control over behavior (no surprises from library updates)

---

## Data Flow

### Language Detection Flow

```
Page Load
    │
    ▼
┌─────────────────────────┐
│ Check localStorage      │
│ key: "preferred-lang"   │
└───────────┬─────────────┘
            │
    ┌───────┴───────┐
    │ Has stored?   │
    └───────┬───────┘
      Yes   │   No
       │    │    │
       ▼    │    ▼
   Use it   │ ┌────────────────────┐
            │ │ navigator.language │
            │ └─────────┬──────────┘
            │           │
            │    ┌──────┴──────┐
            │    │ Parse code  │
            │    └──────┬──────┘
            │           │
            │    ┌──────┴──────┐
            │    │ Match:      │
            │    │ es-* → es  │
            │    │ en-* → en  │
            │    │ *    → es  │
            │    └─────────────┘
            │           │
            └───────────┴──────────► Set currentLang → load translations
```

### Translation Lookup Flow

```
t("hero.title")
    │
    ▼
Parse key ──→ ["hero", "title"]
    │
    ▼
translations[currentLang]
    │
    ▼
["hero"]["title"]
    │
    ├── Found ──→ Return string
    └── Not found ──→ Return ""
```

### Language Toggle Flow

```
User clicks "EN" toggle
    │
    ▼
i18n.setLanguage("en")
    │
    ├─► Update localStorage["preferred-lang"] = "en"
    │
    ├─► Fetch /translations/en.json (if not cached)
    │
    ├─► Update currentLang variable
    │
    ├─► Query DOM for [data-i18n] elements
    │
    ├─► Call t() for each element's data-i18n value
    │
    ├─► Push /en/ to History API (update URL without reload)
    │
    └─► Dispatch storage event (sync other tabs)
```

### Cross-Tab Synchronization Flow

```
Tab A: i18n.setLanguage("en")
    │
    ▼
localStorage.setItem("preferred-lang", "en")
    │
    ▼
Browser fires "storage" event
    │
    ▼
Tab B: window.addEventListener("storage", handler)
    │
    ▼
handler reads new value → i18n.setLanguage("en")
    │
    ▼
Tab B updates content to English
```

---

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `index.html` | Modify | Add hreflang tags, language toggle, data-i18n attributes, remove hardcoded Spanish text, update lang="es" |
| `en/index.html` | Create | Complete English version with lang="en", EN hreflang, EN content |
| `translations/es.json` | Create | All Spanish UI text organized by section (nav, hero, about, projects, experience, contact, footer) |
| `translations/en.json` | Create | All English UI text (mirror structure of es.json) |
| `data/projects.json` | Create | Projects data with ES/EN translations, impact statements |
| `i18n.js` | Create | Language detection, storage, t() function, History API routing, cross-tab sync |
| `script.js` | Modify | Remove hardcoded `projects` and `experience` arrays, fetch from `/data/projects.json`, use `i18n.t()` for UI text |
| `styles.css` | Modify | Add `.lang-toggle` styles, ensure mobile responsiveness, no major layout changes |

---

## Project Structure After Changes

```
/
├── index.html              ← Spanish version (updated)
├── en/
│   └── index.html          ← English version (new)
├── translations/
│   ├── es.json             ← Spanish UI strings (new)
│   └── en.json             ← English UI strings (new)
├── data/
│   └── projects.json       ← Projects data with ES/EN (new)
├── i18n.js                 ← i18n module (new)
├── script.js               ← Updated to use i18n + fetch projects (modified)
├── styles.css              ← Toggle button styles added (modified)
└── assets/                 ← Existing (unchanged)
    └── favicon_io/
```

---

## Interfaces / Contracts

### i18n.js Public API

```javascript
/**
 * Initialize i18n module
 * @returns {Promise<void>} Resolves when translations loaded
 */
i18n.init()

/**
 * Get translation for key
 * @param {string} key - Dot-notation key (e.g., "hero.title")
 * @returns {string} Translation string or empty string if not found
 */
i18n.t(key)

/**
 * Set current language
 * @param {string} lang - "es" or "en"
 * @param {boolean} [updateURL=true] - Whether to update URL via History API
 */
i18n.setLanguage(lang, updateURL = true)

/**
 * Get current language
 * @returns {string} Current language code
 */
i18n.getLanguage()

/**
 * Detect browser's preferred language
 * @returns {string} "es", "en", or fallback ("es")
 */
i18n.detectLanguage()
```

### Translation JSON Structure

#### translations/es.json
```json
{
  "nav": {
    "about": "Sobre mí",
    "projects": "Proyectos",
    "experience": "Experiencia",
    "contact": "Contacto",
    "cta": "Hablemos"
  },
  "hero": {
    "eyebrow": "Portafolio 2026",
    "title": "Construyo experiencias digitales claras y audaces.",
    "subtitle": "Diseño y desarrollo productos que resuelven problemas reales, con foco en desempeño, accesibilidad y una estética cuidada.",
    "ctaProjects": "Ver proyectos",
    "ctaContact": "Disponibilidad",
    "role": "Desarrollador Mobile",
    "roleDescription": "Buscando roles donde pueda aportar en desarrollo mobile y arquitectura de aplicaciones.",
    "github": "GitHub",
    "githubUrl": "https://github.com/cvc953"
  },
  "about": {
    "eyebrow": "Perfil",
    "title": "Sobre mí",
    "description": "Soy Cristian Villalobos Cuadrado, desarrollador enfocado en aplicaciones mobile que trabajan con datos locales, reproducción de contenido y organización de información. He construido reproductores de música, sistemas de tareas y herramientas de análisis de metadatos, priorizando rendimiento y control del estado.",
    "strengthsTitle": "Fortalezas",
    "strengths": [
      "Manejo de estado en apps complejas.",
      "Procesamiento de datos locales (audio, metadatos).",
      "Integración de APIs externas (LRCLib, etc.).",
      "Construcción de UIs reactivas con Compose/Flutter."
    ],
    "techTitle": "Tecnologías clave",
    "techs": ["Flutter (Dart)", "Kotlin", "Python", "APIs REST", "Git / GitHub"]
  },
  "projects": {
    "eyebrow": "Selección",
    "title": "Proyectos destacados",
    "role": "Autor",
    "year": "Año"
  },
  "experience": {
    "eyebrow": "Trayectoria",
    "title": "Experiencia técnica"
  },
  "contact": {
    "eyebrow": "Contacto",
    "title": "¿Hablamos?",
    "description": "Cuéntame sobre tu proyecto, rol o idea. Respondo en 24h.",
    "emailLabel": "Email",
    "linkedinLabel": "LinkedIn",
    "preferencesTitle": "Preferencias",
    "preferences": [
      "Proyectos entre 2-6 meses.",
      "Equipos distribuidos o híbridos.",
      "Foco en shipping continuo y ownership compartido."
    ]
  },
  "footer": {
    "copyright": "© 2026 · Cristian Villalobos Cuadrado",
    "tagline": "Diseñado con cariño y café."
  },
  "languages": {
    "es": "ES",
    "en": "EN"
  }
}
```

#### data/projects.json
```json
{
  "es": {
    "projects": [
      {
        "title": "Avas Eto",
        "description": "Sistema de gestión de tareas con persistencia local y autenticación, enfocado en rapidez de acceso y organización eficiente de información.",
        "impact": "+5K descargas verificadas",
        "tags": ["Flutter", "Dart", "SQLite", "Firebase"],
        "year": "2025",
        "role": "Autor",
        "links": [
          { "label": "Repositorio", "url": "https://github.com/cvc953/avas-eto" }
        ]
      }
    ]
  },
  "en": {
    "projects": [
      {
        "title": "Avas Eto",
        "description": "Task management system with local persistence and authentication, focused on quick access and efficient information organization.",
        "impact": "+5K verified downloads",
        "tags": ["Flutter", "Dart", "SQLite", "Firebase"],
        "year": "2025",
        "role": "Author",
        "links": [
          { "label": "Repository", "url": "https://github.com/cvc953/avas-eto" }
        ]
      }
    ]
  }
}
```

### HTML Data Attribute Convention

All translatable elements use `data-i18n` attribute:

```html
<!-- Simple text -->
<h1 data-i18n="hero.title">Text replaced by i18n.t()</h1>

<!-- Attribute translation -->
<a href="mailto:..." data-i18n-attr="href,aria-label">Link</a>
```

Format: `data-i18n="section.key"` (dot notation)

---

## SEO Implementation

### hreflang Tags (Spanish index.html)
```html
<head>
  <!-- Existing meta tags -->
  <link rel="canonical" href="https://cristianvillalobos.com/">
  <link rel="alternate" hreflang="es" href="https://cristianvillalobos.com/">
  <link rel="alternate" hreflang="en" href="https://cristianvillalobos.com/en/">
  <link rel="alternate" hreflang="x-default" href="https://cristianvillalobos.com/">
</head>
```

### hreflang Tags (English /en/index.html)
```html
<head>
  <link rel="canonical" href="https://cristianvillalobos.com/en/">
  <link rel="alternate" hreflang="es" href="https://cristianvillalobos.com/">
  <link rel="alternate" hreflang="en" href="https://cristianvillalobos.com/en/">
  <link rel="alternate" hreflang="x-default" href="https://cristianvillalobos.com/">
</head>
```

### Language Toggle Button
```html
<header class="top-bar">
  <div class="logo">CVC</div>
  <nav>
    <a href="#sobre-mi" data-i18n="nav.about">Sobre mí</a>
    <a href="#proyectos" data-i18n="nav.projects">Proyectos</a>
    <a href="#experiencia" data-i18n="nav.experience">Experiencia</a>
    <a href="#contacto" data-i18n="nav.contact">Contacto</a>
  </nav>
  <div class="lang-toggle">
    <button class="lang-btn active" data-lang="es">ES</button>
    <span class="lang-divider">|</span>
    <button class="lang-btn" data-lang="en">EN</button>
  </div>
  <button class="cta" data-i18n="nav.cta">Hablemos</button>
</header>
```

---

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `i18n.t()` key lookup, missing keys, dot notation parsing | Console tests in browser |
| Unit | `i18n.detectLanguage()` returns correct code | Mock `navigator.language` |
| Integration | DOM updates on language switch | Manual verification, inspect elements |
| Integration | localStorage persistence | Check DevTools → Application → Local Storage |
| Integration | History API URL updates | Check browser address bar |
| E2E | Both language versions load via curl/wget | `curl -I https://cristianvillalobos.com/` |
| E2E | hreflang tags present and correct | View source or use Screaming Frog |
| SEO | Google Search Console hreflang validation | Manual check after deploy |

### Console Test Commands

```javascript
// Test translation lookup
i18n.t('hero.title')  // Should return Spanish title

// Test language switch
i18n.setLanguage('en')
i18n.t('hero.title')  // Should return English title

// Test missing key
i18n.t('nonexistent.key')  // Should return ""

// Test detection
i18n.detectLanguage()  // Returns based on navigator.language
```

---

## Migration / Rollback

### Migration Required: No
This is additive i18n with content refactor. The original Spanish content is preserved in `translations/es.json` and `data/projects.json`. No database migrations or data transformations needed.

### Rollback Procedure

1. Revert modified files:
   ```bash
   git checkout HEAD -- index.html script.js styles.css
   ```

2. Remove new files:
   ```bash
   rm -rf translations/ data/ i18n.js en/
   ```

3. Deploy previous commit if needed:
   ```bash
   git revert HEAD  # Creates new commit reverting changes
   ```

4. Verify rollback:
   ```bash
   git status  # Should show clean working directory
   ```

---

## Open Questions

- [ ] **Impact metrics accuracy**: Projects currently lack real download counts. Should impact statements use estimates ("personal project") or aspirational metrics? **Decision needed before writing projects.json**

- [ ] **GitHub stats integration**: Content spec mentions "GitHub pill" in hero. Should this be static text or dynamically fetched via GitHub API? **Decision: static for simplicity (no API rate limits, no JS dependency for core content)**

- [ ] **Translation sync**: If a new project is added, both JSON files must be updated. Should we add a CI check to verify key parity? **Decision: manual for now, add CI if drift becomes a problem**

---

## Design Rules Applied (from config.yaml)

- ✅ "Mantener simplicidad (static site)" — No build step, vanilla JS only
- ✅ "Considerar accesibilidad y performance" — Static HTML pre-rendered, no JS required for content
- ✅ "Follow existing CSS patterns y naming conventions" — Using BEM-like class names from existing styles.css
- ✅ "No frameworks nuevos - mantener vanilla" — Custom i18n module, no dependencies
