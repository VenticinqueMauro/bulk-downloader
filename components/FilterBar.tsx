
import React from 'react';
import { FilterType } from '../types';
import {
  ImageIcon,
  VideoIcon,
  MusicIcon,
  DocumentIcon,
  ArchiveIcon,
  AllIcon,
  FontIcon,
  StyleIcon,
  ScriptIcon,
  CodeIcon,
  Model3DIcon,
  DataIcon,
  ExecutableIcon,
  OtherIcon
} from './icons';

interface FilterBarProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  fileCounts: Partial<Record<FilterType, number>>;
}

const filterOptions: { id: FilterType; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { id: 'all', label: 'All', icon: AllIcon },
  { id: 'image', label: 'Images', icon: ImageIcon },
  { id: 'video', label: 'Videos', icon: VideoIcon },
  { id: 'audio', label: 'Audio', icon: MusicIcon },
  { id: 'document', label: 'Documents', icon: DocumentIcon },
  { id: 'archive', label: 'Archives', icon: ArchiveIcon },
  { id: 'font', label: 'Fonts', icon: FontIcon },
  { id: 'style', label: 'Styles', icon: StyleIcon },
  { id: 'script', label: 'Scripts', icon: ScriptIcon },
  { id: 'code', label: 'Code', icon: CodeIcon },
  { id: 'model3d', label: '3D Models', icon: Model3DIcon },
  { id: 'data', label: 'Data', icon: DataIcon },
  { id: 'executable', label: 'Executables', icon: ExecutableIcon },
  { id: 'other', label: 'Other', icon: OtherIcon },
];

export const FilterBar: React.FC<FilterBarProps> = ({ currentFilter, onFilterChange, fileCounts }) => {
  return (
    <div className="mb-3">
        <div className="flex flex-wrap gap-2">
            {filterOptions.map(option => {
                const count = fileCounts[option.id] || 0;
                if(option.id !== 'all' && count === 0) return null;
                const isActive = currentFilter === option.id;
                
                return (
                    <button
                        key={option.id}
                        onClick={() => onFilterChange(option.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                        isActive
                            ? 'bg-sky-600 text-white shadow-md'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                        }`}
                    >
                        <option.icon className="h-4 w-4" />
                        <span>{option.label}</span>
                        <span className={`px-1.5 py-0.5 rounded-full text-xs ${isActive ? 'bg-sky-400' : 'bg-gray-600'}`}>
                            {count}
                        </span>
                    </button>
                )
            })}
        </div>
    </div>
  );
};
