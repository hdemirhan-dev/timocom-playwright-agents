# TIMOCOM Test Plan

## Application Overview

TIMOCOM is a European road freight logistics marketplace (timocom.de). The site is built on AEM, which double-renders some elements (use .first() for navigation). Cookie consent is handled via Usercentrics: wait for UC_UI to initialize, then call UC_UI.acceptAllConsents(). Registration at /registrierung uses a two-step flow: company-type selection first, then a form. The login portal (my.timocom.com) is out of scope. Tab/anchor links that use #ci-NNNNN fragment IDs must not be referenced in tests — use visible label text instead.

## Test Scenarios

### 1. Homepage

**Seed:** `tests/seed.spec.ts`

#### 1.1. Hero section and primary CTA

**File:** `tests/homepage/hero-cta.spec.ts`

**Steps:**
  1. Navigate to https://www.timocom.de
    - expect: Page title contains 'TIMOCOM'
  2. Wait for UC_UI to initialize via page.waitForFunction(() => typeof window.UC_UI !== 'undefined'), then call UC_UI.acceptAllConsents()
    - expect: Cookie banner is dismissed without errors
  3. Verify the first navigation element is visible using getByRole('navigation').first()
    - expect: Main navigation is visible (AEM renders nav twice — use .first())
  4. Verify the h1 heading 'TIMOCOM Road Freight Marketplace' is visible
    - expect: Hero heading is present
  5. Verify the hero list contains the three benefit bullets about 58.000 Unternehmen, 1 Million Angebote, and TIMOCOM Messenger
    - expect: All three benefit bullets are visible
  6. Verify the 'Jetzt kostenlos testen' link in the hero section has href '/registrierung'
    - expect: Primary CTA links to /registrierung

#### 1.2. Main navigation links

**File:** `tests/homepage/navigation.spec.ts`

**Steps:**
  1. Navigate to https://www.timocom.de and accept cookies via UC_UI.acceptAllConsents()
    - expect: Page loads and cookies are accepted
  2. Verify the 'Services' link in the main navigation is visible and has href '/services'
    - expect: Services link present with correct href
  3. Verify the 'Ressourcen' link is visible with href '/ressourcen'
    - expect: Ressourcen link present
  4. Verify the 'Unternehmen' link is visible with href '/unternehmen'
    - expect: Unternehmen link present
  5. Verify the 'Jetzt registrieren' link is visible with href '/registrierung'
    - expect: Registration CTA in nav is present
  6. Verify the 'Login' link is visible in nav — confirm it exists but do not click it (it points to my.timocom.com, which is out of scope)
    - expect: Login link present in nav; href starts with https://my.timocom.com/

#### 1.3. Freight search widget

**File:** `tests/homepage/freight-search.spec.ts`

**Steps:**
  1. Navigate to https://www.timocom.de and accept cookies via UC_UI.acceptAllConsents()
    - expect: Page loads and cookies are accepted
  2. Verify the 'Frachten' and 'Laderaum' toggle buttons are visible
    - expect: Both search-mode toggle buttons are present
  3. Verify the 'Von' textbox is visible and contains 'DE ... Deutschland' with placeholder 'Alle Länder'
    - expect: Von input pre-populated with Germany
  4. Verify the 'Nach' textbox is visible with placeholder 'EU…Alle Länder'
    - expect: Nach input is present and empty
  5. Verify the 'Aufbauart' textbox dropdown is visible with placeholder 'auswählen'
    - expect: Aufbauart dropdown is present
  6. Verify the 'Suchen' button is visible and enabled
    - expect: Search button is present and interactive

### 2. Registration

**Seed:** `tests/seed.spec.ts`

#### 2.1. Company type selection — step 1

**File:** `tests/registration/company-type-selection.spec.ts`

**Steps:**
  1. Navigate to https://www.timocom.de/registrierung and accept cookies via UC_UI.acceptAllConsents()
    - expect: Registration page loads with title containing 'registrieren'
  2. Verify the h1 'Werden Sie Teil eines der größten Transport- und Logistiknetzwerke Europas!' is visible
    - expect: Registration heading is visible
  3. Verify all 8 company-type buttons are visible: Frachtführer, Handel, Spedition, KEP-Dienstleister (3,5 t), Produktion, Lagerhalter, Entsorger, Privatperson
    - expect: All 8 company type selection buttons are rendered in step 1
  4. Click the 'Spedition' button
    - expect: Step 1 transitions — step 2 content or form fields appear
  5. Verify that form fields (e.g. company name or email) are now visible after selecting company type
    - expect: Step 2 of the two-step registration flow is shown

#### 2.2. Contact information on registration page

**File:** `tests/registration/contact-info.spec.ts`

**Steps:**
  1. Navigate to https://www.timocom.de/registrierung and accept cookies via UC_UI.acceptAllConsents()
    - expect: Registration page loads
  2. Verify the 'Kontakt' heading is visible on the page
    - expect: Contact section heading is present
  3. Verify the phone number text '+49 211 88 26 88 26' is visible
    - expect: Primary phone number displayed
  4. Verify the sales support email link 'salessupport@timocom.com' is visible
    - expect: Email link is present
  5. Verify the email link href is 'mailto:salessupport@timocom.com'
    - expect: Email link uses correct mailto: protocol

#### 2.3. Minimal navigation on registration page

**File:** `tests/registration/minimal-nav.spec.ts`

**Steps:**
  1. Navigate to https://www.timocom.de/registrierung and accept cookies via UC_UI.acceptAllConsents()
    - expect: Registration page loads
  2. Verify 'LOGO-TIMOCOM' link in the header is visible and has href '/'
    - expect: Logo is shown as a home link
  3. Verify the full site nav links (Services, Ressourcen, Unternehmen, Support) are NOT present in the header
    - expect: Registration page uses a stripped-down header with no main nav links
  4. Verify the footer contains an 'Impressum' link to https://www.timocom.de/impressum
    - expect: Impressum legal link in footer
  5. Verify the footer contains a 'Datenschutz' link to https://www.timocom.de/datenschutz
    - expect: Datenschutz link in footer
  6. Verify social media links (Facebook, YouTube, LinkedIn, Xing, Instagram) are visible in the footer
    - expect: Social media links rendered in registration page footer

### 3. Services

**Seed:** `tests/seed.spec.ts`

#### 3.1. Page layout, breadcrumb, and statistics

**File:** `tests/services/layout-breadcrumb.spec.ts`

**Steps:**
  1. Navigate to https://www.timocom.de/services and accept cookies via UC_UI.acceptAllConsents()
    - expect: Services page loads with title containing 'Logistiksoftware'
  2. Verify the breadcrumb navigation is visible with items 'TIMOCOM Deutschland' (href '/') and 'Services' (href '/services')
    - expect: Breadcrumb shows correct path
  3. Verify h1 'Der TIMOCOM Road Freight Marketplace' is visible
    - expect: Page hero heading is present
  4. Verify the statistics section shows the '> 156.000' Nutzer stat heading
    - expect: User count statistic visible
  5. Verify the '299' telematik providers stat heading is visible
    - expect: Telematik providers stat visible
  6. Verify the 'Jetzt kostenlos testen' CTA link in the hero section has href '/registrierung'
    - expect: Primary CTA on services page links to /registrierung

#### 3.2. Service category tabs and service cards

**File:** `tests/services/service-cards.spec.ts`

**Steps:**
  1. Navigate to https://www.timocom.de/services and accept cookies via UC_UI.acceptAllConsents()
    - expect: Services page loads
  2. Verify the 4 category tabs are visible: 'Transport Exchange', 'Transportation Visibility', 'Security & Payments', 'Connect'
    - expect: All 4 category tab labels are present
  3. Verify the 'Frachten- und Laderaumbörse:' service card link is visible with href '/services/frachtenboerse'
    - expect: Freight exchange service card present with correct link
  4. Verify the 'Geschlossene Frachtenbörse:' card link has href '/services/frachtenboerse/geschlossene-frachtenboerse'
    - expect: Closed freight exchange card present
  5. Verify the 'Ausschreibungen:' card link has href '/services/ausschreibungen'
    - expect: Tenders card present
  6. Verify each visible service card has a 'Mehr erfahren >' CTA text
    - expect: All service cards have a 'Mehr erfahren >' call-to-action

#### 3.3. Role-based solution cards and customer testimonial

**File:** `tests/services/role-solutions.spec.ts`

**Steps:**
  1. Navigate to https://www.timocom.de/services and accept cookies via UC_UI.acceptAllConsents()
    - expect: Services page loads
  2. Verify the 'Road Freight Solutions für Ihre Anforderungen' heading is visible
    - expect: Role-based solutions section heading present
  3. Verify the 'Verlader' role card link is visible with href '/services/verlader' and shows at least one benefit bullet
    - expect: Verlader card present with link and benefits
  4. Verify the 'Spediteure' role card link has href '/services/spediteure'
    - expect: Spediteure card present with correct link
  5. Verify the 'Frachtführer' role card link has href '/services/frachtfuehrer'
    - expect: Frachtführer card present with correct link
  6. Verify the customer testimonial section shows a quote from Andrea Schumm mentioning IBIS Backwaren
    - expect: Testimonial with customer name and company is visible
