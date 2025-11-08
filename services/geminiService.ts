
import { GoogleGenAI, Type } from "@google/genai";
import { FileItem } from '../types';

// This is a mock function to simulate a fast, simple, client-side scraper.
// It finds only the most obvious links from the mock HTML.
export const performStandardScan = async (url: string): Promise<FileItem[]> => {
  console.log(`Performing Standard Scan for: ${url}`);
  // Simulate a quick, non-API call
  await new Promise(resolve => setTimeout(resolve, 300)); 
  
  // Return a limited, predictable set of files that a simple scraper might find.
  return [
    { url: new URL('https://example.com/files/image.jpg', url).href, name: 'Download JPG Image', type: 'Image', size: 12345 },
    { url: new URL('/files/document.pdf', url).href, name: 'Important Document (PDF)', type: 'Document', size: 67890 },
    { url: new URL('https://example.com/files/photo.png', url).href, name: 'photo.png', type: 'Image', size: 54321 },
  ];
};


// This is a mock function to simulate fetching URL content.
// In a real application, this would be a backend call to a server proxy
// that fetches the URL to avoid CORS issues.
const fetchUrlContent = async (url: string): Promise<string> => {
  console.log(`Pretending to fetch content for: ${url}`);
  // Return some mock HTML content for Gemini to parse.
  return `
    <html>
      <body>
        <h1>Files Page</h1>
        <p>Here are some files to download.</p>
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
};

// FIX: Initialize GoogleGenAI according to guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const scanUrlWithAI = async (url: string): Promise<FileItem[]> => {
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
