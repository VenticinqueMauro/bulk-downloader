
import React from 'react';
import { LogoIcon, StarIcon } from './icons';

interface HeaderProps {
  isProUser: boolean;
  onTogglePro: () => void;
  scanCredits: number;
}

export const Header: React.FC<HeaderProps> = ({ isProUser, onTogglePro, scanCredits }) => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <LogoIcon className="h-8 w-8 text-sky-400" />
            <h1 className="text-xl font-bold text-white">Gemini Bulk Downloader</h1>
          </div>
          <div className="flex items-center gap-4">
            {isProUser ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-400/10 border border-amber-400/20 rounded-full text-sm">
                <StarIcon className="h-5 w-5 text-amber-400" />
                <span className="font-semibold text-amber-300">PRO</span>
              </div>
            ) : (
              <div className="text-sm text-gray-400">
                <span className="font-semibold text-white">{scanCredits}</span> free scan{scanCredits !== 1 ? 's' : ''} left
              </div>
            )}
            {/* This button is for simulation/debugging purposes */}
            <button onClick={onTogglePro} className="text-xs px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">
              Toggle Pro
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
