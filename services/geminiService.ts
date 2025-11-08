
import { GoogleGenAI, Type } from "@google/genai";
import { FileItem } from '../types';

// Error class for missing API key
export class ApiKeyMissingError extends Error {
  constructor() {
    super('Gemini API key is not configured. Please set your API key in the extension options.');
    this.name = 'ApiKeyMissingError';
  }
}

// Helper function to get API key from chrome.storage
const getApiKey = async (): Promise<string> => {
  try {
    const result = await chrome.storage.sync.get(['geminiApiKey']);
    if (!result.geminiApiKey || result.geminiApiKey.trim() === '') {
      throw new ApiKeyMissingError();
    }
    return result.geminiApiKey;
  } catch (error) {
    if (error instanceof ApiKeyMissingError) {
      throw error;
    }
    console.error('Error retrieving API key from storage:', error);
    throw new Error('Failed to retrieve API key from storage.');
  }
};

/**
 * File extension to type mapping
 */
const FILE_EXTENSIONS: Record<string, string> = {
  // Images
  jpg: 'Image', jpeg: 'Image', png: 'Image', gif: 'Image', svg: 'Image', webp: 'Image', bmp: 'Image', ico: 'Image',
  // Videos
  mp4: 'Video', webm: 'Video', avi: 'Video', mov: 'Video', mkv: 'Video', flv: 'Video', wmv: 'Video', m4v: 'Video',
  // Audio
  mp3: 'Audio', wav: 'Audio', ogg: 'Audio', m4a: 'Audio', flac: 'Audio', aac: 'Audio', wma: 'Audio',
  // Documents
  pdf: 'Document', doc: 'Document', docx: 'Document', txt: 'Document', rtf: 'Document', odt: 'Document',
  xls: 'Document', xlsx: 'Document', ppt: 'Document', pptx: 'Document', csv: 'Document',
  // Archives
  zip: 'Archive', rar: 'Archive', '7z': 'Archive', tar: 'Archive', gz: 'Archive', bz2: 'Archive',
  // Other
  json: 'Other', xml: 'Other', exe: 'Other', dmg: 'Other', apk: 'Other', iso: 'Other'
};

/**
 * Determine file type from URL or extension
 */
function getFileType(urlString: string): string {
  try {
    const pathname = new URL(urlString).pathname;
    const extension = pathname.split('.').pop()?.toLowerCase();
    return extension ? (FILE_EXTENSIONS[extension] || 'Other') : 'Other';
  } catch {
    return 'Other';
  }
}

/**
 * Extract filename from URL
 */
function getFileName(urlString: string, linkText: string = ''): string {
  try {
    const pathname = new URL(urlString).pathname;
    const filename = pathname.split('/').pop() || '';

    // Use link text if available and meaningful
    if (linkText && linkText.length > 0 && linkText.length < 100) {
      return linkText.trim();
    }

    // Decode and use filename
    return decodeURIComponent(filename) || 'Unknown File';
  } catch {
    return linkText || 'Unknown File';
  }
}

/**
 * Standard Scan - DOM-based file detection
 *
 * Fetches HTML content and parses it for downloadable files.
 * Finds files in: <a> links, <img> src, <video> src, <audio> src, <source> src
 */
export const performStandardScan = async (url: string): Promise<FileItem[]> => {
  console.log(`🔍 Performing Standard Scan for: ${url}`);

  try {
    // Fetch content (will use proxy if configured, or mock if not)
    const html = await fetchUrlContent(url);

    // Parse HTML with DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const foundFiles = new Map<string, FileItem>();

    // 1. Find all <a> links with downloadable extensions
    const links = doc.querySelectorAll('a[href]');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;

      try {
        const absoluteUrl = new URL(href, url).href;
        const type = getFileType(absoluteUrl);

        // Only include if it has a recognizable file extension
        if (type !== 'Other' || href.match(/\.(exe|dmg|apk|iso|json|xml)$/i)) {
          const linkText = link.textContent?.trim() || '';
          foundFiles.set(absoluteUrl, {
            url: absoluteUrl,
            name: getFileName(absoluteUrl, linkText),
            type,
            size: 0
          });
        }
      } catch (e) {
        // Invalid URL, skip
      }
    });

    // 2. Find all <img> tags
    const images = doc.querySelectorAll('img[src]');
    images.forEach((img) => {
      const src = img.getAttribute('src');
      if (!src) return;

      try {
        const absoluteUrl = new URL(src, url).href;
        const alt = img.getAttribute('alt') || '';
        foundFiles.set(absoluteUrl, {
          url: absoluteUrl,
          name: getFileName(absoluteUrl, alt),
          type: 'Image',
          size: 0
        });
      } catch (e) {
        // Invalid URL, skip
      }
    });

    // 3. Find all <video> and <audio> tags
    const mediaElements = doc.querySelectorAll('video[src], audio[src], source[src]');
    mediaElements.forEach((media) => {
      const src = media.getAttribute('src');
      if (!src) return;

      try {
        const absoluteUrl = new URL(src, url).href;
        const type = getFileType(absoluteUrl);
        foundFiles.set(absoluteUrl, {
          url: absoluteUrl,
          name: getFileName(absoluteUrl),
          type,
          size: 0
        });
      } catch (e) {
        // Invalid URL, skip
      }
    });

    const results = Array.from(foundFiles.values());
    console.log(`✅ Standard Scan found ${results.length} files`);

    return results;

  } catch (error: any) {
    console.error('❌ Standard Scan failed:', error);
    throw new Error(`Standard Scan failed: ${error.message}`);
  }
};


// Configuration: Set your deployed proxy URL here
// To deploy your own proxy, see PROXY_SETUP.md
// Leave empty to use mock data for testing
const PROXY_URL = ''; // Example: 'https://your-project.vercel.app/api/scrape'

/**
 * Fetch URL content via CORS proxy
 *
 * If PROXY_URL is not set, returns mock data for testing.
 * In production, you must deploy a proxy backend (see PROXY_SETUP.md)
 */
const fetchUrlContent = async (url: string): Promise<string> => {
  // Use mock data if no proxy is configured
  if (!PROXY_URL || PROXY_URL.trim() === '') {
    console.warn('⚠️ No PROXY_URL configured. Using mock data.');
    console.log(`📝 To fetch real content, deploy a proxy (see PROXY_SETUP.md) and set PROXY_URL in geminiService.ts`);

    // Return mock HTML for testing
    return `
      <html>
        <body>
          <h1>Mock Files Page</h1>
          <p>This is mock data. Configure PROXY_URL to fetch real content.</p>
          <a href="https://example.com/files/image.jpg">Download JPG Image</a>
          <a href="/files/document.pdf">Important Document (PDF)</a>
          <img src="https://example.com/files/photo.png" alt="A nice photo" />
          <a href="https://example.com/archive.zip">Download ZIP Archive</a>
          <a href="https://example.com/data.json">Some JSON data</a>
          <video controls src="https://example.com/video.mp4"></video>
          <audio controls src="https://example.com/audio.mp3"></audio>
        </body>
      </html>
    `;
  }

  // Fetch real content via proxy
  try {
    console.log(`🌐 Fetching content via proxy: ${url}`);

    const proxyUrl = `${PROXY_URL}?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
        `Proxy returned ${response.status}: ${response.statusText}`
      );
    }

    const html = await response.text();
    console.log(`✅ Successfully fetched ${html.length} bytes from ${url}`);

    return html;
  } catch (error: any) {
    console.error('❌ Error fetching URL via proxy:', error);

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(
        `Cannot connect to proxy server. Please check that the proxy is deployed and PROXY_URL is correct. Error: ${error.message}`
      );
    }

    throw new Error(`Failed to fetch URL content: ${error.message}`);
  }
};

export const scanUrlWithAI = async (url: string): Promise<FileItem[]> => {
  // Get API key from storage
  const apiKey = await getApiKey();

  // Initialize Gemini AI client with the retrieved API key
  const ai = new GoogleGenAI({ apiKey });

  // Mock fetching URL content for the demo
  const pageContent = await fetchUrlContent(url);

  // FIX: Removed redundant instruction to return JSON from the prompt, as `responseMimeType` and `responseSchema` already enforce this.
  const prompt = `Analyze the following HTML content from the URL "${url}" and extract all direct links to downloadable files.
  For each file, provide its absolute URL, a descriptive name based on the link text or file name, its file type, and its size in bytes (use 0 if unknown).
  The file type must be one of: 'Image', 'Video', 'Audio', 'Document', 'Archive', 'Other'.
  Base the URL on the provided page URL: ${url}. Relative links like '/files/document.pdf' should be resolved to absolute URLs.

  HTML content:
  \`\`\`html
  ${pageContent}
  \`\`\`
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              url: {
                type: Type.STRING,
                description: 'The full, absolute URL of the file.'
              },
              name: {
                type: Type.STRING,
                description: 'A descriptive name for the file.'
              },
              type: {
                type: Type.STRING,
                description: "The file's category: 'Image', 'Video', 'Audio', 'Document', 'Archive', or 'Other'."
              },
              size: {
                type: Type.NUMBER,
                description: 'The file size in bytes. Use 0 if unknown.'
              }
            },
            required: ['url', 'name', 'type', 'size'],
          },
        },
      }
    });

    const jsonText = response.text.trim();
    // Assuming the Gemini API returns a valid JSON string based on the schema.
    const files: FileItem[] = JSON.parse(jsonText);

    // Basic post-processing to ensure URLs are absolute
    return files.map(file => {
      try {
        return {
          ...file,
          url: new URL(file.url, url).href,
        };
      } catch (e) {
        // If URL is malformed, keep original
        return file;
      }
    });

  } catch (error) {
    console.error("Error scanning URL with Gemini:", error);
    // Provide a more helpful error message.
    throw new Error('Failed to parse file data from the URL. The AI model may have returned an unexpected response.');
  }
};
