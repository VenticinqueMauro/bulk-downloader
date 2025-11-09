import React, { useState } from 'react';

export const DonationButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handlePayPalClick = () => {
    window.open('https://www.paypal.com/ncp/payment/6BYQBEU5X5B2A', '_blank');
  };

  const handleBrubankCopy = () => {
    navigator.clipboard.writeText('mauro25qe');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-gray-800/50"
        aria-label="Support this project"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
        <span className="text-xs font-medium">Support</span>
      </button>

      {isOpen && (
        <div
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="absolute right-0 top-full pt-2 z-50"
        >
          <div className="w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-3">
            <div className="text-xs text-gray-400 mb-2 font-medium">Support FileHarvest</div>

          <button
            onClick={handlePayPalClick}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700 transition-colors text-left mb-1"
          >
            <span className="text-base">🌍</span>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">PayPal</div>
              <div className="text-xs text-gray-400">International</div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 text-gray-500"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </button>

          <button
            onClick={handleBrubankCopy}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700 transition-colors text-left"
            title="Click to copy alias"
          >
            <span className="text-base">🇦🇷</span>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">Brubank</div>
              <div className="text-xs text-gray-400 font-mono">mauro25qe</div>
            </div>
            {isCopied ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-green-500"
              >
                <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 text-gray-500"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
            )}
          </button>

            <div className="mt-2 pt-2 border-t border-gray-700">
              <div className="text-xs text-gray-500 text-center">Thank you for your support!</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
