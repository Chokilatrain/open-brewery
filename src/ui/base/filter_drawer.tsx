import React, { useRef, useLayoutEffect, useState, useEffect } from "react";

interface FilterDrawerProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  drawerContent: React.ReactNode;
}

const TAB_TRANSITION_MS = 300;
const HEIGHT_TRANSITION_MS = 300;

const FilterDrawer: React.FC<FilterDrawerProps> = ({ isOpen, onOpen, onClose, children, className = "", drawerContent }) => {
  // Toggle handler for the Filters button
  const handleToggle = () => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };

  // For smooth height transition
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<string | number>(0);
  const [showContent, setShowContent] = useState(false);
  const [shouldShowContent, setShouldShowContent] = useState(false);

  // Opening: tab transition, then content. Closing: content transition, then tab.
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isOpen) {
      // Opening: wait for tab, then show content
      timeout = setTimeout(() => setShowContent(true), TAB_TRANSITION_MS);
      setShouldShowContent(true);
    } else {
      // Closing: hide content after transition, then show tab
      setShowContent(false);
      timeout = setTimeout(() => setShouldShowContent(false), TAB_TRANSITION_MS + HEIGHT_TRANSITION_MS);
    }
    return () => clearTimeout(timeout);
  }, [isOpen]);

  // Animate height: 0 -> scrollHeight -> auto (open), auto/scrollHeight -> 0 (close)
  useLayoutEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showContent && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
      // After transition, set to 'auto' for flexible content
      timeout = setTimeout(() => setHeight('auto'), HEIGHT_TRANSITION_MS);
    } else {
      // When closing, set to scrollHeight first, then to 0 to animate
      if (contentRef.current) {
        setHeight(contentRef.current.scrollHeight);
        timeout = setTimeout(() => setHeight(0), 10); // allow DOM to update
      } else {
        setHeight(0);
      }
    }
    return () => clearTimeout(timeout);
  }, [showContent, drawerContent]);

  return (
    <div className={`relative w-full ${className}`}> {/* relative for absolute positioning */}
      {/* Main content (e.g., search input) */}
      <div className="flex flex-col items-center w-full">
        <div className="w-full max-w-screen-lg">{children}</div>
        {/* Drawer handle attached to bottom of children, same width as input */}
        <button
          onClick={handleToggle}
          className={`bg-gray-800 text-white rounded-b-lg shadow hover:bg-gray-700 transition-all duration-300 z-20 relative w-full max-w-screen-lg
            ${isOpen ? 'opacity-0 pointer-events-none h-0 min-h-0 py-0 m-0 overflow-hidden border-0 border-none !border-0' : 'opacity-100 pointer-events-auto py-1 min-h-[2.5rem] border-t-2 border-gray-700'}
          `}
          style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTopWidth: isOpen ? 0 : undefined, borderWidth: isOpen ? 0 : undefined }}
        >
          Filters
        </button>
        {/* Inline Drawer (pushes content down) */}
        {shouldShowContent && (
          <div
            className={`w-full flex justify-center transition-all duration-300 ${showContent ? 'opacity-100' : 'opacity-0 pointer-events-none'} overflow-hidden`}
            style={{
              willChange: 'height, opacity',
              height: height,
              transition: `height ${HEIGHT_TRANSITION_MS}ms cubic-bezier(0.4,0,0.2,1), opacity 0.3s cubic-bezier(0.4,0,0.2,1)`,
              marginTop: isOpen ? '0' : undefined,
            }}
          >
            <div ref={contentRef} className="bg-gray-900 text-white border-l border-r border-b border-gray-700 rounded-b-lg shadow-lg w-full max-w-screen-lg p-6 pb-8">
              <div className="flex justify-between items-center"><span className="font-bold text-lg">Filters</span><button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button></div>
              {drawerContent}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterDrawer; 