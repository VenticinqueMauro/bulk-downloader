import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const OptionsPage: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    loadApiKey();
  }, []);

  const loadApiKey = async () => {
    try {
      const result = await chrome.storage.sync.get(['geminiApiKey']);
      if (result.geminiApiKey) {
        setSavedKey(result.geminiApiKey);
        // Show masked version
        setApiKey('*'.repeat(20));
      }
    } catch (error) {
      console.error('Error loading API key:', error);
      setMessage({ type: 'error', text: 'Failed to load saved API key.' });
    }
  };

  const handleSave = async () => {
    if (!apiKey || apiKey.trim() === '' || apiKey.startsWith('*')) {
      setMessage({ type: 'error', text: 'Please enter a valid API key.' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      await chrome.storage.sync.set({ geminiApiKey: apiKey.trim() });
      setSavedKey(apiKey.trim());
      setMessage({ type: 'success', text: 'API Key saved successfully!' });

      // Mask the key after saving
      setTimeout(() => {
        setApiKey('*'.repeat(20));
      }, 1000);
    } catch (error) {
      console.error('Error saving API key:', error);
      setMessage({ type: 'error', text: 'Failed to save API key. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = async () => {
    if (!confirm('Are you sure you want to remove your API key? This will disable AI scanning features.')) {
      return;
    }

    try {
      await chrome.storage.sync.remove(['geminiApiKey']);
      setApiKey('');
      setSavedKey('');
      setMessage({ type: 'info', text: 'API Key removed.' });
    } catch (error) {
      console.error('Error removing API key:', error);
      setMessage({ type: 'error', text: 'Failed to remove API key.' });
    }
  };

  const handleInputFocus = () => {
    if (apiKey.startsWith('*')) {
      setApiKey('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Gemini Bulk File Downloader
          </h1>
          <p className="text-gray-400">Extension Settings</p>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">🔑</span>
            Gemini API Key
          </h2>

          <div className="mb-4">
            <p className="text-gray-300 mb-2">
              To use the AI Deep Scan feature, you need a Gemini API key.
            </p>
            <p className="text-gray-400 text-sm mb-4">
              Your API key is stored locally in your browser and never shared with anyone.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium mb-2 text-gray-300">
                API Key
              </label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onFocus={handleInputFocus}
                placeholder="Enter your Gemini API key"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {message && (
              <div className={`p-4 rounded-lg border ${
                message.type === 'success' ? 'bg-emerald-900/30 border-emerald-700 text-emerald-300' :
                message.type === 'error' ? 'bg-rose-900/30 border-rose-700 text-rose-300' :
                'bg-blue-900/30 border-blue-700 text-blue-300'
              }`}>
                {message.text}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save API Key'}
              </button>

              {savedKey && (
                <button
                  onClick={handleClear}
                  className="px-6 py-2 bg-gray-700 border border-gray-600 rounded-lg font-medium hover:bg-gray-600 transition-all"
                >
                  Clear API Key
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">📖</span>
            How to Get an API Key
          </h2>

          <ol className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <span className="font-bold text-purple-400 min-w-[24px]">1.</span>
              <span>
                Visit{' '}
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  Google AI Studio
                </a>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-purple-400 min-w-[24px]">2.</span>
              <span>Sign in with your Google account</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-purple-400 min-w-[24px]">3.</span>
              <span>Click "Create API Key" or "Get API Key"</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-purple-400 min-w-[24px]">4.</span>
              <span>Copy the generated API key and paste it above</span>
            </li>
          </ol>

          <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
            <p className="text-yellow-300 text-sm">
              <strong>Note:</strong> Gemini API has a free tier with generous limits. Check the{' '}
              <a
                href="https://ai.google.dev/pricing"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-yellow-200"
              >
                pricing page
              </a>
              {' '}for details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('options-root');
if (container) {
  const root = createRoot(container);
  root.render(<OptionsPage />);
}
