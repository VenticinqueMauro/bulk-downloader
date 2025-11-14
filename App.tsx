
import React, { useState, useMemo, useCallback, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { UrlInputForm } from './components/UrlInputForm';
import { FilterBar } from './components/FilterBar';
import { FileList } from './components/FileList';
import { ActionBar } from './components/ActionBar';
import { WelcomeMessage } from './components/WelcomeMessage';
import { Onboarding } from './components/Onboarding';
import { FileItem, FilterType, ScanPreferences, FileCategory } from './types';
import { performStandardScan, scanUrlWithAI, ApiKeyMissingError } from './services/geminiService';
import { SearchIcon } from './components/icons';

// Lazy load heavy components
const ScanPreferencesModal = lazy(() => import('./components/ScanPreferencesModal').then(m => ({ default: m.ScanPreferencesModal })));

// Default preferences: All categories, no size limits, don't remember
const DEFAULT_PREFERENCES: ScanPreferences = {
  categories: ['Image', 'Video', 'Audio', 'Document', 'Archive', 'Font', 'Style', 'Script', 'Code', 'Model3D', 'Data', 'Executable', 'Other'] as FileCategory[],
  minSize: 0,
  maxSize: 0,
  rememberPreferences: false
};

const App: React.FC = () => {
  const [allFiles, setAllFiles] = useState<FileItem[]>([]);
  const [isStandardLoading, setIsStandardLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [selectedFileUrls, setSelectedFileUrls] = useState<Set<string>>(new Set());
  const [lastScannedUrl, setLastScannedUrl] = useState<string>('');
  const [hasScanned, setHasScanned] = useState(false); // Track if user has scanned at least once

  // Scan preferences state
  const [scanPreferences, setScanPreferences] = useState<ScanPreferences>(DEFAULT_PREFERENCES);
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
  const [pendingScanUrl, setPendingScanUrl] = useState<string>('');
  const [pendingScanType, setPendingScanType] = useState<'standard' | 'ai' | null>(null);

  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Load saved preferences and check onboarding status on mount
  useEffect(() => {
    chrome.storage.sync.get(['scanPreferences', 'hasSeenOnboarding'], (result) => {
      if (result.scanPreferences) {
        setScanPreferences(result.scanPreferences);
      }
      // Show onboarding if user hasn't seen it yet
      if (!result.hasSeenOnboarding) {
        setShowOnboarding(true);
      }
    });
  }, []);
  
  const handleClearResults = useCallback(() => {
    setAllFiles([]);
    setSelectedFileUrls(new Set());
    setError(null);
    setHasScanned(false);
  }, []);

  // Open preferences modal before scanning
  const handleStandardScan = (url: string) => {
    if (isStandardLoading || isAiLoading) return;
    setPendingScanUrl(url);
    setPendingScanType('standard');
    setIsPreferencesModalOpen(true);
  };

  const handleAiScan = (url: string) => {
    if (isStandardLoading || isAiLoading) return;
    setPendingScanUrl(url);
    setPendingScanType('ai');
    setIsPreferencesModalOpen(true);
  };

  // Execute scan with confirmed preferences
  const handlePreferencesConfirm = async (preferences: ScanPreferences) => {
    setIsPreferencesModalOpen(false);

    // Save preferences if requested
    if (preferences.rememberPreferences) {
      chrome.storage.sync.set({ scanPreferences: preferences });
      setScanPreferences(preferences);
    }

    // Execute the appropriate scan
    if (pendingScanType === 'standard') {
      await executeStandardScan(pendingScanUrl, preferences);
    } else if (pendingScanType === 'ai') {
      await executeAiScan(pendingScanUrl, preferences);
    }

    // Reset pending state
    setPendingScanUrl('');
    setPendingScanType(null);
  };

  const executeStandardScan = async (url: string, preferences: ScanPreferences) => {
    setIsStandardLoading(true);
    setError(null);
    setSelectedFileUrls(new Set());
    setLastScannedUrl(url);

    try {
      const foundFiles = await performStandardScan(url, preferences);
      setAllFiles(foundFiles); // Standard scan replaces all previous results
      setHasScanned(true); // Mark that a scan has been performed
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'El escaneo estándar falló. Por favor intenta de nuevo.');
      setHasScanned(true); // Still mark as scanned even on error
    } finally {
      setIsStandardLoading(false);
    }
  };

  const executeAiScan = async (url: string, preferences: ScanPreferences) => {
    setIsAiLoading(true);
    setError(null);
    setLastScannedUrl(url);

    try {
      const foundFiles = await scanUrlWithAI(url, preferences);
      // Using a Map to deduplicate files by URL, adding AI results to any existing ones
      const uniqueFiles = Array.from(new Map(foundFiles.map(file => [file.url, file])).values());
      setAllFiles(prevFiles => Array.from(new Map([...prevFiles, ...uniqueFiles].map(f => [f.url, f])).values()));
      setHasScanned(true); // Mark that a scan has been performed
    } catch (e: any) {
      console.error(e);
      if (e instanceof ApiKeyMissingError) {
        setError('La clave de IA no está configurada. Haz clic aquí para abrir la configuración y agregar tu clave API de IA.');
      } else {
        setError(e.message || 'El escaneo con IA falló. Por favor verifica la consola para más detalles.');
      }
      setHasScanned(true); // Still mark as scanned even on error
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
    <div className="bg-gray-900 text-white h-screen flex flex-col font-sans overflow-x-hidden overflow-y-auto">
      <Header onReset={handleClearResults} />
      <main className="w-full px-4 flex-1 flex flex-col min-h-0 overflow-x-hidden">
        <UrlInputForm
          onStandardScan={handleStandardScan}
          onAiScan={handleAiScan}
          isStandardLoading={isStandardLoading}
          isAiLoading={isAiLoading}
          onClearResults={handleClearResults}
          lastScannedUrl={lastScannedUrl}
        />
        {error && (
            <div className="mb-3 p-3 bg-rose-900/50 border border-rose-700 text-rose-300 rounded-lg flex-shrink-0">
                <p className="text-center text-sm mb-2">{error}</p>
                {error.includes('clave') && (
                  <div className="text-center">
                    <button
                      onClick={handleOpenOptions}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      Abrir Configuración
                    </button>
                  </div>
                )}
            </div>
        )}
        {allFiles.length > 0 ? (
          <div className="flex flex-col flex-1 min-h-0 mb-4 overflow-hidden">
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
          <>
            {/* Show Welcome message when no scan has been performed yet */}
            {!hasScanned && !isStandardLoading && !isAiLoading && (
              <WelcomeMessage />
            )}

            {/* Show "No results" message only if scan was performed and no files found */}
            {hasScanned && !isStandardLoading && !isAiLoading && (
              <div className="flex flex-col items-center justify-center py-8 px-4 flex-1">
                <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700 text-center">
                  <SearchIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-300 mb-2">
                    No se encontraron archivos
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    El scan no encontró archivos que coincidan con tus filtros en{' '}
                    <span className="text-sky-400 font-mono text-xs break-all block mt-1">{lastScannedUrl}</span>
                  </p>
                  <div className="text-left text-xs text-gray-400 space-y-1.5 mt-4">
                    <p className="font-semibold text-gray-300 text-sm">Sugerencias:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Verifica que la URL contenga archivos descargables</li>
                      <li>Intenta con diferentes filtros de categorías o tamaño</li>
                      <li>Usa el AI Scan para una búsqueda más profunda</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {selectedFileUrls.size > 0 && (
        <ActionBar
          selectedCount={selectedFileUrls.size}
          selectedFiles={selectedFiles}
        />
      )}

      {/* Onboarding */}
      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}

      {/* Scan Preferences Modal */}
      <Suspense fallback={null}>
        <ScanPreferencesModal
          isOpen={isPreferencesModalOpen}
          onClose={() => setIsPreferencesModalOpen(false)}
          onConfirm={handlePreferencesConfirm}
          initialPreferences={scanPreferences}
        />
      </Suspense>
    </div>
  );
};

export default App;
