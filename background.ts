/**
 * Background Service Worker for FileHarvest
 *
 * Handles scanning operations in the background so they persist
 * even when the popup is closed.
 */

import { performStandardScan, scanUrlWithAI } from './services/geminiService';
import { FileItem, ScanPreferences } from './types';

// Types for message communication
interface ScanMessage {
  type: 'START_STANDARD_SCAN' | 'START_AI_SCAN' | 'GET_SCAN_STATE' | 'CANCEL_SCAN' | 'CLEAR_SCAN_STATE';
  url?: string;
  preferences?: ScanPreferences;
}

interface ScanState {
  isScanning: boolean;
  scanType: 'standard' | 'ai' | null;
  url: string;
  files: FileItem[];
  error: string | null;
  startedAt: number;
  completedAt: number | null;
}

// Current scan state
let currentScanState: ScanState = {
  isScanning: false,
  scanType: null,
  url: '',
  files: [],
  error: null,
  startedAt: 0,
  completedAt: null,
};

/**
 * Save scan state to chrome.storage.local for persistence
 */
async function saveScanState(state: ScanState): Promise<void> {
  await chrome.storage.local.set({ scanState: state });
}

/**
 * Load scan state from chrome.storage.local
 */
async function loadScanState(): Promise<ScanState | null> {
  const result = await chrome.storage.local.get(['scanState']);
  return result.scanState || null;
}

/**
 * Update extension badge to show scan progress
 */
function updateBadge(isScanning: boolean, fileCount: number = 0): void {
  if (isScanning) {
    chrome.action.setBadgeText({ text: '...' });
    chrome.action.setBadgeBackgroundColor({ color: '#0ea5e9' }); // sky-500
    chrome.action.setTitle({ title: 'Escaneando...' });
  } else if (fileCount > 0) {
    chrome.action.setBadgeText({ text: fileCount.toString() });
    chrome.action.setBadgeBackgroundColor({ color: '#10b981' }); // green-500
    chrome.action.setTitle({ title: `${fileCount} archivo${fileCount > 1 ? 's' : ''} encontrado${fileCount > 1 ? 's' : ''}` });
  } else {
    chrome.action.setBadgeText({ text: '' });
    chrome.action.setTitle({ title: 'FileHarvest' });
  }
}

/**
 * Show notification when scan completes
 */
function showScanCompleteNotification(fileCount: number, url: string, scanType: string): void {
  const title = fileCount > 0
    ? `Escaneo completado: ${fileCount} archivo${fileCount > 1 ? 's' : ''} encontrado${fileCount > 1 ? 's' : ''}`
    : 'Escaneo completado: No se encontraron archivos';

  const message = `${scanType === 'ai' ? 'AI Scan' : 'Standard Scan'} en ${new URL(url).hostname}`;

  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title,
    message,
    priority: 1,
  });
}

/**
 * Execute standard scan in background
 */
async function executeStandardScan(url: string, preferences: ScanPreferences): Promise<void> {
  currentScanState = {
    isScanning: true,
    scanType: 'standard',
    url,
    files: [],
    error: null,
    startedAt: Date.now(),
    completedAt: null,
  };

  await saveScanState(currentScanState);
  updateBadge(true);

  try {
    console.log(`🔍 Background: Starting standard scan for ${url}`);
    const files = await performStandardScan(url, preferences);

    currentScanState = {
      ...currentScanState,
      isScanning: false,
      files,
      completedAt: Date.now(),
    };

    await saveScanState(currentScanState);
    updateBadge(false, files.length);
    showScanCompleteNotification(files.length, url, 'standard');

    console.log(`✅ Background: Standard scan completed. Found ${files.length} files`);

    // Notify popup if it's open
    chrome.runtime.sendMessage({
      type: 'SCAN_COMPLETE',
      scanType: 'standard',
      files,
      url,
    }).catch(() => {
      // Popup might not be open, that's ok
    });

  } catch (error: any) {
    console.error('❌ Background: Standard scan failed:', error);

    currentScanState = {
      ...currentScanState,
      isScanning: false,
      error: error.message || 'El escaneo estándar falló',
      completedAt: Date.now(),
    };

    await saveScanState(currentScanState);
    updateBadge(false);

    // Notify popup of error
    chrome.runtime.sendMessage({
      type: 'SCAN_ERROR',
      scanType: 'standard',
      error: error.message,
      url,
    }).catch(() => {
      // Popup might not be open
    });
  }
}

/**
 * Execute AI scan in background
 */
async function executeAiScan(url: string, preferences: ScanPreferences): Promise<void> {
  currentScanState = {
    isScanning: true,
    scanType: 'ai',
    url,
    files: [],
    error: null,
    startedAt: Date.now(),
    completedAt: null,
  };

  await saveScanState(currentScanState);
  updateBadge(true);

  try {
    console.log(`🤖 Background: Starting AI scan for ${url}`);
    const files = await scanUrlWithAI(url, preferences);

    currentScanState = {
      ...currentScanState,
      isScanning: false,
      files,
      completedAt: Date.now(),
    };

    await saveScanState(currentScanState);
    updateBadge(false, files.length);
    showScanCompleteNotification(files.length, url, 'ai');

    console.log(`✅ Background: AI scan completed. Found ${files.length} files`);

    // Notify popup if it's open
    chrome.runtime.sendMessage({
      type: 'SCAN_COMPLETE',
      scanType: 'ai',
      files,
      url,
    }).catch(() => {
      // Popup might not be open, that's ok
    });

  } catch (error: any) {
    console.error('❌ Background: AI scan failed:', error);

    currentScanState = {
      ...currentScanState,
      isScanning: false,
      error: error.message || 'El escaneo con IA falló',
      completedAt: Date.now(),
    };

    await saveScanState(currentScanState);
    updateBadge(false);

    // Notify popup of error
    chrome.runtime.sendMessage({
      type: 'SCAN_ERROR',
      scanType: 'ai',
      error: error.message,
      url,
    }).catch(() => {
      // Popup might not be open
    });
  }
}

/**
 * Handle messages from popup
 */
chrome.runtime.onMessage.addListener((message: ScanMessage, sender, sendResponse) => {
  console.log('📨 Background received message:', message.type, message);

  // Always send response to prevent "message port closed" errors
  try {

  switch (message.type) {
    case 'START_STANDARD_SCAN':
      if (message.url && message.preferences) {
        executeStandardScan(message.url, message.preferences);
        sendResponse({ success: true, message: 'Standard scan started' });
      } else {
        sendResponse({ success: false, message: 'Missing URL or preferences' });
      }
      break;

    case 'START_AI_SCAN':
      if (message.url && message.preferences) {
        executeAiScan(message.url, message.preferences);
        sendResponse({ success: true, message: 'AI scan started' });
      } else {
        sendResponse({ success: false, message: 'Missing URL or preferences' });
      }
      break;

    case 'GET_SCAN_STATE':
      sendResponse({ success: true, state: currentScanState });
      break;

    case 'CANCEL_SCAN':
      if (currentScanState.isScanning) {
        currentScanState = {
          ...currentScanState,
          isScanning: false,
          error: 'Escaneo cancelado por el usuario',
          completedAt: Date.now(),
        };
        saveScanState(currentScanState);
        updateBadge(false);
        sendResponse({ success: true, message: 'Scan cancelled' });
      } else {
        sendResponse({ success: false, message: 'No scan in progress' });
      }
      break;

    case 'CLEAR_SCAN_STATE':
      currentScanState = {
        isScanning: false,
        scanType: null,
        url: '',
        files: [],
        error: null,
        startedAt: 0,
        completedAt: null,
      };
      chrome.storage.local.remove(['scanState']);
      updateBadge(false);
      sendResponse({ success: true, message: 'Scan state cleared' });
      break;

    default:
      sendResponse({ success: false, message: 'Unknown message type' });
  }
  } catch (error: any) {
    console.error('❌ Background error handling message:', error);
    sendResponse({ success: false, message: error.message || 'Internal error' });
  }

  return true; // Keep message channel open for async response
});

/**
 * Initialize: Load saved state on service worker startup
 */
(async () => {
  const savedState = await loadScanState();
  if (savedState) {
    currentScanState = savedState;
    // Update badge based on saved state
    if (savedState.isScanning) {
      updateBadge(true);
    } else if (savedState.files.length > 0) {
      updateBadge(false, savedState.files.length);
    }
    console.log('🔄 Background: Restored scan state from storage');
  }
})();

console.log('🚀 FileHarvest background service worker loaded');
