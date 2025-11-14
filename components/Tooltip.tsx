import React, { useState, useEffect } from 'react';

interface TooltipProps {
  id: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  showOnce?: boolean; // Only show once, then save to storage
}

export const Tooltip: React.FC<TooltipProps> = ({
  id,
  content,
  position = 'top',
  children,
  showOnce = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    if (showOnce) {
      chrome.storage.sync.get([`tooltip_${id}_shown`], (result) => {
        if (result[`tooltip_${id}_shown`]) {
          setShouldShow(false);
        }
      });
    }
  }, [id, showOnce]);

  const handleMouseEnter = () => {
    if (shouldShow) {
      setIsVisible(true);
      if (showOnce && !hasBeenShown) {
        setHasBeenShown(true);
        chrome.storage.sync.set({ [`tooltip_${id}_shown`]: true });
      }
    }
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-700',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-700',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-700',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-700',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && shouldShow && (
        <div
          className={`absolute z-50 ${positionClasses[position]} animate-in fade-in zoom-in-95 duration-200`}
        >
          <div className="bg-gray-800 text-white text-xs rounded-lg px-4 py-2.5 w-96 shadow-xl border border-gray-600 whitespace-normal">
            <p className="leading-snug text-gray-200">{content}</p>
            <div
              className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[position]}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for info icon with tooltip
export const InfoTooltip: React.FC<{ content: string; id: string }> = ({ content, id }) => {
  return (
    <Tooltip id={id} content={content} position="top">
      <button
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-300 transition-colors text-xs"
        tabIndex={-1}
      >
        ?
      </button>
    </Tooltip>
  );
};
