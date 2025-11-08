
import React, { useState, useEffect } from 'react';
import { LockIcon, SearchIcon, LayersIcon, SparklesIcon } from './icons';

interface UrlInputFormProps {
  onStandardScan: (url: string) => void;
  onAiScan: (url: string) => void;
  onBatchScan: (urls: string[]) => void;
  isLoading: boolean;
  isProUser: boolean;
  scanCredits: number;
  onProFeatureClick: () => void;
}

export const UrlInputForm: React.FC<UrlInputFormProps> = ({ onStandardScan, onAiScan, onBatchScan, isLoading, isProUser, scanCredits, onProFeatureClick }) => {
  const [url, setUrl] = useState('');
  const [batchUrls, setBatchUrls] = useState('');
  const [isBatchMode, setIsBatchMode] = useState(false);

  // Auto-fill current tab URL on mount
  useEffect(() => {
    const getCurrentTabUrl = async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.url) {
          setUrl(tab.url);
        }
      } catch (error) {
        console.error('Error getting current tab URL:', error);
      }
    };

    getCurrentTabUrl();
  }, []);

  const handleSingleUrlSubmit = (scanType: 'standard' | 'ai') => {
    if (isLoading || !url.trim()) return;

    if (scanType === 'standard') {
      onStandardScan(url.trim());
    } else { // 'ai'
      if (!isProUser && scanCredits <= 0) {
        onProFeatureClick();
        return;
      }
      onAiScan(url.trim());
    }
  };

  // FIX: Corrected typo from React.FormEvert to React.FormEvent.
  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!isProUser) {
      onProFeatureClick();
      return;
    }
    const urlsToScan = batchUrls.split('\n').map(u => u.trim()).filter(Boolean);
    if (urlsToScan.length > 0) {
      onBatchScan(urlsToScan);
    }
  };
  
  return (
    <div className="my-6 sm:my-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        <button 
          onClick={() => setIsBatchMode(false)}
          className={`px-4 py-2 rounded-full font-medium transition ${!isBatchMode ? 'bg-sky-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          Single URL
        </button>
        <button 
          onClick={() => {
            if (!isProUser) onProFeatureClick();
            else setIsBatchMode(true);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition ${isBatchMode ? 'bg-sky-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          Batch Scan {!isProUser && <LockIcon className="h-4 w-4 text-amber-400" />}
        </button>
      </div>

      {isBatchMode ? (
        <form onSubmit={handleBatchSubmit} className="relative">
           <textarea
            value={batchUrls}
            onChange={(e) => setBatchUrls(e.target.value)}
            disabled={isLoading || !isProUser}
            placeholder="Enter one URL per line..."
            className="w-full h-40 p-4 pr-40 text-lg bg-gray-900 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition text-white placeholder-gray-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !batchUrls.trim()}
            className="absolute top-2 right-2 bottom-2 px-6 flex items-center justify-center gap-2 text-lg font-bold text-white bg-sky-600 rounded-md hover:bg-sky-500 transition-all duration-200 disabled:bg-sky-800 disabled:text-sky-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : <LayersIcon className="h-6 w-6" />}
            <span>{isLoading ? 'Scanning...' : 'Scan All'}</span>
          </button>
        </form>
      ) : (
        <div>
          <div className="relative">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              placeholder="https://example.com/page-with-files"
              className="w-full p-4 text-lg bg-gray-900 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition text-white placeholder-gray-500 disabled:opacity-50"
            />
          </div>
          <div className="mt-4 flex flex-col sm:flex-row justify-center items-stretch gap-3">
            <button
              onClick={() => handleSingleUrlSubmit('standard')}
              disabled={isLoading || !url.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-lg font-bold text-white bg-sky-600 rounded-md hover:bg-sky-500 transition-all duration-200 disabled:bg-sky-800 disabled:text-sky-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : <SearchIcon className="h-6 w-6" />}
              <span>Standard Scan</span>
            </button>
            <button
              onClick={() => handleSingleUrlSubmit('ai')}
              disabled={isLoading || !url.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 font-semibold text-amber-300 bg-amber-400/10 border-2 border-amber-400/20 rounded-md hover:bg-amber-400/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : <SparklesIcon className="h-5 w-5" />}
              <span>AI Deep Scan</span>
              {!isProUser && (
                <span className="ml-2 text-xs font-mono bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                  {scanCredits} left
                </span>
              )}
            </button>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            Standard scan is fast & free. Use AI Deep Scan for complex pages to find more files.
          </p>
        </div>
      )}
    </div>
  );
};
