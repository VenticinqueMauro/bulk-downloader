
import React from 'react';
import { FileItem } from '../types';
import { FileItemRow } from './FileItemRow';

interface FileListProps {
  files: FileItem[];
  selectedFileUrls: Set<string>;
  onSelectionChange: React.Dispatch<React.SetStateAction<Set<string>>>;
  onToggleSelectAll: () => void;
}

export const FileList: React.FC<FileListProps> = ({ files, selectedFileUrls, onSelectionChange, onToggleSelectAll }) => {
  const isAllSelected = files.length > 0 && selectedFileUrls.size === files.length;
  
  return (
    <div className="flex-grow bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center px-4 py-3 bg-gray-900/40 border-b border-gray-700 text-sm font-medium text-gray-400">
        <div className="w-10 flex-shrink-0 flex items-center">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={onToggleSelectAll}
            className="h-4 w-4 rounded bg-gray-700 border-gray-500 text-sky-500 focus:ring-sky-500 cursor-pointer"
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
        {files.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No files match the current filter.
          </div>
        ) : (
          files.map(file => (
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
    </div>
  );
};
