import { vi } from 'vitest';

export const createMockGeminiResponse = (files: any[] = []) => ({
  response: {
    text: () => JSON.stringify({ files }),
  },
});

export const mockGoogleGenerativeAI = vi.fn().mockImplementation(() => ({
  getGenerativeModel: vi.fn().mockReturnValue({
    generateContent: vi.fn().mockResolvedValue(
      createMockGeminiResponse([
        {
          url: 'https://example.com/file1.pdf',
          name: 'file1.pdf',
          type: 'document',
        },
        {
          url: 'https://example.com/image.jpg',
          name: 'image.jpg',
          type: 'image',
        },
      ])
    ),
  }),
}));

export const createMockGeminiError = () => {
  throw new Error('Gemini API Error');
};
