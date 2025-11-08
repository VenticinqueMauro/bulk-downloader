// FIX: Moved the chrome types reference to the top of the file to ensure it is processed correctly.
/// <reference types="chrome" />
import React from 'react';
import { FileItem } from '../types';
import { DownloadIcon, ImageIcon, VideoIcon, MusicIcon, DocumentIcon, ArchiveIcon, OtherIcon } from './icons';

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

const getFileTypeIcon = (type: FileItem['type']): React.ReactElement => {
    const props = { className: "h-6 w-6" };
    switch (type) {
        case 'Image': return <ImageIcon {...props} />;
        case 'Video': return <VideoIcon {...props} />;
        case 'Audio': return <MusicIcon {...props} />;
        case 'Document': return <DocumentIcon {...props} />;
        case 'Archive': return <ArchiveIcon {...props} />;
        default: return <OtherIcon {...props} />;
    }
}

export const FileItemRow: React.FC<FileItemRowProps> = ({ file, isSelected, onToggleSelect }) => {

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.chrome && window.chrome.downloads) {
      // Sanitize filename to remove characters forbidden by filesystems
      const sanitizedFilename = file.name.replace(/[<>:"/\\|?*]+/g, '_');
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
        className={`flex items-center px-4 py-3 border-b border-gray-700/50 transition-colors duration-150 ${isSelected ? 'bg-sky-900/30' : 'hover:bg-gray-700/40'}`}
        onClick={onToggleSelect}
    >
      <div className="w-10 flex-shrink-0">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="h-4 w-4 rounded bg-gray-700 border-gray-500 text-sky-500 focus:ring-sky-500 cursor-pointer"
        />
      </div>
      <div className="flex-grow grid grid-cols-12 gap-4 items-center">
        <div className="col-span-6 md:col-span-7 flex items-center gap-3 truncate">
            <div className="text-gray-400 flex-shrink-0">{getFileTypeIcon(file.type)}</div>
            <a 
              href={file.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={(e) => e.stopPropagation()}
              className="truncate text-gray-200 hover:underline" 
              title={file.name}
            >
              {file.name}
            </a>
        </div>
        <div className="col-span-3 md:col-span-2 text-right text-gray-300 font-mono text-sm">
          {file.size > 0 ? formatBytes(file.size) : 'N/A'}
        </div>
        <div className="col-span-3 md:col-span-2 text-center">
             <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                file.type === 'Image' ? 'bg-purple-500/20 text-purple-300' :
                file.type === 'Video' ? 'bg-rose-500/20 text-rose-300' :
                file.type === 'Audio' ? 'bg-emerald-500/20 text-emerald-300' :
                file.type === 'Document' ? 'bg-blue-500/20 text-blue-300' :
                file.type === 'Archive' ? 'bg-orange-500/20 text-orange-300' :
                'bg-gray-500/20 text-gray-300'
             }`}>
                {file.type}
            </span>
        </div>
        <div className="hidden md:flex col-span-1 justify-end">
          <button 
            onClick={handleDownload}
            title="Download file"
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-full transition-colors"
          >
            <DownloadIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};