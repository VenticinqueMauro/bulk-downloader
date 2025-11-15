
import React, { useState, useMemo, useCallback, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { UrlInputForm } from './components/UrlInputForm';
import { FilterBar } from './components/FilterBar';
import { FileList } from './components/FileList';
import { ActionBar } from './components/ActionBar';
import { WelcomeMessage } from './components/WelcomeMessage';
import { LoadingState } from './components/LoadingState';
import { Onboarding } from './components/Onboarding';
import { FileItem, FilterType, ScanPreferences, FileCategory } from './types';
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
  const [scanStartTime, setScanStartTime] = useState<number | undefined>(undefined); // Track when scan started (for progress persistence)

  // Scan preferences state
  const [scanPreferences, setScanPreferences] = useState<ScanPreferences>(DEFAULT_PREFERENCES);
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
  const [pendingScanUrl, setPendingScanUrl] = useState<string>('');
  const [pendingScanType, setPendingScanType] = useState<'standard' | 'ai' | null>(null);

  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Load saved preferences, check onboarding status, and restore scan state on mount
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

    // Request scan state from background service worker
    chrome.runtime.sendMessage({ type: 'GET_SCAN_STATE' }, (response) => {
      if (response?.success && response.state) {
        const state = response.state;
        console.log('📥 Restored scan state from background:', state);

        // Restore scan state
        if (state.isScanning) {
          if (state.scanType === 'standard') {
            setIsStandardLoading(true);
          } else if (state.scanType === 'ai') {
            setIsAiLoading(true);
          }
          setLastScannedUrl(state.url);
          setScanStartTime(state.startedAt); // Restore start time for progress
          setHasScanned(true);
        } else if (state.files.length > 0) {
          // Scan completed, restore results
          setAllFiles(state.files);
          setLastScannedUrl(state.url);
          setHasScanned(true);
        } else if (state.error) {
          // Scan failed, show error
          setError(state.error);
          setLastScannedUrl(state.url);
          setHasScanned(true);
        }
      }
    });

    // Listen for messages from background service worker
    const messageListener = (message: any) => {
      console.log('📨 Popup received message from background:', message.type);

      if (message.type === 'SCAN_COMPLETE') {
        setIsStandardLoading(false);
        setIsAiLoading(false);
        setScanStartTime(undefined); // Clear start time
        setAllFiles(message.files);
        setError(null);
        setHasScanned(true);
        console.log(`✅ Scan completed: ${message.files.length} files found`);
      } else if (message.type === 'SCAN_ERROR') {
        setIsStandardLoading(false);
        setIsAiLoading(false);
        setScanStartTime(undefined); // Clear start time
        setError(message.error);
        setHasScanned(true);
        console.error('❌ Scan failed:', message.error);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    // Cleanup listener on unmount
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);
  
  const handleClearResults = useCallback(() => {
    setAllFiles([]);
    setSelectedFileUrls(new Set());
    setError(null);
    setHasScanned(false);
    // Clear background scan state
    chrome.runtime.sendMessage({ type: 'CLEAR_SCAN_STATE' });
  }, []);

  const handleCancelScan = useCallback(() => {
    console.log('🛑 User cancelled scan');

    // Send cancel message to background worker
    chrome.runtime.sendMessage({ type: 'CANCEL_SCAN' }, (response) => {
      if (response?.success) {
        console.log('✅ Scan cancelled successfully');
        setIsStandardLoading(false);
        setIsAiLoading(false);
        setScanStartTime(undefined); // Clear start time
        setError('Escaneo cancelado por el usuario');
        setHasScanned(true);
      } else {
        console.warn('⚠️ Failed to cancel scan:', response?.message);
      }
    });
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
    setAllFiles([]); // Clear previous results
    setSelectedFileUrls(new Set());
    setLastScannedUrl(url);
    setScanStartTime(Date.now()); // Set start time
    setHasScanned(true);

    console.log('🚀 Popup: Starting standard scan for:', url);

    // Send scan request to background service worker
    try {
      chrome.runtime.sendMessage({
        type: 'START_STANDARD_SCAN',
        url,
        preferences,
      }, (response) => {
        // Check for runtime errors
        if (chrome.runtime.lastError) {
          console.error('❌ Popup: Runtime error:', chrome.runtime.lastError);
          setError(`Error de comunicación: ${chrome.runtime.lastError.message}`);
          setIsStandardLoading(false);
          return;
        }

        console.log('📨 Popup: Response from background:', response);

        if (!response?.success) {
          const errorMsg = response?.message || 'No se pudo iniciar el escaneo';
          console.error('❌ Popup: Scan failed to start:', errorMsg);
          setError(`No se pudo iniciar el escaneo: ${errorMsg}`);
          setIsStandardLoading(false);
        }
        // Else: scan started successfully, will receive results via message listener
      });
    } catch (error: any) {
      console.error('❌ Popup: Exception sending message:', error);
      setError(`Error inesperado: ${error.message}`);
      setIsStandardLoading(false);
    }
  };

  const executeAiScan = async (url: string, preferences: ScanPreferences) => {
    setIsAiLoading(true);
    setError(null);
    setAllFiles([]); // Clear previous results
    setLastScannedUrl(url);
    setScanStartTime(Date.now()); // Set start time
    setHasScanned(true);

    console.log('🤖 Popup: Starting AI scan for:', url);

    // Send scan request to background service worker
    try {
      chrome.runtime.sendMessage({
        type: 'START_AI_SCAN',
        url,
        preferences,
      }, (response) => {
        // Check for runtime errors
        if (chrome.runtime.lastError) {
          console.error('❌ Popup: Runtime error:', chrome.runtime.lastError);
          setError(`Error de comunicación: ${chrome.runtime.lastError.message}`);
          setIsAiLoading(false);
          return;
        }

        console.log('📨 Popup: Response from background:', response);

        if (!response?.success) {
          const errorMsg = response?.message || 'No se pudo iniciar el escaneo con IA';
          console.error('❌ Popup: AI scan failed to start:', errorMsg);
          setError(`No se pudo iniciar el escaneo con IA: ${errorMsg}`);
          setIsAiLoading(false);
        }
        // Else: scan started successfully, will receive results via message listener
      });
    } catch (error: any) {
      console.error('❌ Popup: Exception sending message:', error);
      setError(`Error inesperado: ${error.message}`);
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
                {(error.includes('clave') || error.includes('API key')) && (
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
            {/* Show Loading state when scanning */}
            {(isStandardLoading || isAiLoading) && (
              <LoadingState
                scanType={isAiLoading ? 'ai' : 'standard'}
                url={lastScannedUrl}
                startTime={scanStartTime}
                onCancel={handleCancelScan}
              />
            )}

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
