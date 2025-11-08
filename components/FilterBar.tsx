
import React from 'react';
import { FilterType } from '../types';
import { ImageIcon, VideoIcon, MusicIcon, DocumentIcon, ArchiveIcon, AllIcon } from './icons';

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
];

export const FilterBar: React.FC<FilterBarProps> = ({ currentFilter, onFilterChange, fileCounts }) => {
  return (
    <div className="my-4 sm:my-6">
        <div className="flex flex-wrap gap-2 sm:gap-3">
            {filterOptions.map(option => {
                const count = fileCounts[option.id] || 0;
                if(option.id !== 'all' && count === 0) return null;
                const isActive = currentFilter === option.id;
                
                return (
                    <button
                        key={option.id}
                        onClick={() => onFilterChange(option.id)}
                        className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base font-medium rounded-full transition-all duration-200 ${
                        isActive 
                            ? 'bg-sky-600 text-white shadow-md' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                        }`}
                    >
                        <option.icon className="h-5 w-5" />
                        <span>{option.label}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-sky-400' : 'bg-gray-600'}`}>
                            {count}
                        </span>
                    </button>
                )
            })}
        </div>
    </div>
  );
};
