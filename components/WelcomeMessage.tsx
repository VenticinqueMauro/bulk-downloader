import React from 'react';

export const WelcomeMessage: React.FC = () => {
  return (
    <div className="flex overflow-y-auto flex-col flex-1 justify-center items-center py-4">
      <div className="space-y-3 w-full max-w-2xl">
        {/* Free Badge */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
            <span className="text-lg">🎉</span>
            <span className="text-sm font-semibold text-emerald-400">100% Free</span>
          </div>
        </div>

        {/* Main Info Card */}
        <div className="p-4 space-y-2.5 rounded-xl border bg-gray-800/50 border-gray-700/50">
          <div className="mb-2 text-center">
            <h3 className="text-base font-bold text-gray-200 mb-1">
              Start scanning to find downloadable files
            </h3>
            <p className="text-xs text-gray-400">
              Enter any URL above and click "Scan Page" to get started
            </p>
          </div>

          {/* Features */}
          <div className="space-y-2 text-sm">
            <div className="flex gap-3 items-start">
              <span className="flex-shrink-0 text-lg">⚡</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-300">Fast Standard Scan</div>
                <div className="text-xs text-gray-500 break-words">Detect images, videos, documents and more</div>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <span className="flex-shrink-0 text-lg">🤖</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-300">AI Deep Scan</div>
                <div className="text-xs text-gray-500 break-words">
                  Requires your <a href="#" onClick={(e) => { e.preventDefault(); chrome.runtime.openOptionsPage(); }} className="text-purple-400 underline hover:text-purple-300">Gemini API key</a> (free tier available)
                </div>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <span className="flex-shrink-0 text-lg">🎯</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-300">Smart Filtering</div>
                <div className="text-xs text-gray-500 break-words">Filter by type, size, and custom preferences</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            No ads, no tracking, no subscriptions
          </p>
        </div>
      </div>
    </div>
  );
};
