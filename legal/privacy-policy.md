# Privacy Policy

**Quiet Method — AI Attention Shield**
**WEDGE METHOD LLC**

**Effective Date:** March 28, 2026
**Last Updated:** March 28, 2026

---

## 1. Introduction and Scope

WEDGE METHOD LLC ("WEDGE METHOD," "we," "us," or "our") operates Quiet Method — AI Attention Shield (the "Extension" or "Service"), a Chrome browser extension that detects digital overload and provides behavioral nudges to help users manage cognitive burnout.

This Privacy Policy describes how we collect, use, store, share, and protect information in connection with your use of Quiet Method. It applies to:

- The Quiet Method Chrome Extension (free and premium tiers)
- The Quiet Method website at quietguard.app
- Any related services, including payment processing and optional cloud sync

This policy is designed to comply with:
- The **General Data Protection Regulation (GDPR)** (EU) 2016/679
- The **California Consumer Privacy Act (CCPA)** as amended by the California Privacy Rights Act (CPRA)
- The **UK General Data Protection Regulation (UK GDPR)**
- Other applicable U.S. state and international privacy laws

**If you are a resident of the European Economic Area (EEA), the United Kingdom, or another jurisdiction with similar privacy protections, please also review Section 12 (International Users and GDPR Rights) and Section 13 (CCPA/CPRA Rights for California Residents).**

---

## 2. Our Core Privacy Commitment

Quiet Method is built on a foundational privacy principle: **your behavioral data belongs to you.**

**Free Tier — Local-Only Processing:**
The core functionality of Quiet Method — behavioral monitoring, overload detection, and nudges — operates entirely on your device. The following data types are processed locally and are **never transmitted to WEDGE METHOD servers or any third party** on the free tier:

- Keystroke timing patterns
- Scroll speed and velocity measurements
- Tab switching frequency and velocity
- Overload signal counts and timestamps
- Calibrated behavioral baseline model
- Daily and weekly usage summaries

This is not a marketing statement — it is an architectural constraint. The free tier extension makes zero network requests for core functionality. You can verify this using your browser's network inspector (DevTools → Network tab).

**Premium Tier — Optional Encrypted Sync:**
Premium users may optionally enable cross-device synchronization. When sync is enabled, behavioral data is encrypted on your device using AES-256 encryption before being transmitted to our Supabase-hosted infrastructure. We hold the infrastructure; **you hold the encryption key**. WEDGE METHOD cannot read the content of your synced data.

---

## 3. Data We Collect

### 3.1 Data Processed Locally (Free Tier — Never Transmitted)

The following data is processed exclusively on your device and stored in your browser's local storage:

| Data Type | Purpose | Retention |
|---|---|---|
| Keystroke timing patterns | Establishing behavioral baseline; overload detection | Stored locally; purged on uninstall or manual clear |
| Scroll velocity measurements | Overload signal detection | Same as above |
| Tab switching frequency data | Overload signal detection | Same as above |
| Calibrated behavioral model | Personalized detection accuracy | Stored locally; improves over 14 days |
| Overload signal counts | Daily and weekly local reporting | Rolling 90-day local history |
| Intervention timestamps | Local report generation | Rolling 90-day local history |
| Detection calibration status | User-facing calibration progress | Stored until reset or uninstall |

**What we do NOT collect locally or remotely:**
- The content of any web page you visit
- URLs of pages you visit (we detect behavior, not destinations)
- Your browsing history
- Text you type (we detect timing, not content)
- Cookies from other websites
- Any form input

### 3.2 Data Collected When You Create an Account (Premium Tier)

If you subscribe to Quiet Method Premium, we collect:

| Data Type | Purpose | Lawful Basis (GDPR) | Retention |
|---|---|---|---|
| Email address | Account creation, authentication, product communications | Contract performance | Duration of account + 90 days post-deletion |
| Password (hashed) | Authentication | Contract performance | Duration of account |
| Subscription status and tier | License verification | Contract performance | Duration of account + 7 years (tax/legal) |
| Payment identifiers (Stripe Customer ID, not card data) | Billing management, dispute resolution | Contract performance | 7 years (legal/financial obligations) |
| Device identifiers (anonymized) | Cross-device sync authorization | Contract performance | Duration of account |

**We never receive or store full payment card details.** All payment card information is handled directly by Stripe, Inc., a PCI DSS Level 1 certified payment processor. We receive only non-sensitive identifiers (Stripe Customer ID, subscription status).

### 3.3 Encrypted Sync Data (Premium Tier — Optional)

If you enable cross-device sync:

| Data Type | Encryption | Stored Where | Who Can Read It |
|---|---|---|---|
| Behavioral baseline model | AES-256 client-side encryption before transmission | Supabase (WEDGE METHOD-controlled) | Only you (key held locally) |
| Weekly behavioral summaries | AES-256 client-side encryption | Supabase | Only you |
| Focus pattern analytics | AES-256 client-side encryption | Supabase | Only you |

**WEDGE METHOD CANNOT READ YOUR SYNCED DATA.** The encryption key is derived from your device and never transmitted to us. If you lose access to all devices and forget your encryption passphrase, we cannot recover your synced data.

### 3.4 Website and Analytics Data

When you visit quietguard.app:

| Data Type | Tool | Purpose | Retention |
|---|---|---|---|
| Anonymized page views | PostHog | Product improvement; understanding feature adoption | 12 months |
| Anonymized click events | PostHog | UX optimization | 12 months |
| Session duration (anonymized) | PostHog | Product improvement | 12 months |
| Referral source (anonymized) | PostHog | Marketing effectiveness | 12 months |
| Browser type and version | PostHog | Compatibility testing | 12 months |
| Country/region (IP-derived, not stored) | PostHog | Aggregate geographic reporting | Not retained (derived only) |

**PostHog Configuration:** We have configured PostHog to:
- Anonymize all user identifiers before data is stored
- Disable session recordings
- Disable heatmaps
- Process data under the EU Standard Contractual Clauses (for EEA visitors)
- Respect Do Not Track signals

**We do not use Google Analytics, Facebook Pixel, or any advertising-purpose tracking pixels.**

### 3.5 Communications

If you contact us via email (support@wedgemethod.com or privacy@wedgemethod.com):

| Data Type | Purpose | Retention |
|---|---|---|
| Email address | Responding to your inquiry | 2 years from last contact |
| Message content | Resolving your support request | 2 years from last contact |

---

## 4. How We Use Your Data

We use the data we collect for the following purposes, each with a documented lawful basis:

| Purpose | Data Used | Lawful Basis (GDPR) | CCPA Category |
|---|---|---|---|
| Providing burnout detection functionality | Local behavioral data | Performance of contract | — (processed locally, not collected by us) |
| Processing payments and managing subscriptions | Payment identifiers, email, subscription status | Performance of contract | Commercial information |
| Sending transactional emails (receipts, account alerts) | Email address | Performance of contract | Identifiers |
| Sending product update and onboarding emails (opt-out available) | Email address | Legitimate interest (product improvement communications) | Identifiers |
| Anonymous product analytics to improve the Extension | Anonymized PostHog events | Legitimate interest (product improvement) | Not personal information (anonymized) |
| Providing encrypted cross-device sync | Encrypted behavioral data | Performance of contract | — (encrypted, cannot be read by us) |
| Complying with legal obligations | Applicable records | Legal obligation | Applicable categories |
| Establishing, exercising, or defending legal claims | Applicable records | Legitimate interest (legal defense) | Applicable categories |

**We do not sell your personal information. We do not share your personal information with advertisers. We do not use your data to train AI models that serve third parties.**

---

## 5. Data Sharing and Third-Party Processors

We share data with a limited number of third-party service providers ("processors") only as necessary to operate the Service. Each processor is bound by data processing agreements consistent with GDPR Article 28 requirements.

| Processor | Purpose | Data Shared | Location | Safeguard |
|---|---|---|---|---|
| **Stripe, Inc.** | Payment processing | Email, payment identifiers (not card data) | USA | Standard Contractual Clauses; PCI DSS Level 1 |
| **Supabase, Inc.** | Encrypted Premium sync storage | Encrypted behavioral data (cannot be read by us) | USA (AWS us-east-1) | Standard Contractual Clauses; SOC 2 Type II |
| **PostHog, Inc.** | Anonymous website analytics | Anonymized events (no PII) | EU (PostHog Cloud EU) | GDPR compliant; EU SCC |
| **Cloudflare, Inc.** | Website CDN and DDoS protection | IP addresses (transient, not logged by us) | Global | Standard Contractual Clauses |

**We do not share data with any other third parties except:**
- When required by law, court order, or valid legal process
- To protect the rights, property, or safety of WEDGE METHOD, our users, or the public
- In connection with a merger, acquisition, or sale of assets (you will be notified)

---

## 6. Cookies and Tracking Technologies

**The Extension itself does not use cookies.**

The Quiet Method website (quietguard.app) uses:

| Cookie Type | Name/Provider | Purpose | Duration |
|---|---|---|---|
| Strictly necessary | Session cookie | Maintaining login state on website | Session |
| Analytics | PostHog | Anonymous product analytics | 12 months |

You may opt out of analytics cookies using our cookie preference center or by enabling the Do Not Track signal in your browser. Strictly necessary cookies cannot be disabled without impairing website function.

We do not use advertising cookies, retargeting cookies, or cross-site tracking technologies.

---

## 7. Data Security

We implement the following technical and organizational security measures:

**For local Extension data:**
- Data is stored in browser-encrypted localStorage/IndexedDB, accessible only to the Extension
- The Extension requests only the minimum necessary permissions (see Section 9)

**For Premium sync data:**
- AES-256 client-side encryption before any data leaves your device
- TLS 1.3 for data in transit
- Supabase Row Level Security (RLS) ensuring database-level user isolation
- We do not retain decryption keys

**For website and account data:**
- HTTPS enforced across all endpoints (HSTS enabled)
- Passwords hashed using bcrypt (minimum cost factor 12)
- Two-factor authentication available for all accounts
- Access to production systems limited to need-to-know basis
- Annual security review

**Breach Notification:** In the event of a data breach affecting your personal information, we will notify you and applicable regulatory authorities within the timeframes required by law (72 hours for GDPR, promptly for CCPA), and no later than 30 days for any affected user.

---

## 8. Data Retention

| Data Category | Retention Period | Basis |
|---|---|---|
| Local Extension data (free tier) | Until uninstall or manual deletion; no maximum | Stored on your device, your control |
| Encrypted sync data (Premium) | Until account deletion + 30 days | Contract performance |
| Account data (email, subscription) | Duration of account + 90 days | Contract performance |
| Financial records (Stripe identifiers) | 7 years from transaction | Legal obligation (tax/financial) |
| Support correspondence | 2 years from last contact | Legitimate interest |
| Anonymous analytics (PostHog) | 12 months rolling | Legitimate interest |

Upon account deletion, we will delete your personal data within 30 days, except where we are required to retain records for legal or tax compliance purposes.

---

## 9. Extension Permissions Disclosure

Quiet Method requests the following Chrome extension permissions. All permissions are scoped to the minimum necessary for core functionality.

| Permission | Why It's Needed | What We Can/Cannot Do With It |
|---|---|---|
| `tabs` | To measure tab switching frequency (an overload signal) | Can count switches and timing; **cannot** read tab URLs, titles, or content |
| `storage` | To save behavioral baseline and local reports to your device | Stores data only to your local browser storage; **no** remote sync on free tier |
| `activeTab` | To detect scroll speed and keystroke timing on your current page | Can detect timing/velocity on active page; **cannot** read text content or form inputs |
| `notifications` | To send the burnout intervention nudge | Sends notifications only; no read access to other notifications |

**What we deliberately did NOT request:**
- `<all_urls>` or broad host permissions (we don't read page content)
- `history` (we don't access your browsing history)
- `cookies` (we don't read or write cookies from other websites)
- `webRequest` or `webRequestBlocking` (we don't intercept network traffic)
- `bookmarks`, `downloads`, `clipboardRead`, or other sensitive permissions

---

## 10. Children's Privacy

Quiet Method is not directed to individuals under the age of 13 (or 16 in the European Economic Area, or the applicable age of digital consent in your jurisdiction). We do not knowingly collect personal information from children under these ages.

If we become aware that we have inadvertently collected personal information from a child under the applicable age, we will promptly delete it. If you believe we may have collected such information, please contact us at privacy@wedgemethod.com.

---

## 11. Your Rights — General

Regardless of your location, you have the following rights with respect to your personal information:

**Right to Access:** You may request a copy of the personal data we hold about you.

**Right to Correction:** You may request that we correct inaccurate personal data.

**Right to Deletion:** You may request that we delete your personal data, subject to legal retention obligations.

**Right to Portability:** You may request your personal data in a structured, machine-readable format.

**Right to Opt Out of Marketing:** You may unsubscribe from marketing emails at any time using the unsubscribe link in any email or by contacting us.

**Local Data:** Because free-tier Extension data is stored entirely on your device, you have complete control over it. You can view, export, or delete it through the Extension settings at any time. Uninstalling the Extension deletes all locally stored data.

To exercise any of these rights, contact us at:

**Email:** privacy@wedgemethod.com
**Mail:** WEDGE METHOD LLC, 8977 S 1300 W Unit #615, West Jordan UT 84088

We will respond to verified requests within the timeframes required by applicable law.

---

## 12. International Users and GDPR Rights (EEA and UK)

If you are located in the European Economic Area (EEA) or the United Kingdom, the following additional rights and disclosures apply.

### 12.1 Data Controller

The data controller for your personal data is:

**WEDGE METHOD LLC**
8977 S 1300 W Unit #615
West Jordan, UT 84088
United States
Email: privacy@wedgemethod.com

### 12.2 Lawful Bases for Processing

We rely on the following lawful bases under GDPR Article 6:

- **Contract Performance (Article 6(1)(b)):** Processing necessary to provide the Service you have subscribed to, including account management and payment processing.
- **Legitimate Interest (Article 6(1)(f)):** Anonymous product analytics and product communications. Our legitimate interest is improving the product; we have conducted a balancing test and determined this interest is not overridden by your rights, given the minimal privacy impact of anonymized analytics and the easy opt-out available for communications.
- **Legal Obligation (Article 6(1)(c)):** Financial record retention and regulatory compliance.
- **Consent (Article 6(1)(a)):** Non-essential cookies on the website (you may withdraw consent at any time via cookie preferences).

### 12.3 GDPR Rights

As an EEA or UK data subject, you have the following rights:

| Right | Description | How to Exercise |
|---|---|---|
| Right of access (Article 15) | Receive a copy of your personal data | Email privacy@wedgemethod.com |
| Right to rectification (Article 16) | Correct inaccurate data | Email privacy@wedgemethod.com |
| Right to erasure (Article 17) | Request deletion of your personal data | Email privacy@wedgemethod.com or delete your account |
| Right to restriction (Article 18) | Restrict processing of your data | Email privacy@wedgemethod.com |
| Right to portability (Article 20) | Receive your data in machine-readable format | Email privacy@wedgemethod.com |
| Right to object (Article 21) | Object to processing based on legitimate interest | Email privacy@wedgemethod.com |
| Rights re: automated decisions (Article 22) | Not subject to solely automated decisions with legal effect | N/A — no such decisions made |
| Right to withdraw consent | Withdraw consent at any time | Cookie preferences or email |

We will respond to GDPR requests within 30 days. Complex requests may be extended by an additional 60 days with notice.

You have the right to lodge a complaint with your local data protection supervisory authority. For EEA residents, a list of authorities is available at [edpb.europa.eu](https://edpb.europa.eu). For UK residents, the supervising authority is the Information Commissioner's Office (ICO) at [ico.org.uk](https://ico.org.uk).

### 12.4 International Data Transfers

WEDGE METHOD LLC is based in the United States. When personal data is transferred from the EEA or UK to the US, we use the following safeguards:

- **Stripe:** European Commission Standard Contractual Clauses (SCCs), Module 2 (Controller to Processor), June 2021 version
- **Supabase:** European Commission Standard Contractual Clauses (SCCs), Module 2, June 2021 version
- **PostHog:** Data processed in EU region (PostHog Cloud EU) — no transfer to US

Transfer impact assessments have been conducted for US-based processors. Supplementary measures include pseudonymization, encryption in transit and at rest, and contractual access controls.

---

## 13. CCPA / CPRA Rights for California Residents

If you are a California resident, the California Consumer Privacy Act (CCPA), as amended by the California Privacy Rights Act (CPRA), provides you with the following rights.

### 13.1 Categories of Personal Information Collected

In the preceding 12 months, we have collected the following categories of personal information:

| CCPA Category | Specific Data Types | Collected? |
|---|---|---|
| Identifiers | Email address, Stripe Customer ID, device identifiers (Premium only) | Yes (Premium only) |
| Internet or Network Activity | Anonymous PostHog analytics (no individual identification) | Yes (anonymized) |
| Commercial Information | Subscription status, purchase history | Yes (Premium only) |
| Geolocation Data | None | No |
| Biometric Information | None | No |
| Audio/Visual/Electronic Information | None | No |
| Inferences drawn from personal information | None | No |

Behavioral data processed by the Extension (keystroke timing, scroll speed, tab counts) is processed locally on your device and is **not collected by WEDGE METHOD LLC**. It does not fall within CCPA's definition of "personal information" we "collect" because we never receive, possess, or access it.

### 13.2 How We Use, Disclose, and Share Personal Information

**We do not sell personal information.** (CCPA "sale" includes exchange for monetary or other valuable consideration.)

**We do not share personal information for cross-context behavioral advertising.**

**We do not use sensitive personal information for purposes beyond what is necessary to provide the Service.**

Personal information is disclosed to processors (Stripe, Supabase, PostHog) as described in Section 5 — solely for operating purposes, not for their own business purposes.

### 13.3 Your CCPA/CPRA Rights

| Right | How to Exercise | Response Time |
|---|---|---|
| Right to know what personal information is collected | Email privacy@wedgemethod.com | 45 days (extendable 45 days) |
| Right to know what personal information is sold or disclosed | Email privacy@wedgemethod.com | 45 days |
| Right to delete personal information | Email privacy@wedgemethod.com or account settings | 45 days |
| Right to correct inaccurate personal information | Email privacy@wedgemethod.com | 45 days |
| Right to opt out of sale/sharing | N/A — we do not sell or share | — |
| Right to limit use of sensitive personal information | N/A — we do not process sensitive PI beyond service purposes | — |
| Right to non-discrimination | We will not discriminate for exercising CCPA rights | Immediate |

To submit a CCPA request, email privacy@wedgemethod.com with "CCPA Request" in the subject line. We will verify your identity before processing the request.

---

## 14. Do Not Track

We respect the Do Not Track (DNT) signal. When your browser sends a DNT signal, PostHog analytics are disabled for your session on the Quiet Method website. The Extension does not use any cross-site tracking and is not affected by DNT signals.

---

## 15. Changes to This Privacy Policy

We may update this Privacy Policy periodically. When we make material changes, we will:
- Update the "Last Updated" date at the top of this policy
- Notify Premium users via email at least 30 days before material changes take effect
- Post a notice on quietguard.app

Your continued use of the Service after the effective date of a revised policy constitutes acceptance of the changes. If you do not agree with changes, you may delete your account and uninstall the Extension before the effective date.

---

## 16. Contact Information

For any privacy questions, requests, or concerns, contact:

**WEDGE METHOD LLC**
Attn: Privacy
8977 S 1300 W Unit #615
West Jordan, UT 84088

**Email:** privacy@wedgemethod.com
**General Support:** support@wedgemethod.com
**Website:** https://quietguard.app/privacy

We are committed to resolving privacy inquiries promptly. For GDPR-related requests, we target a response within 5 business days of receipt and a resolution within 30 days.

---

*This Privacy Policy was last reviewed and updated on March 28, 2026.*

*© 2026 WEDGE METHOD LLC. All rights reserved.*
