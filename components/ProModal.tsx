
import React from 'react';
import { StarIcon, CheckCircleIcon, XMarkIcon } from './icons';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const proFeatures = [
    "1-Click Batch Download",
    "Advanced Regex & Size Filters",
    "Download from Multiple Tabs",
    "Download from Pasted URL List",
    "Save to Custom Subfolders",
    "Automatic Retry on Failure"
];

export const ProModal: React.FC<ProModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-md m-4 transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-400/10 rounded-full">
                         <StarIcon className="h-8 w-8 text-amber-400"/>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Unlock Pro Features</h2>
                        <p className="text-gray-400">Supercharge your downloads.</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-700 hover:text-white transition-colors">
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </div>
          
            <div className="my-6 space-y-3">
                {proFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <CheckCircleIcon className="h-6 w-6 text-sky-400 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                    </div>
                ))}
            </div>

            <button
                onClick={onUpgrade}
                className="w-full py-3 px-6 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
                Simulate Upgrade to Pro
            </button>
             <p className="text-center text-xs text-gray-500 mt-3">This is a simulation. In a real app, this would integrate with a payment provider.</p>
        </div>
      </div>
    </div>
  );
};
