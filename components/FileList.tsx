
import React, { useState, useMemo } from 'react';
import { FileItem } from '../types';
import { FileItemRow } from './FileItemRow';

interface FileListProps {
  files: FileItem[];
  selectedFileUrls: Set<string>;
  onSelectionChange: React.Dispatch<React.SetStateAction<Set<string>>>;
  onToggleSelectAll: () => void;
}

const ITEMS_PER_PAGE = 20;

export const FileList: React.FC<FileListProps> = ({ files, selectedFileUrls, onSelectionChange, onToggleSelectAll }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter files by search query
  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return files;

    const query = searchQuery.toLowerCase();
    return files.filter(file =>
      file.name.toLowerCase().includes(query) ||
      file.url.toLowerCase().includes(query) ||
      file.type.toLowerCase().includes(query)
    );
  }, [files, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredFiles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedFiles = filteredFiles.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const isAllSelected = paginatedFiles.length > 0 &&
    paginatedFiles.every(file => selectedFileUrls.has(file.url));

  const handleTogglePageSelect = () => {
    const newSelection = new Set(selectedFileUrls);
    if (isAllSelected) {
      paginatedFiles.forEach(file => newSelection.delete(file.url));
    } else {
      paginatedFiles.forEach(file => newSelection.add(file.url));
    }
    onSelectionChange(newSelection);
  };

  return (
    <div className="flex-grow bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden flex flex-col">
      {/* Search Bar */}
      <div className="px-4 py-3 bg-gray-900/40 border-b border-gray-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Search files by name, URL, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {searchQuery && (
          <div className="mt-2 text-xs text-gray-400">
            Found {filteredFiles.length} of {files.length} files
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex items-center px-4 py-3 bg-gray-900/40 border-b border-gray-700 text-sm font-medium text-gray-400">
        <div className="w-10 flex-shrink-0 flex items-center">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={handleTogglePageSelect}
            className="h-4 w-4 rounded bg-gray-700 border-gray-500 text-sky-500 focus:ring-sky-500 cursor-pointer"
            title="Select all on this page"
          />
        </div>
        <div className="flex-grow grid grid-cols-12 gap-4 items-center">
            <div className="col-span-6 md:col-span-7">File Name</div>
            <div className="col-span-3 md:col-span-2 text-right">Size</div>
            <div className="col-span-3 md:col-span-2 text-center">Type</div>
            <div className="hidden md:block md:col-span-1 text-right">Action</div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-grow overflow-y-auto">
        {paginatedFiles.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            {searchQuery ? 'No files match your search.' : 'No files match the current filter.'}
          </div>
        ) : (
          paginatedFiles.map(file => (
            <FileItemRow
              key={file.url}
              file={file}
              isSelected={selectedFileUrls.has(file.url)}
              onToggleSelect={() => {
                const newSelection = new Set(selectedFileUrls);
                if (newSelection.has(file.url)) {
                  newSelection.delete(file.url);
                } else {
                  newSelection.add(file.url);
                }
                onSelectionChange(newSelection);
              }}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 bg-gray-900/40 border-t border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Page {currentPage} of {totalPages} • Showing {startIndex + 1}-{Math.min(endIndex, filteredFiles.length)} of {filteredFiles.length}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
