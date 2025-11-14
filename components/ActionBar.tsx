// FIX: Moved the chrome types reference to the top of the file to ensure it is processed correctly.
/// <reference types="chrome" />
import React, { useState } from 'react';
import { FileItem } from '../types';
import { DownloadIcon, ClipboardIcon } from './icons';

interface ActionBarProps {
  selectedCount: number;
  selectedFiles: FileItem[];
}

export const ActionBar: React.FC<ActionBarProps> = ({ selectedCount, selectedFiles }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadSelected = async () => {
    if (!(window.chrome && window.chrome.downloads)) {
      alert("Descarga fallida. Esta función debe ejecutarse desde la extensión de Chrome.");
      console.warn("chrome.downloads API not available.");
      return;
    }

    setIsDownloading(true);

    for (const file of selectedFiles) {
      try {
        // Extract extension from URL if filename doesn't have one
        let finalFilename = file.name;
        const hasExtension = /\.[a-zA-Z0-9]+$/.test(finalFilename);

        if (!hasExtension) {
          // Try to get extension from URL
          const urlParts = file.url.split('.');
          if (urlParts.length > 1) {
            const urlExt = urlParts[urlParts.length - 1].split('?')[0].split('#')[0];
            if (urlExt && urlExt.length <= 5) {
              finalFilename = `${finalFilename}.${urlExt}`;
            }
          }
        }

        const sanitizedFilename = finalFilename.replace(/[<>:"/\\|?*]+/g, '_');
        chrome.downloads.download({
          url: file.url,
          filename: sanitizedFilename
        });
        // Add a small delay between downloads to be kind to the browser's download manager
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Failed to initiate download for ${file.name}:`, error);
      }
    }

    setIsDownloading(false);
  };

  const handleCopyLinks = () => {
    const links = selectedFiles.map(f => f.url).join('\n');
    navigator.clipboard.writeText(links).then(() => {
      alert(`${selectedCount} enlaces copiados al portapapeles!`);
    }, (err) => {
      alert('Error al copiar enlaces.');
      console.error('Could not copy text: ', err);
    });
  };


  return (
    <div className="sticky bottom-0 left-0 right-0 z-10 bg-gray-900/80 backdrop-blur-md border-t border-gray-700/50">
        <div className="container mx-auto p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-lg font-medium">
                <span className="text-sky-400 font-bold">{selectedCount}</span> archivo{selectedCount > 1 ? 's' : ''} seleccionado{selectedCount > 1 ? 's' : ''}
            </div>
            <div className="flex items-stretch gap-3">
                <button
                    onClick={handleCopyLinks}
                    disabled={isDownloading}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ClipboardIcon className="h-5 w-5" />
                    <span>Copiar Enlaces</span>
                </button>
                <button
                    onClick={handleDownloadSelected}
                    disabled={isDownloading}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-500 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-48 justify-center"
                >
                    {isDownloading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Descargando...</span>
                      </>
                    ) : (
                      <>
                        <DownloadIcon className="h-5 w-5" />
                        <span>Descargar Selección</span>
                      </>
                    )}
                </button>
            </div>
        </div>
    </div>
  );
};