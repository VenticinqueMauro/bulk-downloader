import { vi } from 'vitest';

export const createMockChrome = () => ({
  tabs: {
    query: vi.fn().mockResolvedValue([
      {
        id: 1,
        url: 'https://example.com',
        title: 'Example Page',
      },
    ]),
  },
  storage: {
    sync: {
      get: vi.fn().mockImplementation((keys) => {
        const result: Record<string, any> = {};
        if (Array.isArray(keys)) {
          keys.forEach(key => {
            result[key] = null;
          });
        } else if (typeof keys === 'object') {
          Object.assign(result, keys);
        }
        return Promise.resolve(result);
      }),
      set: vi.fn().mockResolvedValue(undefined),
      remove: vi.fn().mockResolvedValue(undefined),
    },
  },
  downloads: {
    download: vi.fn().mockImplementation((options) => {
      return Promise.resolve(Math.floor(Math.random() * 1000));
    }),
  },
  runtime: {
    openOptionsPage: vi.fn(),
    lastError: undefined,
  },
});

export const mockChromeStorage = {
  get: vi.fn(),
  set: vi.fn(),
  remove: vi.fn(),
};

export const mockChromeDownloads = {
  download: vi.fn(),
};

export const mockChromeTabs = {
  query: vi.fn(),
};
