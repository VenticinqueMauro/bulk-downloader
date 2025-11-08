
import React, { useState, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { UrlInputForm } from './components/UrlInputForm';
import { FilterBar } from './components/FilterBar';
import { FileList } from './components/FileList';
import { ActionBar } from './components/ActionBar';
import { ProModal } from './components/ProModal';
import { WelcomeSplash } from './components/WelcomeSplash';
import { FileItem, FilterType, UserData } from './types';
import { performStandardScan, scanUrlWithAI, ApiKeyMissingError } from './services/geminiService';

const App: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    userId: 'user-123',
    isProUser: false,
    scanCredits: 5,
  });

  const [allFiles, setAllFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [selectedFileUrls, setSelectedFileUrls] = useState<Set<string>>(new Set());
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  
  const handleStandardScan = async (url: string) => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    setSelectedFileUrls(new Set());
    
    try {
      const foundFiles = await performStandardScan(url);
      setAllFiles(foundFiles); // Standard scan replaces all previous results
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Standard Scan failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAiScan = async (url: string) => {
    if (isLoading) return;
    if (!userData.isProUser && userData.scanCredits <= 0) {
        setError("You are out of AI scans. Please upgrade to Pro for unlimited deep scans.");
        setIsProModalOpen(true);
        return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const foundFiles = await scanUrlWithAI(url);
      // Using a Map to deduplicate files by URL, adding AI results to any existing ones
      const uniqueFiles = Array.from(new Map(foundFiles.map(file => [file.url, file])).values());
      setAllFiles(prevFiles => Array.from(new Map([...prevFiles, ...uniqueFiles].map(f => [f.url, f])).values()));

      if (!userData.isProUser) {
        setUserData(prev => ({ ...prev, scanCredits: prev.scanCredits - 1 }));
      }
    } catch (e: any) {
      console.error(e);
      if (e instanceof ApiKeyMissingError) {
        setError('API key is not configured. Click here to open settings and add your Gemini API key.');
      } else {
        setError(e.message || 'AI Scan failed. Please check the console for details.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchScan = async (urls: string[]) => {
    if (isLoading || !userData.isProUser) return;

    setIsLoading(true);
    setError(null);
    setSelectedFileUrls(new Set());

    // Process all URLs in parallel using Promise.allSettled
    const results = await Promise.allSettled(
      urls.map(url => scanUrlWithAI(url))
    );

    // Collect all successful results
    const allFoundFiles: FileItem[] = [];
    const failedUrls: string[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allFoundFiles.push(...result.value);
      } else {
        console.error(`Failed to scan ${urls[index]}:`, result.reason);
        failedUrls.push(urls[index]);
      }
    });

    // Deduplicate files by URL
    const uniqueFiles = Array.from(
      new Map(allFoundFiles.map(file => [file.url, file])).values()
    );

    setAllFiles(prevFiles =>
      Array.from(new Map([...prevFiles, ...uniqueFiles].map(f => [f.url, f])).values())
    );

    // Show error if some URLs failed
    if (failedUrls.length > 0) {
      setError(
        `Successfully scanned ${urls.length - failedUrls.length} of ${urls.length} URLs. Failed: ${failedUrls.join(', ')}`
      );
    }

    setIsLoading(false);
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

  const handleTogglePro = () => {
    setUserData(prev => ({
      ...prev,
      isProUser: !prev.isProUser,
      scanCredits: prev.isProUser ? 5 : prev.scanCredits, // Reset credits if downgrading
    }));
    setIsProModalOpen(false); // Close modal on upgrade
  };

  const handleOpenOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col font-sans">
      <Header 
        isProUser={userData.isProUser}
        onTogglePro={handleTogglePro}
        scanCredits={userData.scanCredits}
      />
      <main className="container mx-auto px-4 flex-grow flex flex-col">
        <UrlInputForm 
          onStandardScan={handleStandardScan}
          onAiScan={handleAiScan}
          onBatchScan={handleBatchScan}
          isLoading={isLoading}
          isProUser={userData.isProUser}
          scanCredits={userData.scanCredits}
          onProFeatureClick={() => setIsProModalOpen(true)}
        />
        {error && (
            <div className="my-4 p-4 bg-rose-900/50 border border-rose-700 text-rose-300 rounded-lg">
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
          <div className="flex-grow flex flex-col min-h-0">
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
          !isLoading && <WelcomeSplash />
        )}
      </main>
      
      {selectedFileUrls.size > 0 && (
        <ActionBar 
          selectedCount={selectedFileUrls.size}
          isProUser={userData.isProUser}
          onProFeatureClick={() => setIsProModalOpen(true)}
          selectedFiles={selectedFiles}
        />
      )}

      <ProModal 
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        onUpgrade={handleTogglePro}
      />
    </div>
  );
};

export default App;
