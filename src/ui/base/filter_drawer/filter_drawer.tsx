import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import styles from './filter_drawer.module.css';

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
    <div className={`${styles.container} ${className}`}>
      {/* Main content (e.g., search input) */}
      <div className={styles.contentWrapper}>
        <div className={styles.maxWidthContainer}>{children}</div>
        {/* Drawer handle attached to bottom of children, same width as input */}
        <button
          onClick={handleToggle}
          className={`${styles.toggleButton} ${isOpen ? styles.toggleButtonOpen : styles.toggleButtonClosed}`}
        >
          Filters
        </button>
        {/* Inline Drawer (pushes content down) */}
        {shouldShowContent && (
          <div
            className={`${styles.drawerContent} ${showContent ? styles.drawerContentOpen : styles.drawerContentClosed}`}
            style={{
              willChange: 'height, opacity',
              height: height,
              transition: `height ${HEIGHT_TRANSITION_MS}ms cubic-bezier(0.4,0,0.2,1), opacity 0.3s cubic-bezier(0.4,0,0.2,1)`,
              marginTop: isOpen ? '0' : undefined,
            }}
          >
            <div ref={contentRef} className={styles.drawerInner}>
              <div className={styles.header}>
                <span className={styles.title}>Filters</span>
                <button onClick={onClose} className={styles.closeButton}>&times;</button>
              </div>
              {drawerContent}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterDrawer; 