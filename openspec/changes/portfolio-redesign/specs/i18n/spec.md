# Delta for i18n

## ADDED Requirements

### Requirement: Language Detection

The system MUST detect the user's preferred language on first visit using the browser's language preference.

The system SHALL use `navigator.language` to determine the browser's preferred language and default to Spanish if the detected language is neither Spanish nor English.

#### Scenario: New visitor with Spanish browser

- GIVEN a new visitor with browser language containing "es" (e.g., "es-ES", "es-MX")
- WHEN they visit the site
- THEN the site SHALL display Spanish content by default
- AND store "es" in localStorage under the key "preferred-language"

#### Scenario: New visitor with English browser

- GIVEN a new visitor with browser language containing "en" (e.g., "en-US", "en-GB")
- WHEN they visit the site
- THEN the site SHALL display English content (redirect or serve /en/ page)
- AND store "en" in localStorage under the key "preferred-language"

#### Scenario: New visitor with unsupported browser language

- GIVEN a new visitor with browser language "fr-FR" or another unsupported language
- WHEN they visit the site
- THEN the site SHALL default to Spanish (x-default behavior)
- AND store "es" in localStorage under the key "preferred-language"

---

### Requirement: Translation Function

The system MUST provide a `t(key)` function that returns the translation for the given key in the current language.

The function SHALL accept dot-notation keys (e.g., "hero.title") and SHALL return the empty string if a key is not found.

#### Scenario: Get translation in Spanish

- GIVEN the current language is "es"
- AND the translation file contains `{"hero": {"title": "Construyo experiencias digitales claras y audaces."}}`
- WHEN `t("hero.title")` is called
- THEN it SHALL return "Construyo experiencias digitales claras y audaces."

#### Scenario: Get translation in English

- GIVEN the current language is "en"
- AND the translation file contains `{"hero": {"title": "I build clear and bold digital experiences."}}`
- WHEN `t("hero.title")` is called
- THEN it SHALL return "I build clear and bold digital experiences."

#### Scenario: Missing translation key

- GIVEN the current language is "es"
- AND the translation file does NOT contain a key "hero.missing"
- WHEN `t("hero.missing")` is called
- THEN it SHALL return an empty string ""
- AND it SHALL NOT throw an error

---

### Requirement: Language Preference Persistence

The system MUST store language preference in localStorage and restore it on subsequent visits.

The system SHALL read the stored preference on page load and apply it before displaying content.

#### Scenario: Returning visitor with stored preference

- GIVEN a returning visitor with "en" stored in localStorage under "preferred-language"
- WHEN they visit the site (any page)
- THEN the site SHALL display English content
- AND the URL SHALL reflect the English version (/en/)

#### Scenario: Returning visitor with Spanish preference

- GIVEN a returning visitor with "es" stored in localStorage under "preferred-language"
- WHEN they visit the site
- THEN the site SHALL display Spanish content
- AND the URL SHALL reflect the Spanish version (/)

#### Scenario: Clear language preference

- GIVEN a visitor has stored "en" in localStorage
- WHEN they manually clear localStorage
- AND they revisit the site
- THEN the system SHALL re-detect browser language as if first visit

---

### Requirement: URL-Based Language Routing

The system MUST handle language routing through URL structure without page reload when possible.

The system SHALL use the following URL patterns:
- Spanish (default): `/` or any path not starting with `/en/`
- English: `/en/` prefix on all paths

#### Scenario: Visit Spanish URL

- GIVEN a visitor navigates to "/"
- THEN the site SHALL display Spanish content
- AND the HTML `lang` attribute SHALL be "es"

#### Scenario: Visit English URL

- GIVEN a visitor navigates to "/en/"
- THEN the site SHALL display English content
- AND the HTML `lang` attribute SHALL be "en"

#### Scenario: Toggle language without page reload

- GIVEN a visitor is on the Spanish version "/"
- WHEN they click the language toggle to "EN"
- THEN the site SHALL update content to English without full page reload
- AND the URL SHALL update to "/en/" (using History API)
- AND localStorage SHALL be updated to "en"

---

### Requirement: Cross-Tab Language Sync

The system MUST synchronize language preference across multiple open tabs.

When the language preference changes in one tab, all other tabs SHALL reflect the new language.

#### Scenario: Language change syncs across tabs

- GIVEN a visitor has the site open in two tabs, both showing Spanish
- WHEN they toggle language to English in Tab A
- THEN Tab B SHALL automatically update to English content
- AND Tab B SHALL reflect the updated URL (/en/)

---

### Requirement: Translation File Structure

The system MUST use JSON files for translations with a consistent structure mirroring the HTML sections.

The JSON files SHALL be located at:
- Spanish: `/translations/es.json`
- English: `/translations/en.json`

#### Scenario: Translation JSON structure

- GIVEN the translation file structure
- THEN it SHALL contain keys for: hero, nav, about, experience, projects, skills, contact, footer
- AND each section SHALL contain relevant text keys (title, subtitle, description, cta, etc.)
- AND the structure SHALL be identical between es.json and en.json (same keys)

#### Scenario: All UI text is translatable

- GIVEN any visible text on the portfolio
- THEN it SHALL be defined in the translation JSON files
- AND it SHALL NOT be hardcoded in HTML or JavaScript
