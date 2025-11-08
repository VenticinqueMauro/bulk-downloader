# FileHarvest - Development Guide

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Google Chrome browser
- Google AI API key ([Get one here](https://aistudio.google.com/apikey))

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd bulk-downloader
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Load extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select the project root directory (not the dist folder during development)

4. **Configure API Key**
   - Click the extension icon in Chrome toolbar
   - Click "Open Settings" button
   - Paste your AI API key
   - Click "Save API Key"

### Building for Production

```bash
npm run build
```

This will create a `dist/` folder with:
- `popup.html` and `popup.js` - Main extension UI
- `options.html` and `options.js` - Settings page
- `manifest.json` - Extension manifest
- `assets/` - CSS and other assets

To load the production build:
1. Go to `chrome://extensions/`
2. Load unpacked
3. Select the `dist/` folder

## Project Structure

```
bulk-downloader/
├── components/          # React UI components
│   ├── Header.tsx
│   ├── UrlInputForm.tsx
│   ├── FileList.tsx
│   ├── FilterBar.tsx
│   ├── ActionBar.tsx
│   ├── ProModal.tsx
│   └── WelcomeSplash.tsx
├── services/           # Business logic
│   └── geminiService.ts  # Gemini AI integration & URL scanning
├── App.tsx            # Main application component
├── index.tsx          # Popup entry point
├── options.tsx        # Options page entry point
├── popup.html         # Popup HTML template
├── options.html       # Options HTML template
├── manifest.json      # Chrome extension manifest
├── types.ts           # TypeScript type definitions
├── vite.config.ts     # Vite build configuration
└── index.css          # Global styles (Tailwind)
```

## Architecture

### Component Hierarchy

```
App
├── Header
├── UrlInputForm
├── FilterBar
├── FileList
│   └── FileItemRow (multiple)
├── ActionBar
├── ProModal
└── WelcomeSplash
```

### Data Flow

1. **User inputs URL** → `UrlInputForm`
2. **Triggers scan** → `App.handleStandardScan()` or `App.handleAiScan()`
3. **Calls service** → `geminiService.scanUrlWithAI()`
4. **Gets API key** → `chrome.storage.sync.get()`
5. **Initializes Gemini** → `GoogleGenAI({ apiKey })`
6. **Fetches content** → `fetchUrlContent()` (currently mocked)
7. **AI processes** → `ai.models.generateContent()`
8. **Returns files** → `FileItem[]`
9. **Updates UI** → `setAllFiles()`
10. **User downloads** → `chrome.downloads.download()`

### State Management

State is managed in `App.tsx` using React hooks:

- `userData` - User profile (Pro status, credits)
- `allFiles` - All scanned files
- `isLoading` - Loading state
- `error` - Error messages
- `currentFilter` - Active file type filter
- `selectedFileUrls` - Selected files for download
- `isProModalOpen` - Pro upgrade modal visibility

### Chrome Extension APIs Used

- `chrome.storage.sync` - Secure API key storage
- `chrome.downloads` - File downloads
- `chrome.runtime.openOptionsPage()` - Open settings

## Key Features Implementation

### 1. API Key Management

**Location**: `options.tsx`, `services/geminiService.ts`

API keys are stored in `chrome.storage.sync`:
```typescript
// Save
await chrome.storage.sync.set({ geminiApiKey: 'key' });

// Retrieve
const result = await chrome.storage.sync.get(['geminiApiKey']);
const apiKey = result.geminiApiKey;
```

### 2. AI Scanning

**Location**: `services/geminiService.ts:69`

Uses Gemini's structured output with JSON schema:
```typescript
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: prompt,
  config: {
    responseMimeType: "application/json",
    responseSchema: { /* FileItem schema */ }
  }
});
```

### 3. Batch Scanning (Parallel)

**Location**: `App.tsx:77`

Uses `Promise.allSettled` for concurrent processing:
```typescript
const results = await Promise.allSettled(
  urls.map(url => scanUrlWithAI(url))
);
```

### 4. File Downloads

**Location**: `components/ActionBar.tsx`

Uses Chrome Downloads API:
```typescript
chrome.downloads.download({
  url: file.url,
  filename: file.name
});
```

## Development Workflow

### Making Changes

1. **Edit files** - Changes auto-reload in dev mode
2. **Test in Chrome** - Click extension icon to test
3. **Check console** - Open DevTools for extension popup
4. **Build** - Run `npm run build` before committing

### Testing Changes

- **Popup**: Right-click extension icon → Inspect popup
- **Options**: Right-click extension icon → Options → Inspect
- **Background**: chrome://extensions → Inspect views: service worker

### Common Development Tasks

**Add a new component:**
```bash
# Create file in components/
touch components/NewComponent.tsx

# Import in App.tsx
import { NewComponent } from './components/NewComponent';
```

**Add a new Chrome permission:**
```json
// manifest.json
{
  "permissions": ["storage", "downloads", "tabs"]
}
```

**Update Tailwind styles:**
```tsx
// Edit className in components
<div className="bg-gray-900 text-white p-4">
```

## Known Issues & Limitations

### 1. CORS Restrictions (Critical)

**Problem**: `fetchUrlContent()` is currently mocked because browser extensions cannot fetch arbitrary URLs due to CORS.

**Solution**: Implement a backend proxy (see `PROXY_SETUP.md`)

**Temporary workaround**: The extension works with mock data for demonstration.

### 2. Standard Scan

**Current state**: Returns hardcoded mock data

**Future**: Implement basic HTML parsing without AI:
```typescript
// Parse DOM directly
const parser = new DOMParser();
const doc = parser.parseFromString(html, 'text/html');
const links = doc.querySelectorAll('a[href]');
```

### 3. File Size Detection

**Current state**: Returns `0` or estimated sizes

**Future**: Make HEAD requests to get actual file sizes:
```typescript
const response = await fetch(url, { method: 'HEAD' });
const size = response.headers.get('content-length');
```

## Troubleshooting

### Extension doesn't load
- Check `chrome://extensions` for errors
- Verify `manifest.json` is valid JSON
- Ensure all files referenced in manifest exist

### API Key errors
- Open Options page and re-save API key
- Check browser console for storage errors
- Verify API key is valid at [AI Studio](https://aistudio.google.com/)

### Build errors
- Delete `node_modules` and `dist` folders
- Run `npm install` again
- Check Node.js version (needs 18+)

### CORS errors in console
- Expected behavior - needs proxy backend
- See `PROXY_SETUP.md` for solution

## Contributing

### Code Style

- Use TypeScript for type safety
- Follow React functional component patterns
- Use Tailwind for styling (no inline styles)
- Keep components small and focused
- Add comments for complex logic

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: add your feature"

# Push and create PR
git push origin feature/your-feature
```

### Commit Message Format

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code restructuring
- `test:` - Tests
- `chore:` - Maintenance

## Resources

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Gemini API Docs](https://ai.google.dev/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## Next Steps

Priority tasks for production readiness:

1. **Deploy proxy backend** (see `PROXY_SETUP.md`)
2. **Update `fetchUrlContent`** to use real proxy
3. **Implement real standard scan** (DOM parsing)
4. **Add file size detection** (HEAD requests)
5. **Add progress indicators** for batch scans
6. **Implement error recovery** and retry logic
7. **Add analytics** (optional, privacy-focused)
8. **Create promotional assets** for Chrome Web Store
9. **Write user documentation**
10. **Submit to Chrome Web Store**

## License

[Add your license here]
