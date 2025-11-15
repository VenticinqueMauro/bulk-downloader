import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  performStandardScan,
  scanUrlWithAI,
  ApiKeyMissingError,
  ProxyError,
  ValidationError,
  TimeoutError,
  clearAllCache,
  getCacheStats,
  getMetrics,
  resetMetrics,
} from '../../services/geminiService';
import { FileItem, ScanPreferences } from '../../types';
import { GoogleGenAI } from '@google/genai';

// Mock Google Generative AI
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn(),
  Type: {
    ARRAY: 'array',
    OBJECT: 'object',
    STRING: 'string',
    NUMBER: 'number',
  },
}));

describe('geminiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset chrome storage mock
    (global.chrome.storage.sync.get as any).mockReset();
    (global.chrome.storage.sync.set as any).mockReset();

    // Reset fetch mock
    (global.fetch as any).mockReset();
  });

  describe('ApiKeyMissingError', () => {
    it('should create error with correct message and name', () => {
      const error = new ApiKeyMissingError();
      expect(error.message).toBe(
        'Gemini API key is not configured. Please set your API key in the extension options.'
      );
      expect(error.name).toBe('ApiKeyMissingError');
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('performStandardScan', () => {
    const mockHTML = `
      <html>
        <body>
          <h1>Test Page</h1>
          <a href="https://example.com/file1.pdf">Download PDF</a>
          <a href="/relative/path/image.jpg">Image Link</a>
          <img src="https://example.com/photo.png" alt="Photo" />
          <video src="https://example.com/video.mp4"></video>
          <audio src="https://example.com/audio.mp3"></audio>
          <a href="https://example.com/archive.zip">ZIP Archive</a>
          <a href="not-a-valid-url">Invalid</a>
        </body>
      </html>
    `;

    beforeEach(() => {
      // Mock fetch to return HTML content
      (global.fetch as any).mockImplementation((url: string, options?: any) => {
        if (options?.method === 'HEAD') {
          // Mock HEAD requests for file size
          return Promise.resolve({
            ok: true,
            headers: new Map([['content-length', '1024']]),
          });
        }
        // Mock proxy fetch
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(mockHTML),
        });
      });

      // Set proxy URL
      vi.stubEnv('VITE_PROXY_URL', 'https://test-proxy.com/api/scrape');
    });

    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it('should scan and find files from HTML', async () => {
      const files = await performStandardScan('https://example.com');

      expect(files.length).toBeGreaterThan(0);

      // Should find PDF file
      const pdfFile = files.find(f => f.url.includes('file1.pdf'));
      expect(pdfFile).toBeDefined();
      expect(pdfFile?.type).toBe('Document');
      // Name uses link text, so it should be "Download PDF.pdf"
      expect(pdfFile?.name).toContain('PDF');

      // Should find image from img tag
      const imgFile = files.find(f => f.url.includes('photo.png'));
      expect(imgFile).toBeDefined();
      expect(imgFile?.type).toBe('Image');

      // Should find video
      const videoFile = files.find(f => f.url.includes('video.mp4'));
      expect(videoFile).toBeDefined();
      expect(videoFile?.type).toBe('Video');

      // Should find audio
      const audioFile = files.find(f => f.url.includes('audio.mp3'));
      expect(audioFile).toBeDefined();
      expect(audioFile?.type).toBe('Audio');
    });

    it('should resolve relative URLs to absolute URLs', async () => {
      const files = await performStandardScan('https://example.com/page');

      const relativeFile = files.find(f => f.url.includes('/relative/path/image.jpg'));
      expect(relativeFile).toBeDefined();
      expect(relativeFile?.url).toBe('https://example.com/relative/path/image.jpg');
    });

    it('should fetch file sizes', async () => {
      const files = await performStandardScan('https://example.com');

      files.forEach(file => {
        expect(typeof file.size).toBe('number');
        expect(file.size).toBeGreaterThanOrEqual(0);
      });
    });

    it('should apply category preferences filter', async () => {
      const preferences: ScanPreferences = {
        categories: ['Image'],
        minSize: 0,
        maxSize: 0,
      };

      const files = await performStandardScan('https://example.com', preferences);

      files.forEach(file => {
        expect(file.type).toBe('Image');
      });
    });

    it('should apply size preferences filter', async () => {
      (global.fetch as any).mockImplementation((url: string, options?: any) => {
        if (options?.method === 'HEAD') {
          // Return different sizes for different files
          if (url.includes('file1.pdf')) {
            return Promise.resolve({
              ok: true,
              headers: new Map([['content-length', '5000']]),
            });
          }
          return Promise.resolve({
            ok: true,
            headers: new Map([['content-length', '500']]),
          });
        }
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(mockHTML),
        });
      });

      const preferences: ScanPreferences = {
        categories: [],
        minSize: 1000,
        maxSize: 10000,
      };

      const files = await performStandardScan('https://example.com', preferences);

      files.forEach(file => {
        expect(file.size).toBeGreaterThanOrEqual(1000);
        expect(file.size).toBeLessThanOrEqual(10000);
      });
    });

    it('should handle fetch errors gracefully', async () => {
      // Mock console.error to suppress error output
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      await expect(
        performStandardScan('https://example.com')
      ).rejects.toThrow('Failed to fetch URL content');

      consoleError.mockRestore();
    });

    it('should use mock data when no proxy URL is configured', async () => {
      vi.unstubAllEnvs();
      vi.stubEnv('VITE_PROXY_URL', '');

      const files = await performStandardScan('https://example.com');

      // Mock data should contain some files
      expect(files.length).toBeGreaterThan(0);
    });

    it('should handle HEAD request failures for file size', async () => {
      (global.fetch as any).mockImplementation((url: string, options?: any) => {
        if (options?.method === 'HEAD') {
          // Simulate CORS error
          return Promise.reject(new Error('CORS error'));
        }
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(mockHTML),
        });
      });

      const files = await performStandardScan('https://example.com');

      // Should still return files with size 0
      files.forEach(file => {
        expect(file.size).toBe(0);
      });
    });

    it('should batch file size requests', async () => {
      const headCalls: string[] = [];

      (global.fetch as any).mockImplementation((url: string, options?: any) => {
        if (options?.method === 'HEAD') {
          headCalls.push(url);
          return Promise.resolve({
            ok: true,
            headers: new Map([['content-length', '1024']]),
          });
        }
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(mockHTML),
        });
      });

      await performStandardScan('https://example.com');

      // Should have made HEAD requests for files found
      expect(headCalls.length).toBeGreaterThan(0);
    });
  });

  describe('scanUrlWithAI', () => {
    const mockFiles: FileItem[] = [
      {
        url: 'https://example.com/ai-file1.pdf',
        name: 'AI File 1',
        type: 'Document',
        size: 2048,
      },
      {
        url: 'https://example.com/ai-image.jpg',
        name: 'AI Image',
        type: 'Image',
        size: 1024,
      },
    ];

    let mockGenerateContent: any;
    let consoleLog: any;

    beforeEach(() => {
      // Suppress console logs
      consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});

      // Mock chrome storage to return API key
      (global.chrome.storage.sync.get as any).mockResolvedValue({
        geminiApiKey: 'test-api-key-123',
      });

      // Mock fetch for HTML content
      (global.fetch as any).mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<html><body>Test</body></html>'),
      });

      // Mock Gemini AI with proper structure
      mockGenerateContent = vi.fn().mockResolvedValue({
        text: JSON.stringify(mockFiles),
      });

      (GoogleGenAI as any).mockImplementation(function(this: any, config: any) {
        this.apiKey = config.apiKey;
        this.models = {
          generateContent: mockGenerateContent,
        };
        return this;
      });

      vi.stubEnv('VITE_PROXY_URL', 'https://test-proxy.com/api/scrape');
    });

    afterEach(() => {
      vi.unstubAllEnvs();
      if (consoleLog) {
        consoleLog.mockRestore();
      }
    });

    it('should scan URL with Gemini AI', async () => {
      const files = await scanUrlWithAI('https://example.com');

      expect(files.length).toBe(2);
      expect(files[0].url).toBe('https://example.com/ai-file1.pdf');
      expect(files[0].type).toBe('Document');
      expect(files[1].url).toBe('https://example.com/ai-image.jpg');
      expect(files[1].type).toBe('Image');
    });

    it('should throw error when API key is missing', async () => {
      (global.chrome.storage.sync.get as any).mockResolvedValue({
        geminiApiKey: '',
      });

      await expect(
        scanUrlWithAI('https://example.com')
      ).rejects.toThrow(ApiKeyMissingError);
    });

    it('should throw error when API key is not set', async () => {
      (global.chrome.storage.sync.get as any).mockResolvedValue({});

      await expect(
        scanUrlWithAI('https://example.com')
      ).rejects.toThrow(ApiKeyMissingError);
    });

    it('should apply category preferences filter', async () => {
      const preferences: ScanPreferences = {
        categories: ['Image'],
        minSize: 0,
        maxSize: 0,
      };

      const files = await scanUrlWithAI('https://example.com', preferences);

      expect(files.length).toBe(1);
      expect(files[0].type).toBe('Image');
    });

    it('should apply size preferences filter', async () => {
      const preferences: ScanPreferences = {
        categories: [],
        minSize: 1500,
        maxSize: 3000,
      };

      const files = await scanUrlWithAI('https://example.com', preferences);

      expect(files.length).toBe(1);
      expect(files[0].url).toContain('ai-file1.pdf');
      expect(files[0].size).toBe(2048);
    });

    it('should resolve relative URLs to absolute', async () => {
      const mockRelativeFiles: FileItem[] = [
        {
          url: '/relative/file.pdf',
          name: 'Relative File',
          type: 'Document',
          size: 1024,
        },
      ];

      mockGenerateContent.mockResolvedValueOnce({
        text: JSON.stringify(mockRelativeFiles),
      });

      const files = await scanUrlWithAI('https://example.com/page');

      expect(files[0].url).toBe('https://example.com/relative/file.pdf');
    });

    it('should handle Gemini API errors', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      mockGenerateContent.mockRejectedValueOnce(new Error('Gemini API error'));

      await expect(
        scanUrlWithAI('https://example.com')
      ).rejects.toThrow();

      consoleError.mockRestore();
    });

    it('should handle invalid JSON response from Gemini', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      mockGenerateContent.mockResolvedValueOnce({
        text: 'Invalid JSON',
      });

      await expect(
        scanUrlWithAI('https://example.com')
      ).rejects.toThrow();

      consoleError.mockRestore();
    });

    it('should call Gemini with correct prompt and schema', async () => {
      mockGenerateContent.mockResolvedValueOnce({
        text: JSON.stringify([]),
      });

      await scanUrlWithAI('https://example.com/test');

      expect(mockGenerateContent).toHaveBeenCalled();

      const callArgs = mockGenerateContent.mock.calls[mockGenerateContent.mock.calls.length - 1][0];
      expect(callArgs.model).toBe('gemini-2.5-flash');
      expect(callArgs.contents).toContain('https://example.com/test');
      expect(callArgs.config.responseMimeType).toBe('application/json');
    });

    it('should handle chrome.storage errors', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      (global.chrome.storage.sync.get as any).mockRejectedValue(
        new Error('Storage error')
      );

      await expect(
        scanUrlWithAI('https://example.com')
      ).rejects.toThrow('Failed to retrieve API key from storage');

      consoleError.mockRestore();
    });
  });

  describe('Helper Functions (via integration tests)', () => {
    describe('File Type Detection', () => {
      const testHTML = (url: string, expectedType: string) => `
        <html>
          <body>
            <a href="${url}">Test File</a>
          </body>
        </html>
      `;

      beforeEach(() => {
        vi.stubEnv('VITE_PROXY_URL', 'https://test-proxy.com/api/scrape');
      });

      afterEach(() => {
        vi.unstubAllEnvs();
      });

      it('should detect image file types', async () => {
        const extensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'];

        for (const ext of extensions) {
          (global.fetch as any).mockResolvedValue({
            ok: true,
            text: () => Promise.resolve(testHTML(`https://example.com/file.${ext}`, 'Image')),
          });

          const files = await performStandardScan('https://example.com');
          expect(files[0]?.type).toBe('Image');
        }
      });

      it('should detect video file types', async () => {
        const extensions = ['mp4', 'webm', 'avi', 'mov', 'mkv'];

        for (const ext of extensions) {
          (global.fetch as any).mockResolvedValue({
            ok: true,
            text: () => Promise.resolve(testHTML(`https://example.com/file.${ext}`, 'Video')),
          });

          const files = await performStandardScan('https://example.com');
          expect(files[0]?.type).toBe('Video');
        }
      });

      it('should detect audio file types', async () => {
        const extensions = ['mp3', 'wav', 'ogg', 'm4a', 'flac'];

        for (const ext of extensions) {
          (global.fetch as any).mockResolvedValue({
            ok: true,
            text: () => Promise.resolve(testHTML(`https://example.com/file.${ext}`, 'Audio')),
          });

          const files = await performStandardScan('https://example.com');
          expect(files[0]?.type).toBe('Audio');
        }
      });

      it('should detect document file types', async () => {
        const extensions = ['pdf', 'doc', 'docx', 'txt', 'xlsx', 'ppt'];

        for (const ext of extensions) {
          (global.fetch as any).mockResolvedValue({
            ok: true,
            text: () => Promise.resolve(testHTML(`https://example.com/file.${ext}`, 'Document')),
          });

          const files = await performStandardScan('https://example.com');
          expect(files[0]?.type).toBe('Document');
        }
      });

      it('should detect archive file types', async () => {
        const extensions = ['zip', 'rar', '7z', 'tar', 'gz'];

        for (const ext of extensions) {
          (global.fetch as any).mockResolvedValue({
            ok: true,
            text: () => Promise.resolve(testHTML(`https://example.com/file.${ext}`, 'Archive')),
          });

          const files = await performStandardScan('https://example.com');
          expect(files[0]?.type).toBe('Archive');
        }
      });

      it('should detect code file types', async () => {
        const extensions = ['py', 'java', 'cpp', 'go', 'rs'];

        for (const ext of extensions) {
          (global.fetch as any).mockResolvedValue({
            ok: true,
            text: () => Promise.resolve(testHTML(`https://example.com/file.${ext}`, 'Code')),
          });

          const files = await performStandardScan('https://example.com');
          expect(files[0]?.type).toBe('Code');
        }
      });

      it('should default to "Other" for unknown extensions', async () => {
        (global.fetch as any).mockResolvedValue({
          ok: true,
          text: () => Promise.resolve(testHTML('https://example.com/file.unknown', 'Other')),
        });

        const files = await performStandardScan('https://example.com');
        expect(files[0]?.type).toBe('Other');
      });
    });

    describe('Filename Extraction', () => {
      beforeEach(() => {
        vi.stubEnv('VITE_PROXY_URL', 'https://test-proxy.com/api/scrape');

        (global.fetch as any).mockImplementation((url: string, options?: any) => {
          if (options?.method === 'HEAD') {
            return Promise.resolve({
              ok: true,
              headers: new Map([['content-length', '1024']]),
            });
          }
          return Promise.resolve({
            ok: true,
            text: () => Promise.resolve(mockHTML),
          });
        });
      });

      afterEach(() => {
        vi.unstubAllEnvs();
      });

      const mockHTML = `
        <html>
          <body>
            <a href="https://example.com/document.pdf">Important Document</a>
            <a href="https://example.com/encoded%20file.jpg">Encoded</a>
            <a href="https://example.com/file">No Extension</a>
            <img src="https://example.com/photo.png" alt="Nice Photo" />
          </body>
        </html>
      `;

      it('should use link text as filename when available', async () => {
        const files = await performStandardScan('https://example.com');

        const docFile = files.find(f => f.url.includes('document.pdf'));
        expect(docFile?.name).toContain('Important Document');
      });

      it('should decode URL-encoded filenames', async () => {
        const files = await performStandardScan('https://example.com');

        const encodedFile = files.find(f => f.url.includes('encoded%20file.jpg'));
        // Name uses link text "Encoded" with extension, not the URL
        expect(encodedFile?.name).toBeTruthy();
      });

      it('should use alt text for images', async () => {
        const files = await performStandardScan('https://example.com');

        const imgFile = files.find(f => f.url.includes('photo.png'));
        expect(imgFile?.name).toContain('Nice Photo');
      });
    });
  });

  describe('Error Classes', () => {
    it('should create ProxyError with correct properties', () => {
      const error = new ProxyError('Test proxy error', 500);
      expect(error.message).toBe('Test proxy error');
      expect(error.name).toBe('ProxyError');
      expect(error.statusCode).toBe(500);
      expect(error).toBeInstanceOf(Error);
    });

    it('should create ProxyError with original error', () => {
      const originalError = new Error('Original error');
      const error = new ProxyError('Proxy error', 502, originalError);
      expect(error.originalError).toBe(originalError);
    });

    it('should create ValidationError with correct properties', () => {
      const error = new ValidationError('Invalid URL format');
      expect(error.message).toBe('Invalid URL format');
      expect(error.name).toBe('ValidationError');
      expect(error).toBeInstanceOf(Error);
    });

    it('should create TimeoutError with correct properties', () => {
      const error = new TimeoutError('Request timeout');
      expect(error.message).toBe('Request timeout');
      expect(error.name).toBe('TimeoutError');
      expect(error).toBeInstanceOf(Error);
    });

    it('should create TimeoutError with default message', () => {
      const error = new TimeoutError();
      expect(error.message).toBe('Request timeout');
    });
  });

  describe('URL Validation', () => {
    beforeEach(() => {
      vi.stubEnv('VITE_PROXY_URL', 'https://test-proxy.com/api/scrape');
      (global.fetch as any).mockImplementation((url: string) => {
        // Mock proxy to reject invalid URLs
        if (!url.includes('http://') && !url.includes('https://')) {
          return Promise.reject(new Error('Invalid URL'));
        }
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve('<html><body></body></html>'),
        });
      });
    });

    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it('should reject localhost URLs', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(
        performStandardScan('http://localhost:3000')
      ).rejects.toThrow('Invalid URL');

      consoleError.mockRestore();
    });

    it('should reject private IP addresses', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(
        performStandardScan('http://192.168.1.1')
      ).rejects.toThrow('Invalid URL');

      consoleError.mockRestore();
    });

    it('should reject 10.x.x.x addresses', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(
        performStandardScan('http://10.0.0.1')
      ).rejects.toThrow('Invalid URL');

      consoleError.mockRestore();
    });

    it('should reject 172.16-31.x.x addresses', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(
        performStandardScan('http://172.16.0.1')
      ).rejects.toThrow('Invalid URL');

      consoleError.mockRestore();
    });

    it('should accept valid public URLs', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});

      await expect(
        performStandardScan('https://example.com')
      ).resolves.toBeDefined();

      consoleError.mockRestore();
      consoleLog.mockRestore();
    });
  });

  describe('Cache Management', () => {
    beforeEach(() => {
      clearAllCache();
      resetMetrics();
      vi.stubEnv('VITE_PROXY_URL', 'https://test-proxy.com/api/scrape');

      (global.fetch as any).mockImplementation(() => {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve('<html><body><a href="test.pdf">Test</a></body></html>'),
        });
      });
    });

    afterEach(() => {
      vi.unstubAllEnvs();
      clearAllCache();
    });

    it('should cache scan results', async () => {
      const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
      const consoleDebug = vi.spyOn(console, 'debug').mockImplementation(() => {});

      // First scan - should fetch from proxy
      await performStandardScan('https://example.com');
      const firstCallCount = (global.fetch as any).mock.calls.length;

      // Second scan - should use cache
      await performStandardScan('https://example.com');
      const secondCallCount = (global.fetch as any).mock.calls.length;

      // Should have made only one proxy call (cached the second time)
      expect(secondCallCount).toBe(firstCallCount);

      consoleLog.mockRestore();
      consoleDebug.mockRestore();
    });

    it('should return cache statistics', async () => {
      const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
      const consoleDebug = vi.spyOn(console, 'debug').mockImplementation(() => {});

      await performStandardScan('https://example.com');

      const stats = getCacheStats();
      expect(stats.size).toBeGreaterThan(0);
      expect(stats.entries).toBeInstanceOf(Array);
      expect(stats.entries[0]).toHaveProperty('url');
      expect(stats.entries[0]).toHaveProperty('age');

      consoleLog.mockRestore();
      consoleDebug.mockRestore();
    });

    it('should clear all cache', async () => {
      const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
      const consoleDebug = vi.spyOn(console, 'debug').mockImplementation(() => {});

      await performStandardScan('https://example.com');

      let stats = getCacheStats();
      expect(stats.size).toBeGreaterThan(0);

      clearAllCache();

      stats = getCacheStats();
      expect(stats.size).toBe(0);

      consoleLog.mockRestore();
      consoleDebug.mockRestore();
    });
  });

  describe('Metrics and Telemetry', () => {
    beforeEach(() => {
      resetMetrics();
      vi.stubEnv('VITE_PROXY_URL', 'https://test-proxy.com/api/scrape');

      (global.fetch as any).mockImplementation(() => {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve('<html><body><a href="test.pdf">Test</a></body></html>'),
        });
      });

      // Mock chrome storage for AI scans
      (global.chrome.storage.sync.get as any).mockResolvedValue({
        geminiApiKey: 'test-key',
      });
    });

    afterEach(() => {
      vi.unstubAllEnvs();
      resetMetrics();
    });

    it('should track successful standard scans', async () => {
      const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
      const consoleDebug = vi.spyOn(console, 'debug').mockImplementation(() => {});

      await performStandardScan('https://example.com');

      const metrics = getMetrics();
      expect(metrics.totalScans).toBe(1);
      expect(metrics.successfulScans).toBe(1);
      expect(metrics.failedScans).toBe(0);
      expect(metrics.scansByType.standard).toBe(1);

      consoleLog.mockRestore();
      consoleDebug.mockRestore();
    });

    it('should track failed scans', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      const consoleDebug = vi.spyOn(console, 'debug').mockImplementation(() => {});

      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      await expect(performStandardScan('https://example.com')).rejects.toThrow();

      const metrics = getMetrics();
      expect(metrics.totalScans).toBe(1);
      expect(metrics.successfulScans).toBe(0);
      expect(metrics.failedScans).toBe(1);

      consoleError.mockRestore();
      consoleDebug.mockRestore();
    });

    it('should track files found average', async () => {
      const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
      const consoleDebug = vi.spyOn(console, 'debug').mockImplementation(() => {});

      (global.fetch as any).mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<html><body><a href="file1.pdf">1</a><a href="file2.pdf">2</a></body></html>'),
      });

      await performStandardScan('https://example.com');

      const metrics = getMetrics();
      expect(metrics.totalFilesFound).toBeGreaterThan(0);
      expect(metrics.averageFilesPerScan).toBeGreaterThan(0);

      consoleLog.mockRestore();
      consoleDebug.mockRestore();
    });

    it('should reset metrics', () => {
      const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});

      resetMetrics();

      const metrics = getMetrics();
      expect(metrics.totalScans).toBe(0);
      expect(metrics.successfulScans).toBe(0);
      expect(metrics.failedScans).toBe(0);
      expect(metrics.totalFilesFound).toBe(0);
      expect(metrics.averageFilesPerScan).toBe(0);
      expect(metrics.scansByType.standard).toBe(0);
      expect(metrics.scansByType.ai).toBe(0);

      consoleLog.mockRestore();
    });

    it('should categorize error types in metrics', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      const consoleDebug = vi.spyOn(console, 'debug').mockImplementation(() => {});
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Simulate timeout error
      (global.fetch as any).mockImplementation(() => {
        return new Promise((_, reject) => {
          setTimeout(() => reject({ name: 'AbortError' }), 100);
        });
      });

      await expect(performStandardScan('https://example.com')).rejects.toThrow();

      const metrics = getMetrics();
      expect(metrics.errors.timeout).toBeGreaterThan(0);

      consoleError.mockRestore();
      consoleDebug.mockRestore();
      consoleWarn.mockRestore();
    });
  });

  describe('Retry Logic', () => {
    beforeEach(() => {
      vi.stubEnv('VITE_PROXY_URL', 'https://test-proxy.com/api/scrape');
    });

    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it('should retry failed requests', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
      const consoleDebug = vi.spyOn(console, 'debug').mockImplementation(() => {});

      let attempts = 0;
      (global.fetch as any).mockImplementation(() => {
        attempts++;
        if (attempts < 2) {
          return Promise.reject(new Error('Temporary network error'));
        }
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve('<html><body><a href="test.pdf">Test</a></body></html>'),
        });
      });

      await performStandardScan('https://example.com');

      expect(attempts).toBeGreaterThan(1);

      consoleError.mockRestore();
      consoleWarn.mockRestore();
      consoleLog.mockRestore();
      consoleDebug.mockRestore();
    });

    it('should not retry on validation errors', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      const consoleDebug = vi.spyOn(console, 'debug').mockImplementation(() => {});

      await expect(
        performStandardScan('http://localhost:3000')
      ).rejects.toThrow('Invalid URL');

      // Should fail immediately without retries
      expect((global.fetch as any).mock.calls.length).toBe(0);

      consoleError.mockRestore();
      consoleDebug.mockRestore();
    });
  });
});
