
import React from 'react';
import newIcon from '../icons/newIcon-sinfondo.png';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-20 flex-shrink-0 border-b backdrop-blur-md bg-gray-900/80 border-gray-700/50">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center h-12">
          <div className="flex items-center gap-2.5">
            <img src={newIcon} alt="FileHarvest" className="w-10 h-10" />
            <h1 className="text-lg font-bold text-white">FileHarvest</h1>
          </div>
        </div>
      </div>
    </header>
  );
};
