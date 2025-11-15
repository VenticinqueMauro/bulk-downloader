
import { GoogleGenAI, Type } from "@google/genai";
import { parse } from 'node-html-parser';
import { FileItem, FileCategory, ScanPreferences } from '../types';

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
 * Comprehensive file extension to type mapping
 * Covers 200+ file extensions across all major categories
 */
const FILE_EXTENSIONS: Record<string, FileCategory> = {
  // ===== Images =====
  jpg: 'Image', jpeg: 'Image', png: 'Image', gif: 'Image', svg: 'Image', webp: 'Image',
  bmp: 'Image', ico: 'Image', tiff: 'Image', tif: 'Image', psd: 'Image', ai: 'Image',
  eps: 'Image', raw: 'Image', cr2: 'Image', nef: 'Image', orf: 'Image', sr2: 'Image',
  heic: 'Image', heif: 'Image', avif: 'Image', jfif: 'Image', dng: 'Image',

  // ===== Videos =====
  mp4: 'Video', webm: 'Video', avi: 'Video', mov: 'Video', mkv: 'Video', flv: 'Video',
  wmv: 'Video', m4v: 'Video', mpg: 'Video', mpeg: 'Video', '3gp': 'Video', '3g2': 'Video',
  vob: 'Video', ogv: 'Video', m2ts: 'Video', mts: 'Video', swf: 'Video',
  f4v: 'Video', rm: 'Video', rmvb: 'Video', asf: 'Video', divx: 'Video',

  // ===== Audio =====
  mp3: 'Audio', wav: 'Audio', ogg: 'Audio', m4a: 'Audio', flac: 'Audio', aac: 'Audio',
  wma: 'Audio', opus: 'Audio', oga: 'Audio', mid: 'Audio', midi: 'Audio', ape: 'Audio',
  alac: 'Audio', aiff: 'Audio', aif: 'Audio', au: 'Audio', ra: 'Audio', amr: 'Audio',
  mka: 'Audio', dts: 'Audio', ac3: 'Audio', dsf: 'Audio', dff: 'Audio',

  // ===== Documents =====
  pdf: 'Document', doc: 'Document', docx: 'Document', txt: 'Document', rtf: 'Document',
  odt: 'Document', xls: 'Document', xlsx: 'Document', ppt: 'Document', pptx: 'Document',
  csv: 'Document', odp: 'Document', ods: 'Document', pages: 'Document', numbers: 'Document',
  key: 'Document', epub: 'Document', mobi: 'Document', azw: 'Document', azw3: 'Document',
  fb2: 'Document', djvu: 'Document', oxps: 'Document', xps: 'Document', tex: 'Document',
  md: 'Document', markdown: 'Document', rst: 'Document', adoc: 'Document', log: 'Document',

  // ===== Archives =====
  zip: 'Archive', rar: 'Archive', '7z': 'Archive', tar: 'Archive', gz: 'Archive',
  bz2: 'Archive', xz: 'Archive', lz: 'Archive', lzma: 'Archive', z: 'Archive',
  tgz: 'Archive', tbz2: 'Archive', txz: 'Archive', cab: 'Archive', arj: 'Archive',
  ace: 'Archive', zoo: 'Archive', lzh: 'Archive', alz: 'Archive', jar: 'Archive',
  war: 'Archive', ear: 'Archive', sar: 'Archive', rar5: 'Archive', zipx: 'Archive',
  iso: 'Archive', dmg: 'Archive', img: 'Archive', toast: 'Archive', vcd: 'Archive',

  // ===== Fonts =====
  ttf: 'Font', otf: 'Font', woff: 'Font', woff2: 'Font', eot: 'Font',
  fon: 'Font', fnt: 'Font', ttc: 'Font', pfa: 'Font', pfb: 'Font',
  pfm: 'Font', afm: 'Font', otc: 'Font', dfont: 'Font', suit: 'Font',

  // ===== Styles =====
  css: 'Style', scss: 'Style', sass: 'Style', less: 'Style', styl: 'Style',
  stylus: 'Style', pcss: 'Style', postcss: 'Style',

  // ===== Scripts =====
  js: 'Script', mjs: 'Script', cjs: 'Script', jsx: 'Script', ts: 'Script',
  tsx: 'Script', coffee: 'Script', ls: 'Script', iced: 'Script',

  // ===== Code =====
  py: 'Code', pyc: 'Code', pyo: 'Code', pyw: 'Code', pyx: 'Code',
  java: 'Code', class: 'Code',
  c: 'Code', cpp: 'Code', cc: 'Code', cxx: 'Code', h: 'Code', hpp: 'Code', hxx: 'Code',
  cs: 'Code', vb: 'Code', fs: 'Code', fsx: 'Code', fsi: 'Code',
  go: 'Code', rs: 'Code', swift: 'Code', kt: 'Code', kts: 'Code',
  rb: 'Code', php: 'Code', pl: 'Code', pm: 'Code', t: 'Code',
  lua: 'Code', r: 'Code', m: 'Code', mm: 'Code',
  scala: 'Code', clj: 'Code', cljs: 'Code', cljc: 'Code',
  erl: 'Code', hrl: 'Code', ex: 'Code', exs: 'Code',
  hs: 'Code', lhs: 'Code', elm: 'Code', ml: 'Code', mli: 'Code',
  dart: 'Code', nim: 'Code', cr: 'Code', v: 'Code', vhd: 'Code', vhdl: 'Code',
  asm: 'Code', s: 'Code', bas: 'Code', vbs: 'Code', bat: 'Code', cmd: 'Code',
  sh: 'Code', bash: 'Code', zsh: 'Code', fish: 'Code', ps1: 'Code', psm1: 'Code',

  // ===== 3D Models =====
  obj: 'Model3D', fbx: 'Model3D', dae: 'Model3D', gltf: 'Model3D', glb: 'Model3D',
  stl: 'Model3D', ply: 'Model3D', '3ds': 'Model3D', max: 'Model3D', blend: 'Model3D',
  ma: 'Model3D', mb: 'Model3D', c4d: 'Model3D', skp: 'Model3D', ztl: 'Model3D',
  x3d: 'Model3D', wrl: 'Model3D', vrml: 'Model3D', usd: 'Model3D', usda: 'Model3D',
  usdc: 'Model3D', usdz: 'Model3D', abc: 'Model3D',

  // ===== Data =====
  json: 'Data', xml: 'Data', yaml: 'Data', yml: 'Data', toml: 'Data',
  ini: 'Data', cfg: 'Data', conf: 'Data', config: 'Data', properties: 'Data',
  env: 'Data', sql: 'Data', db: 'Data', sqlite: 'Data', sqlite3: 'Data',
  mdb: 'Data', accdb: 'Data', dbf: 'Data', plist: 'Data', bson: 'Data',
  msgpack: 'Data', pickle: 'Data', parquet: 'Data', avro: 'Data', protobuf: 'Data',
  proto: 'Data', thrift: 'Data', cap: 'Data', pcap: 'Data', pcapng: 'Data',

  // ===== Executables =====
  exe: 'Executable', msi: 'Executable', app: 'Executable', apk: 'Executable',
  ipa: 'Executable', deb: 'Executable', rpm: 'Executable', pkg: 'Executable',
  run: 'Executable', bin: 'Executable', elf: 'Executable', out: 'Executable',
  com: 'Executable', gadget: 'Executable', appx: 'Executable', xap: 'Executable',

  // ===== Other (catch-all for remaining formats) =====
  dll: 'Other', so: 'Other', dylib: 'Other', lib: 'Other', a: 'Other',
  o: 'Other', ko: 'Other', sys: 'Other', drv: 'Other',
};

/**
 * Determine file type from URL or extension
 */
function getFileType(urlString: string): FileCategory {
  try {
    const pathname = new URL(urlString).pathname;
    const extension = pathname.split('.').pop()?.toLowerCase();
    return extension ? (FILE_EXTENSIONS[extension] || 'Other') : 'Other';
  } catch {
    return 'Other';
  }
}

/**
 * Extract file extension from URL
 */
function getFileExtension(urlString: string): string {
  try {
    const pathname = new URL(urlString).pathname;
    const parts = pathname.split('.');
    if (parts.length > 1) {
      return '.' + parts.pop()?.toLowerCase();
    }
    return '';
  } catch {
    return '';
  }
}

/**
 * Fetch file size via HEAD request
 * Returns 0 if unable to determine size
 */
async function fetchFileSize(url: string): Promise<number> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'cors',
      cache: 'no-cache'
    });

    if (response.ok) {
      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        return parseInt(contentLength, 10);
      }
    }
  } catch (error) {
    // Silently fail - CORS, network issues, etc.
    console.debug(`Could not fetch size for ${url}:`, error);
  }
  return 0;
}

/**
 * Extract filename from URL
 */
function getFileName(urlString: string, linkText: string = ''): string {
  try {
    const pathname = new URL(urlString).pathname;
    const filename = pathname.split('/').pop() || '';
    const extension = getFileExtension(urlString);

    // Use link text if available and meaningful
    if (linkText && linkText.length > 0 && linkText.length < 100) {
      const linkTextTrimmed = linkText.trim();
      // If link text doesn't have extension, append it
      if (extension && !linkTextTrimmed.toLowerCase().endsWith(extension.toLowerCase())) {
        return linkTextTrimmed + extension;
      }
      return linkTextTrimmed;
    }

    // Decode and use filename
    return decodeURIComponent(filename) || 'Unknown File';
  } catch {
    return linkText || 'Unknown File';
  }
}

/**
 * Helper function to check if a file matches the scan preferences
 */
function matchesPreferences(file: FileItem, preferences?: ScanPreferences): boolean {
  if (!preferences) return true; // No preferences = accept all

  // Check category filter
  if (preferences.categories.length > 0 && !preferences.categories.includes(file.type)) {
    return false;
  }

  // Check size filters
  if (preferences.minSize > 0 && file.size < preferences.minSize) {
    return false;
  }

  if (preferences.maxSize > 0 && file.size > preferences.maxSize) {
    return false;
  }

  return true;
}

/**
 * Standard Scan - DOM-based file detection
 *
 * Fetches HTML content and parses it for downloadable files.
 * Finds files in: <a> links, <img> src, <video> src, <audio> src, <source> src
 */
export const performStandardScan = async (
  url: string,
  preferences?: ScanPreferences
): Promise<FileItem[]> => {
  console.log(`🔍 Performing Standard Scan for: ${url}`);
  if (preferences) {
    console.log(`   Filters: Categories=${preferences.categories.join(', ')}, MinSize=${preferences.minSize}, MaxSize=${preferences.maxSize}`);
  }

  try {
    // Fetch content (will use proxy if configured, or mock if not)
    const html = await fetchUrlContent(url);

    // Parse HTML with node-html-parser (works in service workers)
    const doc = parse(html);

    const foundFiles = new Map<string, FileItem>();

    // 1. Find all <a> links with downloadable extensions
    const links = doc.querySelectorAll('a[href]');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;

      try {
        const absoluteUrl = new URL(href, url).href;
        const type = getFileType(absoluteUrl);

        // Accept all files with recognized extensions (removed restrictive filter!)
        const linkText = link.textContent?.trim() || '';
        foundFiles.set(absoluteUrl, {
          url: absoluteUrl,
          name: getFileName(absoluteUrl, linkText),
          type,
          size: 0
        });
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

    let results = Array.from(foundFiles.values());
    console.log(`✅ Standard Scan found ${results.length} files (before filtering)`);

    // Fetch file sizes in parallel (limit to avoid overwhelming the network)
    const BATCH_SIZE = 10;
    for (let i = 0; i < results.length; i += BATCH_SIZE) {
      const batch = results.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async (file) => {
          file.size = await fetchFileSize(file.url);
        })
      );
    }

    // Apply preference filters
    if (preferences) {
      results = results.filter(file => matchesPreferences(file, preferences));
      console.log(`   After filters: ${results.length} files match preferences`);
    }

    return results;

  } catch (error: any) {
    console.error('❌ Standard Scan failed:', error);
    throw new Error(`Standard Scan failed: ${error.message}`);
  }
};


// Configuration: Proxy URL is loaded from environment variables
// Set VITE_PROXY_URL in .env file
// Leave empty to use mock data for testing
const PROXY_URL = import.meta.env.VITE_PROXY_URL || '';

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

export const scanUrlWithAI = async (
  url: string,
  preferences?: ScanPreferences
): Promise<FileItem[]> => {
  // Get API key from storage
  const apiKey = await getApiKey();

  // Initialize Gemini AI client with the retrieved API key
  const ai = new GoogleGenAI({ apiKey });

  // Fetch URL content
  const pageContent = await fetchUrlContent(url);

  console.log(`🤖 Performing AI Scan for: ${url}`);
  if (preferences) {
    console.log(`   Filters: Categories=${preferences.categories.join(', ')}, MinSize=${preferences.minSize}, MaxSize=${preferences.maxSize}`);
  }

  // Build comprehensive prompt with all file categories
  const prompt = `Analyze the following HTML content from the URL "${url}" and extract all direct links to downloadable files.
  For each file, provide its absolute URL, a descriptive name based on the link text or file name, its file type, and its size in bytes (use 0 if unknown).

  The file type must be one of these categories:
  - 'Image': Images (jpg, png, gif, svg, webp, bmp, tiff, psd, etc.)
  - 'Video': Videos (mp4, webm, avi, mov, mkv, flv, etc.)
  - 'Audio': Audio files (mp3, wav, ogg, flac, aac, etc.)
  - 'Document': Documents (pdf, doc, docx, txt, xlsx, ppt, epub, etc.)
  - 'Archive': Compressed archives (zip, rar, 7z, tar, gz, iso, etc.)
  - 'Font': Font files (ttf, otf, woff, woff2, eot, etc.)
  - 'Style': Stylesheets (css, scss, sass, less, etc.)
  - 'Script': JavaScript/TypeScript (js, mjs, ts, jsx, tsx, etc.)
  - 'Code': Source code (py, java, c, cpp, go, rs, rb, php, etc.)
  - 'Model3D': 3D models (obj, fbx, gltf, glb, stl, blend, etc.)
  - 'Data': Data files (json, xml, yaml, yml, toml, sql, csv, etc.)
  - 'Executable': Executables (exe, app, apk, deb, msi, etc.)
  - 'Other': Anything else

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
                description: "The file's category: 'Image', 'Video', 'Audio', 'Document', 'Archive', 'Font', 'Style', 'Script', 'Code', 'Model3D', 'Data', 'Executable', or 'Other'."
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
    let files: FileItem[] = JSON.parse(jsonText);

    console.log(`✅ AI Scan found ${files.length} files (before filtering)`);

    // Basic post-processing to ensure URLs are absolute
    files = files.map(file => {
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

    // Apply preference filters
    if (preferences) {
      files = files.filter(file => matchesPreferences(file, preferences));
      console.log(`   After filters: ${files.length} files match preferences`);
    }

    return files;

  } catch (error) {
    console.error("Error scanning URL with Gemini:", error);
    // Provide a more helpful error message.
    throw new Error('Failed to parse file data from the URL. The AI model may have returned an unexpected response.');
  }
};
