
import React from 'react';
import { LogoIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <LogoIcon className="h-8 w-8 text-sky-400" />
            <h1 className="text-xl font-bold text-white">FileHarvest</h1>
          </div>
        </div>
      </div>
    </header>
  );
};
