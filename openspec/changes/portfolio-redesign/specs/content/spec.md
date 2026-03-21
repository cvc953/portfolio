# Delta for content

## REMOVED Requirements

### Requirement: Junior Developer Label

(Reason: Conversion killer - recruiters filter out "junior" candidates automatically. This self-label undermines credibility and triggers automated ATS filters that reject candidates before human review.)

#### Before

The hero card displayed: "Junior Developer"

#### After

The hero card displays: "Mobile Developer" or no role label with seniority indication

---

### Requirement: Generic Project Descriptions

(Reason: Generic descriptions ("A music player app", "A task manager") provide no evidence of impact or competence. Recruiters need concrete outcomes to evaluate candidates.)

#### Before

Projects contained basic descriptions without metrics:
- "A music player for Android"
- "A to-do list app"
- "A weather forecast application"

#### After

All projects contain descriptive text that conveys purpose, technology, and outcome without requiring external research.

---

## ADDED Requirements

### Requirement: Impact Statements in Projects

The system MUST include at least one impact statement per project (metric or outcome).

Impact statements SHALL be visible in the project card without clicking links. If actual metrics are unavailable, estimated or relative metrics SHALL be used (e.g., "personal project", "portfolio showcase").

#### Scenario: Project with download/user impact

- GIVEN project "Avas Eto" (Flutter app)
- THEN the description SHALL include "+X downloads" or "+X users" if available
- OR "Built for personal use, featured project" if metrics unavailable
- AND the impact statement SHALL be visible in the project card

#### Scenario: Project with usage metric

- GIVEN project "Local Player" (music player)
- THEN the description SHALL include "+X songs played" or "featured in Flutter Weekly" if available
- OR "Side project exploring audio APIs" if no metrics

#### Scenario: Project with quality indicator

- GIVEN any project with GitHub stars or rating
- THEN the project card SHALL display the star count or rating badge
- AND the metric SHALL be visible without clicking external links

#### Scenario: Project without available metrics

- GIVEN a project with no available download counts, users, or ratings
- THEN the project description SHALL include contextual information
- AND SHALL indicate this is a "portfolio project" or "learning showcase"

---

### Requirement: GitHub Visibility

The system MUST display GitHub link prominently in the hero section.

The GitHub link SHALL be visible without scrolling on both mobile and desktop views.

#### Scenario: GitHub link visible on hero

- GIVEN a visitor views the hero section
- THEN they SHALL see a clickable GitHub icon/username
- AND it SHALL be positioned near the name/title
- AND clicking it SHALL open github.com/cvc953 in a new tab

#### Scenario: GitHub link accessible on mobile

- GIVEN a visitor views the site on a mobile device (320px width)
- THEN the GitHub link SHALL be visible in the hero section
- AND SHALL have adequate touch target (minimum 44x44px)
- AND SHALL NOT be hidden behind a "show more" interaction

---

### Requirement: Professional Role Framing

The system MUST display professional role information that conveys seniority and specialization.

The hero section SHALL NOT contain the word "Junior" in any form.

#### Scenario: Role displayed without Junior

- GIVEN a visitor views the hero section
- THEN the role/title SHALL read "Mobile Developer" or "Flutter Developer"
- AND the term "Junior" SHALL NOT appear anywhere on the page
- AND the term "Junior" SHALL NOT appear in translation files

#### Scenario: Technology stack visible

- GIVEN a visitor views the hero section
- THEN they SHALL see the primary technologies listed
- AND the technologies SHALL include Flutter and/or Kotlin (native mobile)
- AND the technologies SHALL be formatted as pills, badges, or inline list

---

### Requirement: Contact CTA Visibility

The system MUST display a visible call-to-action for contact in the hero section.

#### Scenario: Contact CTA visible

- GIVEN a visitor views the hero section
- THEN they SHALL see a "Contact" or "Hire Me" button/link
- AND it SHALL be prominently styled (contrast color, size)
- AND it SHALL link to the contact section or external contact form

#### Scenario: Contact link accessible

- GIVEN a visitor navigates to any section of the site
- THEN the contact CTA SHALL remain accessible (sticky header or scroll-to-top)
- OR a contact link SHALL be present in the navigation
