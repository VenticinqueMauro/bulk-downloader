
import React from 'react';
import newIcon from '../icons/icon128.png';
import { DonationButton } from './DonationButton';

interface HeaderProps {
  onReset?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="sticky top-0 z-20 flex-shrink-0 border-b backdrop-blur-md bg-gray-900/80 border-gray-700/50 w-full">
      <div className="w-full px-4">
        <div className="flex justify-between items-center h-12">
          <button
            onClick={onReset}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer"
            title="Volver al inicio"
          >
            <img src={newIcon} alt="FileHarvest" className="w-10 h-10" />
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">FileHarvest</h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded">
                Beta
              </span>
            </div>
          </button>
          <DonationButton />
        </div>
      </div>
    </header>
  );
};
