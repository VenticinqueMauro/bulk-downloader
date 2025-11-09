
import React from 'react';
import newIcon from '../icons/newIcon-sinfondo.png';
import { DonationButton } from './DonationButton';

interface HeaderProps {
  onReset?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="sticky top-0 z-20 flex-shrink-0 border-b backdrop-blur-md bg-gray-900/80 border-gray-700/50">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center h-12">
          <button
            onClick={onReset}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer"
            title="Volver al inicio"
          >
            <img src={newIcon} alt="FileHarvest" className="w-10 h-10" />
            <h1 className="text-lg font-bold text-white">FileHarvest</h1>
          </button>
          <DonationButton />
        </div>
      </div>
    </header>
  );
};
