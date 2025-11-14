
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
    <div className="flex-grow min-h-0 bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden flex flex-col max-w-full">
      {/* Search Bar */}
      <div className="px-3 py-2 bg-gray-900/40 border-b border-gray-700 flex-shrink-0 min-w-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar archivos por nombre, URL o tipo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 pl-8 text-sm bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {searchQuery && (
          <div className="mt-1.5 text-xs text-gray-400">
            Encontrados {filteredFiles.length} de {files.length} archivos
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex items-center px-3 py-2 bg-gray-900/40 border-b border-gray-700 text-xs font-medium text-gray-400 flex-shrink-0 min-w-0">
        <div className="w-10 flex-shrink-0 flex items-center">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={handleTogglePageSelect}
            className="h-4 w-4 rounded bg-gray-700 border-gray-500 text-sky-500 focus:ring-sky-500 cursor-pointer"
            title="Seleccionar todos en esta página"
          />
        </div>
        <div className="flex-1 flex items-center gap-4 min-w-0">
            <div className="flex-1 min-w-0">Nombre del Archivo</div>
            <div className="w-20 text-right flex-shrink-0">Tamaño</div>
            <div className="w-24 text-center flex-shrink-0">Tipo</div>
            <div className="w-10 flex-shrink-0 hidden md:block"></div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-grow min-h-0 overflow-y-auto">
        {paginatedFiles.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            {searchQuery ? 'No hay archivos que coincidan con tu búsqueda.' : 'No hay archivos que coincidan con el filtro actual.'}
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
        <div className="px-3 py-2 bg-gray-900/40 border-t border-gray-700 flex items-center justify-between flex-shrink-0">
          <div className="text-xs text-gray-400">
            Página {currentPage} de {totalPages} • {startIndex + 1}-{Math.min(endIndex, filteredFiles.length)} de {filteredFiles.length}
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 bg-gray-700 border border-gray-600 rounded text-xs text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 bg-gray-700 border border-gray-600 rounded text-xs text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
