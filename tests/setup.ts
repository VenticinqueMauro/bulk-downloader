import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock Chrome APIs
global.chrome = {
  tabs: {
    query: vi.fn(),
  },
  storage: {
    sync: {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn(),
    },
  },
  downloads: {
    download: vi.fn(),
  },
  runtime: {
    openOptionsPage: vi.fn(),
    lastError: undefined,
  },
} as any;

// Mock environment variables
process.env.VITE_PROXY_URL = 'https://test-proxy.com/api/scrape';

// Mock fetch globally
global.fetch = vi.fn();

// Mock window.matchMedia (needed for some UI components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
