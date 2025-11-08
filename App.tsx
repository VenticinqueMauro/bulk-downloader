
import React, { useState, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { UrlInputForm } from './components/UrlInputForm';
import { FilterBar } from './components/FilterBar';
import { FileList } from './components/FileList';
import { ActionBar } from './components/ActionBar';
import { WelcomeSplash } from './components/WelcomeSplash';
import { FileItem, FilterType } from './types';
import { performStandardScan, scanUrlWithAI, ApiKeyMissingError } from './services/geminiService';

const App: React.FC = () => {
  const [allFiles, setAllFiles] = useState<FileItem[]>([]);
  const [isStandardLoading, setIsStandardLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [selectedFileUrls, setSelectedFileUrls] = useState<Set<string>>(new Set());
  const [lastScannedUrl, setLastScannedUrl] = useState<string>('');
  
  const handleClearResults = useCallback(() => {
    setAllFiles([]);
    setSelectedFileUrls(new Set());
    setError(null);
  }, []);

  const handleStandardScan = async (url: string) => {
    if (isStandardLoading || isAiLoading) return;

    setIsStandardLoading(true);
    setError(null);
    setSelectedFileUrls(new Set());
    setLastScannedUrl(url);

    try {
      const foundFiles = await performStandardScan(url);
      setAllFiles(foundFiles); // Standard scan replaces all previous results
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Standard Scan failed. Please try again.');
    } finally {
      setIsStandardLoading(false);
    }
  };

  const handleAiScan = async (url: string) => {
    if (isStandardLoading || isAiLoading) return;

    setIsAiLoading(true);
    setError(null);
    setLastScannedUrl(url);

    try {
      const foundFiles = await scanUrlWithAI(url);
      // Using a Map to deduplicate files by URL, adding AI results to any existing ones
      const uniqueFiles = Array.from(new Map(foundFiles.map(file => [file.url, file])).values());
      setAllFiles(prevFiles => Array.from(new Map([...prevFiles, ...uniqueFiles].map(f => [f.url, f])).values()));
    } catch (e: any) {
      console.error(e);
      if (e instanceof ApiKeyMissingError) {
        setError('AI key is not configured. Click here to open settings and add your AI API key.');
      } else {
        setError(e.message || 'AI Scan failed. Please check the console for details.');
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  const filteredFiles = useMemo(() => {
    if (currentFilter === 'all') return allFiles;
    return allFiles.filter(file => file.type.toLowerCase() === currentFilter);
  }, [allFiles, currentFilter]);

  const fileCounts = useMemo(() => {
    const counts: Partial<Record<FilterType, number>> = { all: allFiles.length };
    for (const file of allFiles) {
        const typeKey = file.type.toLowerCase() as FilterType;
        if (!counts[typeKey]) counts[typeKey] = 0;
        counts[typeKey]!++;
    }
    return counts;
  }, [allFiles]);

  const handleToggleSelectAll = useCallback(() => {
    if (selectedFileUrls.size === filteredFiles.length) {
      setSelectedFileUrls(new Set());
    } else {
      setSelectedFileUrls(new Set(filteredFiles.map(f => f.url)));
    }
  }, [filteredFiles, selectedFileUrls.size]);

  const selectedFiles = useMemo(() => {
    return allFiles.filter(f => selectedFileUrls.has(f.url));
  }, [allFiles, selectedFileUrls]);

  const handleOpenOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col font-sans">
      <Header />
      <main className="container mx-auto px-4 flex-grow flex flex-col">
        <UrlInputForm
          onStandardScan={handleStandardScan}
          onAiScan={handleAiScan}
          isStandardLoading={isStandardLoading}
          isAiLoading={isAiLoading}
          onClearResults={handleClearResults}
          lastScannedUrl={lastScannedUrl}
        />
        {error && (
            <div className="my-4 p-4 bg-rose-900/50 border border-rose-700 text-rose-300 rounded-lg flex-shrink-0">
                <p className="text-center mb-2">{error}</p>
                {error.includes('API key') && (
                  <div className="text-center">
                    <button
                      onClick={handleOpenOptions}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                    >
                      Open Settings
                    </button>
                  </div>
                )}
            </div>
        )}
        {allFiles.length > 0 ? (
          <div className="flex flex-col min-h-0 mb-4">
            <FilterBar
                currentFilter={currentFilter}
                onFilterChange={setCurrentFilter}
                fileCounts={fileCounts}
            />
            <FileList
                files={filteredFiles}
                selectedFileUrls={selectedFileUrls}
                onSelectionChange={setSelectedFileUrls}
                onToggleSelectAll={handleToggleSelectAll}
            />
          </div>
        ) : (
          !(isStandardLoading || isAiLoading) && <WelcomeSplash />
        )}
      </main>

      {selectedFileUrls.size > 0 && (
        <ActionBar
          selectedCount={selectedFileUrls.size}
          selectedFiles={selectedFiles}
        />
      )}
    </div>
  );
};

export default App;
