
import React, { useState, useEffect } from 'react';
import { SearchIcon, SparklesIcon } from './icons';

interface UrlInputFormProps {
  onStandardScan: (url: string) => void;
  onAiScan: (url: string) => void;
  isStandardLoading: boolean;
  isAiLoading: boolean;
  onClearResults: () => void;
  lastScannedUrl: string;
}

export const UrlInputForm: React.FC<UrlInputFormProps> = ({
  onStandardScan,
  onAiScan,
  isStandardLoading,
  isAiLoading,
  onClearResults,
  lastScannedUrl
}) => {
  const [url, setUrl] = useState('');
  const [lastFetchedUrl, setLastFetchedUrl] = useState('');

  // Auto-fill current tab URL on mount and when tab changes
  useEffect(() => {
    const getCurrentTabUrl = async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.url && tab.url !== lastFetchedUrl) {
          // If the URL changed and we have previous scan results, clear them
          if (lastScannedUrl && lastScannedUrl !== tab.url && lastFetchedUrl !== '') {
            onClearResults();
          }
          setUrl(tab.url);
          setLastFetchedUrl(tab.url);
        }
      } catch (error) {
        console.error('Error getting current tab URL:', error);
      }
    };

    // Initial fetch
    getCurrentTabUrl();

    // Check for URL updates periodically when popup is visible
    const interval = setInterval(getCurrentTabUrl, 500);

    return () => {
      clearInterval(interval);
    };
  }, [lastFetchedUrl, lastScannedUrl, onClearResults]);

  const handleSingleUrlSubmit = (scanType: 'standard' | 'ai') => {
    if (isStandardLoading || isAiLoading || !url.trim()) return;

    if (scanType === 'standard') {
      onStandardScan(url.trim());
    } else {
      onAiScan(url.trim());
    }
  };
  
  return (
    <div className="my-6 sm:my-8">
      <div>
        <div className="relative">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isStandardLoading || isAiLoading}
            placeholder="https://example.com/page-with-files"
            className="w-full p-4 text-lg bg-gray-900 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition text-white placeholder-gray-500 disabled:opacity-50"
          />
        </div>
        <div className="mt-4 flex flex-col sm:flex-row justify-center items-stretch gap-3">
          <button
            onClick={() => handleSingleUrlSubmit('standard')}
            disabled={isStandardLoading || isAiLoading || !url.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-lg font-bold text-white bg-sky-600 rounded-md hover:bg-sky-500 transition-all duration-200 disabled:bg-sky-800 disabled:text-sky-400 disabled:cursor-not-allowed"
          >
            {isStandardLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : <SearchIcon className="h-6 w-6" />}
            <span>Standard Scan</span>
          </button>
          <button
            onClick={() => handleSingleUrlSubmit('ai')}
            disabled={isStandardLoading || isAiLoading || !url.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 font-semibold text-amber-300 bg-amber-400/10 border-2 border-amber-400/20 rounded-md hover:bg-amber-400/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAiLoading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : <SparklesIcon className="h-5 w-5" />}
            <span>AI Deep Scan</span>
          </button>
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          Standard scan is fast & free. AI Deep Scan requires an API key.
        </p>
      </div>
    </div>
  );
};
