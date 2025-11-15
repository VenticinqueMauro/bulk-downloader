
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
  logger.info(`Performing Standard Scan for: ${url}`);
  if (preferences) {
    logger.debug(`Filters: Categories=${preferences.categories.join(', ')}, MinSize=${preferences.minSize}, MaxSize=${preferences.maxSize}`);
  }

  try {
    // Fetch content (will use proxy if configured, or mock if not)
    const html = await fetchUrlContent(url);

    // Parse HTML with node-html-parser (works in service workers)
    const doc = parse(html);

    const foundFiles = new Map<string, FileItem>();

    // 1. Find all <a> links with downloadable extensions
    const links = doc.querySelectorAll('a[href]');
    logger.debug(`Found ${links.length} links in HTML`);

    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;

      try {
        const absoluteUrl = new URL(href, url).href;
        const type = getFileType(absoluteUrl);

        // Accept all files with recognized extensions
        const linkText = link.textContent?.trim() || '';
        foundFiles.set(absoluteUrl, {
          url: absoluteUrl,
          name: getFileName(absoluteUrl, linkText),
          type,
          size: 0
        });
      } catch (e) {
        // Invalid URL, skip silently
        logger.debug(`Skipping invalid link: ${href}`);
      }
    });

    // 2. Find all <img> tags
    const images = doc.querySelectorAll('img[src]');
    logger.debug(`Found ${images.length} images in HTML`);

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
        logger.debug(`Skipping invalid image: ${src}`);
      }
    });

    // 3. Find all <video> and <audio> tags
    const mediaElements = doc.querySelectorAll('video[src], audio[src], source[src]');
    logger.debug(`Found ${mediaElements.length} media elements in HTML`);

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
        logger.debug(`Skipping invalid media: ${src}`);
      }
    });

    let results = Array.from(foundFiles.values());
    logger.info(`Standard Scan found ${results.length} unique files (before filtering)`);

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
      const beforeFilter = results.length;
      results = results.filter(file => matchesPreferences(file, preferences));
      logger.info(`After filters: ${results.length}/${beforeFilter} files match preferences`);
    }

    // Record successful scan metrics
    recordScanMetrics('standard', true, results.length);

    return results;

  } catch (error: any) {
    logger.error('Standard Scan failed:', error);

    // Record failed scan metrics
    recordScanMetrics('standard', false, 0, error);

    // Re-throw with more specific error messages
    if (error instanceof ValidationError) {
      throw new Error(`Invalid URL: ${error.message}`);
    }
    if (error instanceof TimeoutError) {
      throw new Error(`Scan timeout: The website took too long to respond. Please try again.`);
    }
    if (error instanceof ProxyError) {
      throw new Error(`Proxy error: ${error.message}`);
    }

    throw new Error(`Standard Scan failed: ${error.message}`);
  }
};


// ===== CONFIGURATION =====
// Proxy URL is loaded from environment variables
// Set VITE_PROXY_URL in .env file
const PROXY_URL = import.meta.env.VITE_PROXY_URL || '';

// Request configuration
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: string; timestamp: number }>();

// ===== LOGGING UTILITIES =====
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

const logger = {
  debug: (message: string, ...args: any[]) => {
    console.debug(`🔍 [DEBUG] ${message}`, ...args);
  },
  info: (message: string, ...args: any[]) => {
    console.log(`ℹ️ [INFO] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`⚠️ [WARN] ${message}`, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(`❌ [ERROR] ${message}`, ...args);
  }
};

// ===== ERROR TYPES =====
export class ProxyError extends Error {
  constructor(message: string, public statusCode?: number, public originalError?: Error) {
    super(message);
    this.name = 'ProxyError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class TimeoutError extends Error {
  constructor(message: string = 'Request timeout') {
    super(message);
    this.name = 'TimeoutError';
  }
}

// ===== URL VALIDATION =====
/**
 * Validates URL before sending to proxy
 * Prevents SSRF attacks and invalid URLs
 */
function validateUrl(urlString: string): void {
  try {
    const url = new URL(urlString);

    // Only allow http/https protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new ValidationError(`Invalid protocol: ${url.protocol}. Only HTTP and HTTPS are allowed.`);
    }

    // Block local/private IPs to prevent SSRF
    const hostname = url.hostname.toLowerCase();
    const blockedHosts = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      '::1',
      '[::1]'
    ];

    if (blockedHosts.includes(hostname)) {
      throw new ValidationError('Local URLs are not allowed for security reasons.');
    }

    // Block private IP ranges
    if (
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)
    ) {
      throw new ValidationError('Private network URLs are not allowed for security reasons.');
    }

  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(`Invalid URL format: ${urlString}`);
  }
}

// ===== RETRY UTILITY =====
/**
 * Retry a function with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  baseDelay: number = RETRY_DELAY
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Don't retry on validation errors or 4xx errors
      if (
        error instanceof ValidationError ||
        error instanceof ApiKeyMissingError ||
        (error instanceof ProxyError && error.statusCode && error.statusCode >= 400 && error.statusCode < 500)
      ) {
        throw error;
      }

      // Last attempt - throw error
      if (attempt === maxRetries) {
        logger.error(`Max retries (${maxRetries}) reached. Giving up.`);
        throw error;
      }

      // Calculate exponential backoff delay
      const delay = baseDelay * Math.pow(2, attempt);
      logger.warn(`Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`, error.message);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

// ===== CACHE UTILITIES =====
/**
 * Get cached content if available and not expired
 */
function getCachedContent(url: string): string | null {
  const cached = cache.get(url);
  if (!cached) return null;

  const now = Date.now();
  if (now - cached.timestamp > CACHE_DURATION) {
    cache.delete(url);
    return null;
  }

  logger.debug(`Cache hit for URL: ${url}`);
  return cached.data;
}

/**
 * Store content in cache
 */
function setCachedContent(url: string, data: string): void {
  cache.set(url, { data, timestamp: Date.now() });
  logger.debug(`Cached content for URL: ${url}`);
}

/**
 * Clear expired cache entries
 */
function clearExpiredCache(): void {
  const now = Date.now();
  let cleared = 0;

  for (const [url, entry] of cache.entries()) {
    if (now - entry.timestamp > CACHE_DURATION) {
      cache.delete(url);
      cleared++;
    }
  }

  if (cleared > 0) {
    logger.debug(`Cleared ${cleared} expired cache entries`);
  }
}

/**
 * Clear all cache entries
 * Exported for manual cache management
 */
export function clearAllCache(): void {
  const size = cache.size;
  cache.clear();
  logger.info(`Cleared all cache (${size} entries)`);
}

/**
 * Get cache statistics
 * Exported for debugging and monitoring
 */
export function getCacheStats(): { size: number; entries: Array<{ url: string; age: number }> } {
  const now = Date.now();
  const entries = Array.from(cache.entries()).map(([url, entry]) => ({
    url,
    age: now - entry.timestamp
  }));

  return {
    size: cache.size,
    entries
  };
}

// ===== TELEMETRY & METRICS =====
interface ScanMetrics {
  totalScans: number;
  successfulScans: number;
  failedScans: number;
  totalFilesFound: number;
  averageFilesPerScan: number;
  scansByType: {
    standard: number;
    ai: number;
  };
  errors: {
    validation: number;
    timeout: number;
    proxy: number;
    apiKey: number;
    other: number;
  };
}

const metrics: ScanMetrics = {
  totalScans: 0,
  successfulScans: 0,
  failedScans: 0,
  totalFilesFound: 0,
  averageFilesPerScan: 0,
  scansByType: {
    standard: 0,
    ai: 0
  },
  errors: {
    validation: 0,
    timeout: 0,
    proxy: 0,
    apiKey: 0,
    other: 0
  }
};

/**
 * Record scan metrics
 */
function recordScanMetrics(type: 'standard' | 'ai', success: boolean, filesFound: number, error?: Error): void {
  metrics.totalScans++;
  metrics.scansByType[type]++;

  if (success) {
    metrics.successfulScans++;
    metrics.totalFilesFound += filesFound;
    metrics.averageFilesPerScan = metrics.totalFilesFound / metrics.successfulScans;
    logger.debug(`Scan metrics: ${filesFound} files found (avg: ${metrics.averageFilesPerScan.toFixed(1)})`);
  } else {
    metrics.failedScans++;

    // Categorize errors
    if (error instanceof ValidationError) {
      metrics.errors.validation++;
    } else if (error instanceof TimeoutError) {
      metrics.errors.timeout++;
    } else if (error instanceof ProxyError) {
      metrics.errors.proxy++;
    } else if (error instanceof ApiKeyMissingError) {
      metrics.errors.apiKey++;
    } else {
      metrics.errors.other++;
    }

    logger.debug(`Scan failed: ${error?.name || 'Unknown error'}`);
  }
}

/**
 * Get current metrics
 * Exported for monitoring and analytics
 */
export function getMetrics(): ScanMetrics {
  return { ...metrics };
}

/**
 * Reset all metrics
 * Exported for testing and manual reset
 */
export function resetMetrics(): void {
  metrics.totalScans = 0;
  metrics.successfulScans = 0;
  metrics.failedScans = 0;
  metrics.totalFilesFound = 0;
  metrics.averageFilesPerScan = 0;
  metrics.scansByType.standard = 0;
  metrics.scansByType.ai = 0;
  metrics.errors.validation = 0;
  metrics.errors.timeout = 0;
  metrics.errors.proxy = 0;
  metrics.errors.apiKey = 0;
  metrics.errors.other = 0;
  logger.info('Metrics reset');
}

/**
 * Fetch URL content via CORS proxy (internal implementation)
 * This is the core fetch logic without retry
 */
const fetchUrlContentInternal = async (url: string): Promise<string> => {
  // Validate URL before sending to proxy
  validateUrl(url);

  // Check cache first
  const cached = getCachedContent(url);
  if (cached) {
    logger.info(`Using cached content for: ${url}`);
    return cached;
  }

  // Clear expired cache entries periodically
  clearExpiredCache();

  logger.info(`Fetching content via proxy: ${url}`);

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const proxyUrl = `${PROXY_URL}?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl, {
      signal: controller.signal,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Try to parse error response as JSON
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || response.statusText;

      throw new ProxyError(
        `Proxy error: ${errorMessage}`,
        response.status
      );
    }

    const html = await response.text();

    if (!html || html.trim().length === 0) {
      throw new ProxyError('Proxy returned empty content', response.status);
    }

    logger.info(`Successfully fetched ${html.length} bytes from ${url}`);

    // Cache the result
    setCachedContent(url, html);

    return html;

  } catch (error: any) {
    clearTimeout(timeoutId);

    // Handle specific error types
    if (error.name === 'AbortError') {
      throw new TimeoutError(`Request timeout after ${REQUEST_TIMEOUT}ms`);
    }

    if (error instanceof ProxyError || error instanceof ValidationError) {
      throw error;
    }

    // Network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new ProxyError(
        'Cannot connect to proxy server. Please check your internet connection and proxy configuration.',
        undefined,
        error
      );
    }

    // Unknown errors
    throw new ProxyError(
      `Failed to fetch URL content: ${error.message}`,
      undefined,
      error
    );
  }
}

/**
 * Fetch URL content via CORS proxy
 *
 * Features:
 * - URL validation to prevent SSRF attacks
 * - Automatic retry with exponential backoff
 * - Request timeout (30s default)
 * - Response caching (5min default)
 * - Comprehensive error handling
 *
 * If PROXY_URL is not set, returns mock data for testing.
 * In production, you must deploy a proxy backend (see PROXY_SETUP.md)
 */
const fetchUrlContent = async (url: string): Promise<string> => {
  // Use mock data if no proxy is configured
  if (!PROXY_URL || PROXY_URL.trim() === '') {
    logger.warn('No PROXY_URL configured. Using mock data.');
    logger.info('To fetch real content, deploy a proxy (see PROXY_SETUP.md) and set VITE_PROXY_URL in .env');

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

  // Fetch with retry logic
  return retryWithBackoff(() => fetchUrlContentInternal(url));
};

export const scanUrlWithAI = async (
  url: string,
  preferences?: ScanPreferences
): Promise<FileItem[]> => {
  logger.info(`Performing AI Scan for: ${url}`);
  if (preferences) {
    logger.debug(`Filters: Categories=${preferences.categories.join(', ')}, MinSize=${preferences.minSize}, MaxSize=${preferences.maxSize}`);
  }

  try {
    // Get API key from storage
    const apiKey = await getApiKey();

    // Initialize Gemini AI client with the retrieved API key
    const ai = new GoogleGenAI({ apiKey });

    // Fetch URL content
    const pageContent = await fetchUrlContent(url);
    logger.debug(`Fetched ${pageContent.length} bytes of HTML content`);

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

    logger.info('Calling Gemini API with model: gemini-2.5-flash');

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

    logger.info('Gemini API response received');
    const jsonText = response.text.trim();
    logger.debug(`Response length: ${jsonText.length} characters`);

    // Parse the JSON response
    let files: FileItem[] = JSON.parse(jsonText);
    logger.info(`AI Scan found ${files.length} files (before filtering)`);

    // Basic post-processing to ensure URLs are absolute
    files = files.map(file => {
      try {
        return {
          ...file,
          url: new URL(file.url, url).href,
        };
      } catch (e) {
        logger.warn(`Invalid URL in AI response: ${file.url}`);
        return file;
      }
    });

    // Apply preference filters
    if (preferences) {
      const beforeFilter = files.length;
      files = files.filter(file => matchesPreferences(file, preferences));
      logger.info(`After filters: ${files.length}/${beforeFilter} files match preferences`);
    }

    // Record successful scan metrics
    recordScanMetrics('ai', true, files.length);

    return files;

  } catch (error: any) {
    logger.error("AI Scan failed:", error);
    logger.debug("Error details:", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
      cause: error?.cause
    });

    // Record failed scan metrics
    recordScanMetrics('ai', false, 0, error);

    // Handle specific error types
    if (error instanceof ApiKeyMissingError) {
      throw error; // Re-throw as-is
    }

    if (error instanceof ValidationError) {
      throw new Error(`Invalid URL: ${error.message}`);
    }

    if (error instanceof TimeoutError) {
      throw new Error(`AI Scan timeout: The website took too long to respond. Please try again.`);
    }

    if (error instanceof ProxyError) {
      throw new Error(`Proxy error: ${error.message}`);
    }

    // Provide detailed error messages for Gemini API errors
    const errorMsg = error?.message?.toLowerCase() || '';

    if (errorMsg.includes('api key') || errorMsg.includes('authentication')) {
      throw new Error('Gemini API Key error. Please verify your API key configuration.');
    }

    if (errorMsg.includes('quota') || errorMsg.includes('rate limit')) {
      throw new Error('Gemini API quota exceeded. Please try again later or upgrade your plan.');
    }

    if (errorMsg.includes('network') || errorMsg.includes('fetch') || errorMsg.includes('connection')) {
      throw new Error('Network error connecting to Gemini API. Please check your internet connection.');
    }

    if (errorMsg.includes('parse') || errorMsg.includes('json')) {
      throw new Error('Failed to parse AI response. The content may be too complex. Try Standard Scan instead.');
    }

    // Generic error
    throw new Error(`AI Scan failed: ${error?.message || 'Unknown error'}`);
  }
};
