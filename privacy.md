# Privacy Policy - FileHarvest

**Last Updated:** November 2025

## Introduction

This Privacy Policy describes how **FileHarvest** ("the Extension", "we", "our") collects, uses, and protects information when you use our Chrome extension.

Your privacy is important to us. This extension has been designed with privacy in mind, minimizing data collection and keeping your information secure.

## Information We DO NOT Collect

To be completely transparent, we **DO NOT collect, store, or share**:

- Personally identifiable information (name, address, phone, etc.)
- Email addresses
- Browsing history
- URLs you scan
- Files you download
- Payment or billing information
- Donation information (processed directly by PayPal/payment services)
- Cookies or tracking identifiers
- Location data
- Demographic information

## Information We Store Locally

The extension stores the following information **only in your browser** using the `chrome.storage.sync` API:

### 1. AI API Key
- **What it is:** The API key you obtain from Google AI Studio to use the AI Deep Scan feature
- **Where it's stored:** In your local browser via `chrome.storage.sync`
- **Who has access:** Only you, through your Chrome browser
- **Synchronization:** If you have Chrome sync enabled, this key will sync across your devices using Google's secure infrastructure
- **Control:** You can delete it at any time from the extension's Options page

### 2. User Status
- **What it is:** Information about your status (free or Pro user) and number of remaining AI scans
- **Where it's stored:** In browser memory during your session
- **Persistence:** Resets when you close and reopen the extension

## How We Use the CORS Proxy

To avoid browser security restrictions (CORS), the extension uses a proxy service deployed on Vercel:

### What does the proxy do?
- Acts as an intermediary to fetch HTML content from pages you want to scan
- Receives the URL you request to scan
- Downloads the content from that URL
- Returns the content to the extension

### What does the proxy NOT do?
- Does NOT log the URLs you scan
- Does NOT store downloaded content
- Does NOT collect personal information
- Does NOT share data with third parties

### Proxy Security Measures
- **Rate Limiting:** Maximum 30 requests per minute per IP address (to prevent abuse)
- **SSRF Protection:** Blocks access to localhost and private networks
- **Timeout:** Maximum 15 seconds per request
- **Size Limit:** Maximum 5MB per response
- **No Logs:** Requests are not logged after processing

## Use of Third-Party APIs

### Google Gemini API

When you use the **AI Deep Scan** feature, the extension sends the HTML content of the page to Google's Gemini API for analysis.

**What is sent to Gemini:**
- The HTML content of the page you're scanning
- A prompt asking what downloadable files are present

**What is NOT sent:**
- Your personal information
- Browsing history
- Data unrelated to the current scan

**Gemini Privacy:**
- Use of the Gemini API is subject to [Google's Privacy Policy](https://policies.google.com/privacy)
- You use your own API Key, so any usage is recorded in your Google Cloud account
- Google may process data according to their AI policies

### Chrome APIs

The extension uses the following Chrome APIs:

- **chrome.storage.sync:** To securely store your API Key
- **chrome.downloads:** To initiate file downloads
- **chrome.tabs:** To get the current tab's URL
- **chrome.runtime:** For internal extension management

These APIs are provided by Google Chrome and are subject to [Chrome's Privacy Policy](https://www.google.com/chrome/privacy/).

## Extension Permissions

The extension requests the following Chrome permissions:

### 1. `downloads`
- **Purpose:** Allow the extension to initiate file downloads
- **Usage:** Only when you click "Download Selected"
- **No access to:** Previous download history

### 2. `storage`
- **Purpose:** Securely store your API Key
- **Usage:** Save and retrieve your settings
- **No access to:** Data from other extensions or websites

### 3. `activeTab`
- **Purpose:** Read the URL of the current tab
- **Usage:** Auto-fill the URL field when you open the extension
- **No access to:** Page content or browsing history

### 4. `tabs`
- **Purpose:** Get basic information about the current tab
- **Usage:** Detect the current URL for scanning
- **No access to:** Sensitive content or history

### 5. `<all_urls>` (Host Permissions)
- **Purpose:** Allow downloads from any website
- **Usage:** Necessary for Chrome to permit downloading files from arbitrary URLs
- **No access to:** Data from pages you're not actively scanning

## Data Security

### Local Storage
- All your information is stored locally in your browser
- We use `chrome.storage.sync` which is encrypted by Chrome
- We don't have access to your stored data

### Data Transmission
- Communications with the proxy use HTTPS
- Communications with Gemini API use HTTPS
- No unencrypted data is transmitted

### No Proprietary Servers
- We don't operate servers that store user data
- The Vercel proxy is stateless and doesn't save information

## User Rights

You have the right to:

### 1. Access Your Data
- You can view your stored API Key in the Options page
- All information is in your local browser

### 2. Delete Your Data
- **Delete API Key:**
  - Go to the Options page
  - Click "Clear API Key"

- **Complete Uninstall:**
  - Go to `chrome://extensions/`
  - Click "Remove" on FileHarvest
  - Confirm removal
  - All local data will be automatically deleted

### 3. Data Portability
- You can copy your API Key from the Options page
- There is no other data to export

### 4. Not Be Tracked
- This extension DOES NOT track you
- We DON'T use analytics or user tracking
- We DON'T place third-party cookies

## Changes to This Policy

We may update this Privacy Policy occasionally. Changes will be reflected with a new "Last Updated" date at the top.

**We will notify you of significant changes:**
- Through an update to the extension on Chrome Web Store
- Including a notice in the version notes

**Your continued use of the extension after changes constitutes acceptance of the new policy.**

## Legal Compliance

### GDPR (General Data Protection Regulation)
If you are in the European Union:
- We don't collect personal data, so most of GDPR doesn't apply
- Your API Key is stored locally under your control
- We don't share data with third parties (except Google Gemini, using your own key)

### CCPA (California Consumer Privacy Act)
If you are in California:
- We don't sell personal information
- We don't share personal information for commercial purposes
- We don't collect personally identifiable information

### COPPA (Children's Online Privacy Protection Act)
- This extension is not directed at children under 13
- We don't intentionally collect information from minors
- If you're a parent and believe your child has provided information, contact us

## Third-Party Services

This extension interacts with the following third-party services:

### 1. Google Gemini API
- **Privacy Policy:** [https://policies.google.com/privacy](https://policies.google.com/privacy)
- **Usage:** AI-powered web content analysis
- **Your control:** You use your own API Key

### 2. Vercel (CORS Proxy)
- **Privacy Policy:** [https://vercel.com/legal/privacy-policy](https://vercel.com/legal/privacy-policy)
- **Usage:** Proxy service hosting
- **Data processed:** Requested URLs (not stored)

### 3. Chrome Web Store
- **Privacy Policy:** [https://policies.google.com/privacy](https://policies.google.com/privacy)
- **Usage:** Extension distribution
- **Data:** Installation/update information managed by Google

## User Responsibility

As a user, you are responsible for:

### 1. Protecting Your API Key
- Don't share your Gemini API Key with anyone
- Keep it secure
- Revoke and generate a new one if you believe it was compromised

### 2. Legal Use
- Only scan web pages you have the right to access
- Only download files you have the right to download
- Comply with the terms of service of websites you visit

### 3. Respect for Copyright
- Don't use the extension for piracy or copyright infringement
- Respect the licenses of files you download
- The developer is not responsible for misuse of the extension

## Optional Donations

FileHarvest is completely free. The extension includes optional links for voluntary donations.

**Important:**
- Donations are **100% optional** and don't affect extension functionality
- All donation transactions are processed directly by third-party payment services (PayPal, banks, etc.)
- We **don't collect or have access** to donation information or payment data
- We don't track who donates or how much they donate
- Donations don't unlock additional features (the extension is completely free for everyone)

Donation links redirect you to external services that have their own privacy policies:
- **PayPal**: [https://www.paypal.com/privacy](https://www.paypal.com/privacy)

## Contact

If you have questions, concerns, or requests related to this Privacy Policy:

- **Email:** mauro25qe@gmail.com
- **Website:** https://www.m25.com.ar
- **GitHub:** https://github.com/VenticinqueMauro/bulk-downloader

## Transparency

This extension is **open source**. You can:
- Review the source code to verify our claims
- Audit security and privacy
- Report issues or vulnerabilities

## Consent

By installing and using **FileHarvest**, you accept this Privacy Policy.

If you don't agree with this policy, please don't use the extension.

---

**This policy was designed to be clear, honest, and transparent. Your privacy is our priority.**

Last updated: November 2025
