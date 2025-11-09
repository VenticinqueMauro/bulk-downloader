import React, { useState, useEffect } from 'react';
import { XMarkIcon, AdjustmentsHorizontalIcon } from './icons';
import { FileCategory, ScanPreferences, ScanPreset } from '../types';

interface ScanPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (preferences: ScanPreferences) => void;
  initialPreferences?: ScanPreferences;
}

// Predefined presets for quick selection
const PRESETS: ScanPreset[] = [
  {
    name: 'Todo',
    description: 'Todos los tipos de archivos',
    categories: ['Image', 'Video', 'Audio', 'Document', 'Archive', 'Font', 'Style', 'Script', 'Code', 'Model3D', 'Data', 'Executable', 'Other']
  },
  {
    name: 'Media',
    description: 'Imágenes, videos y audio',
    categories: ['Image', 'Video', 'Audio']
  },
  {
    name: 'Documentos',
    description: 'Archivos de documento',
    categories: ['Document', 'Archive']
  },
  {
    name: 'Código',
    description: 'Archivos de desarrollo',
    categories: ['Code', 'Script', 'Style', 'Font', 'Data']
  },
  {
    name: '3D & Design',
    description: 'Modelos 3D y diseño',
    categories: ['Model3D', 'Image', 'Font']
  },
];

// Category labels with icons/emojis
const CATEGORY_INFO: Record<FileCategory, { label: string; icon: string; description: string }> = {
  Image: { label: 'Imágenes', icon: '🖼️', description: 'JPG, PNG, GIF, SVG, WebP, etc.' },
  Video: { label: 'Videos', icon: '🎬', description: 'MP4, WebM, AVI, MOV, MKV, etc.' },
  Audio: { label: 'Audio', icon: '🎵', description: 'MP3, WAV, OGG, FLAC, AAC, etc.' },
  Document: { label: 'Documentos', icon: '📄', description: 'PDF, DOC, XLS, TXT, EPUB, etc.' },
  Archive: { label: 'Archivos', icon: '📦', description: 'ZIP, RAR, 7Z, TAR, ISO, etc.' },
  Font: { label: 'Fuentes', icon: '🔤', description: 'TTF, OTF, WOFF, WOFF2, EOT, etc.' },
  Style: { label: 'Estilos', icon: '🎨', description: 'CSS, SCSS, SASS, LESS, etc.' },
  Script: { label: 'Scripts', icon: '⚡', description: 'JS, TS, JSX, TSX, Coffee, etc.' },
  Code: { label: 'Código', icon: '💻', description: 'PY, Java, C, C++, Go, Rust, etc.' },
  Model3D: { label: 'Modelos 3D', icon: '🎲', description: 'OBJ, FBX, GLTF, GLB, STL, etc.' },
  Data: { label: 'Datos', icon: '💾', description: 'JSON, XML, YAML, SQL, CSV, etc.' },
  Executable: { label: 'Ejecutables', icon: '⚙️', description: 'EXE, APP, APK, DEB, MSI, etc.' },
  Other: { label: 'Otros', icon: '📋', description: 'Otros tipos de archivos' },
};

const ALL_CATEGORIES: FileCategory[] = [
  'Image', 'Video', 'Audio', 'Document', 'Archive', 'Font',
  'Style', 'Script', 'Code', 'Model3D', 'Data', 'Executable', 'Other'
];

export const ScanPreferencesModal: React.FC<ScanPreferencesModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialPreferences
}) => {
  // State
  const [selectedCategories, setSelectedCategories] = useState<FileCategory[]>(
    initialPreferences?.categories || ALL_CATEGORIES
  );
  const [minSize, setMinSize] = useState<string>(
    initialPreferences?.minSize ? (initialPreferences.minSize / 1024).toString() : ''
  );
  const [maxSize, setMaxSize] = useState<string>(
    initialPreferences?.maxSize ? (initialPreferences.maxSize / 1024).toString() : ''
  );
  const [rememberPreferences, setRememberPreferences] = useState(
    initialPreferences?.rememberPreferences || false
  );

  // Reset to initial preferences when modal opens
  useEffect(() => {
    if (isOpen && initialPreferences) {
      setSelectedCategories(initialPreferences.categories);
      setMinSize(initialPreferences.minSize ? (initialPreferences.minSize / 1024).toString() : '');
      setMaxSize(initialPreferences.maxSize ? (initialPreferences.maxSize / 1024).toString() : '');
      setRememberPreferences(initialPreferences.rememberPreferences);
    }
  }, [isOpen, initialPreferences]);

  // Handlers
  const toggleCategory = (category: FileCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const selectPreset = (preset: ScanPreset) => {
    setSelectedCategories(preset.categories);
  };

  const toggleSelectAll = () => {
    if (selectedCategories.length === ALL_CATEGORIES.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(ALL_CATEGORIES);
    }
  };

  const handleConfirm = () => {
    const preferences: ScanPreferences = {
      categories: selectedCategories,
      minSize: minSize ? parseFloat(minSize) * 1024 : 0,
      maxSize: maxSize ? parseFloat(maxSize) * 1024 : 0,
      rememberPreferences
    };
    onConfirm(preferences);
  };

  if (!isOpen) return null;

  const allSelected = selectedCategories.length === ALL_CATEGORIES.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm overflow-y-auto p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-3xl my-8 transform transition-all flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-400/10 rounded-full">
                <AdjustmentsHorizontalIcon className="h-8 w-8 text-sky-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Configurar Scan</h2>
                <p className="text-gray-400">Selecciona qué tipos de archivos buscar</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-500 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Presets Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">Presets Rápidos</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {PRESETS.map(preset => (
                <button
                  key={preset.name}
                  onClick={() => selectPreset(preset)}
                  className="px-3 py-2 bg-gray-700 hover:bg-sky-600 rounded-lg text-sm font-medium text-white transition-colors text-left"
                  title={preset.description}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Select All / Deselect All */}
          <div className="mb-4">
            <button
              onClick={toggleSelectAll}
              className="text-sm text-sky-400 hover:text-sky-300 font-medium"
            >
              {allSelected ? '❌ Deseleccionar todo' : '✅ Seleccionar todo'}
            </button>
            <span className="ml-3 text-xs text-gray-500">
              {selectedCategories.length} de {ALL_CATEGORIES.length} seleccionados
            </span>
          </div>

          {/* Categories Grid */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">Tipos de Archivo</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ALL_CATEGORIES.map(category => {
                const info = CATEGORY_INFO[category];
                const isSelected = selectedCategories.includes(category);
                return (
                  <label
                    key={category}
                    className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-sky-600/20 border-sky-500'
                        : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleCategory(category)}
                      className="mt-1 w-4 h-4 rounded border-gray-500 text-sky-600 focus:ring-sky-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{info.icon}</span>
                        <span className="font-medium text-white">{info.label}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{info.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Size Filters Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">Filtros de Tamaño</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Tamaño Mínimo (KB)</label>
                <input
                  type="number"
                  value={minSize}
                  onChange={e => setMinSize(e.target.value)}
                  placeholder="Ej: 100"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Tamaño Máximo (KB)</label>
                <input
                  type="number"
                  value={maxSize}
                  onChange={e => setMaxSize(e.target.value)}
                  placeholder="Ej: 10000"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Deja vacío para sin límite. 1024 KB = 1 MB
            </p>
          </div>

          {/* Remember Preferences */}
          <div className="mb-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberPreferences}
                onChange={e => setRememberPreferences(e.target.checked)}
                className="w-4 h-4 rounded border-gray-500 text-sky-600 focus:ring-sky-500"
              />
              <span className="text-sm text-gray-300">
                Recordar mi selección para futuros scans
              </span>
            </label>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="sticky bottom-0 bg-gray-800/95 backdrop-blur-md border-t border-gray-700/50 p-4 sm:p-6 rounded-b-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-sm text-gray-400">
              <span className="text-sky-400 font-bold">{selectedCategories.length}</span> categoría{selectedCategories.length !== 1 ? 's' : ''} seleccionada{selectedCategories.length !== 1 ? 's' : ''}
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none py-3 px-6 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={selectedCategories.length === 0}
                className="flex-1 sm:flex-none py-3 px-6 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-500 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Iniciar Scan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
