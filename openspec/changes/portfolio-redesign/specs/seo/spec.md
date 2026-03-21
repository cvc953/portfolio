# Delta for seo

## ADDED Requirements

### Requirement: hreflang Tags for Language Versions

The system MUST include hreflang tags for both languages and x-default in the `<head>` section.

The hreflang tags SHALL be mutually referenced (each version points to both itself and the alternate language).

#### Scenario: Spanish homepage has correct hreflang tags

- GIVEN a visitor or crawler views the HTML source of the Spanish homepage (/)
- THEN the `<head>` section SHALL include in exact order:
  ```html
  <link rel="alternate" hreflang="es" href="https://cristianvillalobos.com/">
  <link rel="alternate" hreflang="en" href="https://cristianvillalobos.com/en/">
  <link rel="alternate" hreflang="x-default" href="https://cristianvillalobos.com/">
  ```

#### Scenario: English homepage has correct hreflang tags

- GIVEN a visitor or crawler views the HTML source of the English homepage (/en/)
- THEN the `<head>` section SHALL include in exact order:
  ```html
  <link rel="alternate" hreflang="es" href="https://cristianvillalobos.com/">
  <link rel="alternate" hreflang="en" href="https://cristianvillalobos.com/en/">
  <link rel="alternate" hreflang="x-default" href="https://cristianvillalobos.com/">
  ```

#### Scenario: hreflang tags use absolute URLs

- GIVEN any hreflang tag on the site
- THEN the `href` attribute SHALL use absolute URLs (https://...)
- AND SHALL NOT use relative URLs (/en/)

---

### Requirement: Language Attribute on HTML Element

The system MUST update the `lang` attribute on the `<html>` element to reflect the current language.

The `lang` attribute SHALL match the content language for accessibility and SEO crawlers.

#### Scenario: Spanish page has correct lang attribute

- GIVEN a visitor views the Spanish homepage
- THEN the `<html>` element SHALL have `lang="es"`
- AND this attribute SHALL be present in the static HTML file

#### Scenario: English page has correct lang attribute

- GIVEN a visitor views the English homepage
- THEN the `<html>` element SHALL have `lang="en"`
- AND this attribute SHALL be present in the static HTML file (/en/index.html)

---

### Requirement: Meta Tags for Both Languages

The system MUST include appropriate meta tags for social sharing and SEO on both language versions.

#### Scenario: Spanish page has Spanish meta tags

- GIVEN a visitor views the Spanish homepage
- THEN the meta description SHALL be in Spanish
- AND the og:title and og:description SHALL be in Spanish
- AND the og:locale SHALL be "es_ES"

#### Scenario: English page has English meta tags

- GIVEN a visitor views the English homepage
- THEN the meta description SHALL be in English
- AND the og:title and og:description SHALL be in English
- AND the og:locale SHALL be "en_US"

#### Scenario: Open Graph locale alternating

- GIVEN the Spanish page og:locale
- THEN it SHALL be "es_ES"
- AND the English page og:locale SHALL be "en_US"
- AND both pages SHOULD include og:alternate-locale for the other language

---

### Requirement: Canonical URLs

The system MUST include canonical URL tags to prevent duplicate content issues.

#### Scenario: Spanish page has self-referential canonical

- GIVEN a visitor views the Spanish homepage
- THEN the `<head>` SHALL include:
  ```html
  <link rel="canonical" href="https://cristianvillalobos.com/">
  ```

#### Scenario: English page has self-referential canonical

- GIVEN a visitor views the English homepage
- THEN the `<head>` SHALL include:
  ```html
  <link rel="canonical" href="https://cristianvillalobos.com/en/">
  ```

---

### Requirement: No Index Conflicts

The system MUST ensure that search engines can index both language versions properly.

#### Scenario: Both versions are indexable

- GIVEN the Spanish and English pages
- THEN neither page SHALL contain `<meta name="robots" content="noindex">`
- AND both pages SHALL be discoverable via their hreflang tags

#### Scenario: sitemap.xml includes both versions

- GIVEN the sitemap.xml file
- THEN it SHALL include entries for both:
  - https://cristianvillalobos.com/
  - https://cristianvillalobos.com/en/
- AND each entry SHOULD include `hreflang` alternatives (if using hreflang sitemap format)
