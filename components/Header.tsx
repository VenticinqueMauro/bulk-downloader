
import React from 'react';
import { LogoIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-20 flex-shrink-0">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center gap-2.5">
            <LogoIcon className="h-6 w-6 text-sky-400" />
            <h1 className="text-lg font-bold text-white">FileHarvest</h1>
          </div>
        </div>
      </div>
    </header>
  );
};
