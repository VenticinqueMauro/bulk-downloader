// FIX: Moved the chrome types reference to the top of the file to ensure it is processed correctly.
/// <reference types="chrome" />
import React from 'react';
import { FileItem } from '../types';
import { DownloadIcon } from './icons';
import { FilePreview } from './FilePreview';

interface FileItemRowProps {
  file: FileItem;
  isSelected: boolean;
  onToggleSelect: () => void;
}

const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const getFileTypeColor = (type: FileItem['type']): string => {
  switch (type) {
    case 'Image': return 'bg-purple-500/20 text-purple-300';
    case 'Video': return 'bg-rose-500/20 text-rose-300';
    case 'Audio': return 'bg-emerald-500/20 text-emerald-300';
    case 'Document': return 'bg-blue-500/20 text-blue-300';
    case 'Archive': return 'bg-orange-500/20 text-orange-300';
    case 'Font': return 'bg-yellow-500/20 text-yellow-300';
    case 'Style': return 'bg-pink-500/20 text-pink-300';
    case 'Script': return 'bg-cyan-500/20 text-cyan-300';
    case 'Code': return 'bg-green-500/20 text-green-300';
    case 'Model3D': return 'bg-indigo-500/20 text-indigo-300';
    case 'Data': return 'bg-teal-500/20 text-teal-300';
    case 'Executable': return 'bg-red-500/20 text-red-300';
    default: return 'bg-gray-500/20 text-gray-300';
  }
}

export const FileItemRow: React.FC<FileItemRowProps> = ({ file, isSelected, onToggleSelect }) => {

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.chrome && window.chrome.downloads) {
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

      // Sanitize filename to remove characters forbidden by filesystems
      const sanitizedFilename = finalFilename.replace(/[<>:"/\\|?*]+/g, '_');
      chrome.downloads.download({
        url: file.url,
        filename: sanitizedFilename,
      });
    } else {
      alert("Download failed. This feature must be run from the Chrome Extension.");
      console.warn("chrome.downloads API not available. Are you running this as an extension?");
    }
  };

  return (
    <div
        className={`flex items-center px-3 py-2 border-b border-gray-700/50 transition-colors duration-150 min-w-0 ${isSelected ? 'bg-sky-900/30' : 'hover:bg-gray-700/40'}`}
        onClick={onToggleSelect}
    >
      <div className="w-10 flex-shrink-0">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="h-3.5 w-3.5 rounded bg-gray-700 border-gray-500 text-sky-500 focus:ring-sky-500 cursor-pointer"
        />
      </div>
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <FilePreview file={file} />
        <div className="flex-1 flex items-center gap-3 min-w-0">
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="truncate text-sm text-gray-200 hover:underline min-w-0 flex-1"
              title={file.name}
            >
              {file.name}
            </a>
        </div>
        <div className="w-20 text-right text-gray-300 font-mono text-xs flex-shrink-0">
          {file.size > 0 ? formatBytes(file.size) : 'N/A'}
        </div>
        <div className="w-24 text-center flex-shrink-0">
             <span className={`px-2 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap ${getFileTypeColor(file.type)}`}>
                {file.type}
            </span>
        </div>
        <div className="w-10 flex-shrink-0 hidden md:flex justify-end">
          <button
            onClick={handleDownload}
            title="Download file"
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-600 rounded-full transition-colors"
          >
            <DownloadIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};