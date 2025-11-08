# Gemini Bulk File Downloader

> A powerful Chrome extension to scan webpages and download files in bulk, powered by Gemini AI.

## Features

- **Standard Scan** - Fast, free scanning of obvious file links
- **AI Deep Scan** - Advanced AI-powered detection of hidden files (requires API key)
- **Batch Processing** - Scan multiple URLs at once (Pro feature)
- **Smart Filtering** - Filter by file type (Images, Videos, Documents, etc.)
- **Bulk Downloads** - Select and download multiple files simultaneously
- **Modern UI** - Clean, dark-themed interface

## Installation

### From Chrome Web Store

[Link to Chrome Web Store] - *Coming soon*

### Manual Installation (Development)

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the extension folder

## Getting Started

### 1. Install the Extension

Follow the installation steps above.

### 2. Get a Gemini API Key (For AI Features)

AI Deep Scan requires a free Gemini API key:

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 3. Configure the Extension

1. Click the extension icon in your Chrome toolbar
2. Click "Open Settings" button
3. Paste your API key
4. Click "Save API Key"

## How to Use

### Basic Scanning

1. **Navigate** to any webpage with downloadable files
2. **Click** the extension icon
3. **Enter** the URL (or use current page)
4. **Choose** scan type:
   - **Standard Scan** - Quick, free scan
   - **AI Deep Scan** - Advanced AI analysis

### Downloading Files

1. **Review** the detected files
2. **Filter** by type if needed (Images, Videos, etc.)
3. **Select** files you want to download
4. **Click** "Download Selected Files"

### Batch Scanning (Pro)

1. Click "Batch Scan" tab
2. Enter multiple URLs (one per line)
3. Click "Scan All URLs"
4. Wait for all scans to complete
5. Download your files

## Pricing

### Free Tier
- ✅ Unlimited Standard Scans
- ✅ 5 AI Deep Scans
- ❌ No Batch Processing

### Pro Version
- ✅ Unlimited Standard Scans
- ✅ Unlimited AI Deep Scans
- ✅ Batch URL Processing
- ✅ Priority Support

*Note: Current version uses demo Pro features for testing*

## File Types Supported

The extension can detect and download:

- 🖼️ **Images** - JPG, PNG, GIF, SVG, WebP
- 🎥 **Videos** - MP4, WebM, AVI, MOV
- 🎵 **Audio** - MP3, WAV, OGG
- 📄 **Documents** - PDF, DOC, DOCX, TXT
- 📦 **Archives** - ZIP, RAR, 7Z, TAR
- 💾 **Other** - Any other downloadable file

## FAQ

### Do I need an API key?

You need a Gemini API key only for the **AI Deep Scan** feature. Standard Scan works without an API key.

### Is the API key free?

Yes! Gemini offers a generous free tier. Check [pricing](https://ai.google.dev/pricing) for limits.

### Is my API key secure?

Yes. Your API key is stored locally in your browser using Chrome's secure storage. It never leaves your device except to call the Gemini API.

### Why can't it scan some websites?

Some websites block automated access or require authentication. The extension works best with public, accessible content.

### How do I upgrade to Pro?

The Pro version is currently in development. Stay tuned for updates!

### Does this work on other browsers?

Currently only Chrome is supported. Firefox and Edge support may come in future versions.

## Privacy

- Your API key is stored **locally** in your browser
- No data is sent to third parties except:
  - Gemini API (for AI scanning)
  - Target websites (to fetch content)
- No tracking or analytics
- No personal data collected

## Troubleshooting

### "API key is not configured" error

1. Click "Open Settings" in the error message
2. Enter your Gemini API key
3. Click "Save API Key"
4. Try scanning again

### Files not detected

- Try using **AI Deep Scan** instead of Standard Scan
- Some files may be dynamically loaded or protected
- Verify the page actually contains downloadable files

### Downloads not starting

- Check Chrome's download settings
- Verify you have permission to download files
- Some files may be blocked by Chrome's safe browsing

### Extension not loading

1. Check that developer mode is enabled
2. Try removing and re-adding the extension
3. Check `chrome://extensions` for error messages

## Support

For issues, questions, or feature requests:

- 📧 Email: [your-email]
- 🐛 Issues: [GitHub Issues](your-repo/issues)
- 📖 Docs: See `DEVELOPMENT.md` for technical details

## Changelog

### Version 1.0.0 (Current)

- Initial release
- Standard and AI Deep Scan
- File type filtering
- Bulk downloads
- API key management
- Modern UI with dark theme

## Roadmap

- [ ] Real CORS proxy implementation
- [ ] Firefox and Edge support
- [ ] File size detection
- [ ] Download queue management
- [ ] Custom file naming
- [ ] Download history
- [ ] Export scan results
- [ ] Chrome Web Store publication

## Credits

- Built with React + TypeScript + Vite
- Powered by Google Gemini AI
- UI styled with Tailwind CSS

## License

[Your license here]

---

**Made with ❤️ for the community**
