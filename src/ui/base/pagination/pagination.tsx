import React from "react";
import styles from './pagination.module.css';

const PER_PAGE_OPTIONS = [5, 10, 15, 20];

interface PaginationProps {
  currentPage: number;
  onNext: () => void;
  onPrev: () => void;
  isNextDisabled?: boolean;
  isPrevDisabled?: boolean;
  totalPages?: number;
  className?: string;
  // Per page controls
  perPage?: number;
  onPerPageChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  showPerPageSelector?: boolean;
  disabled?: boolean;
}

const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={styles.icon}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={styles.icon}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  onNext,
  onPrev,
  isNextDisabled = false,
  isPrevDisabled = false,
  totalPages,
  className = "",
  perPage,
  onPerPageChange,
  showPerPageSelector = false,
  disabled = false,
}) => (
  <div className={`${styles.container} ${className}`}>
    <div className={styles.buttonContainer}>
      <button
        onClick={onPrev}
        disabled={isPrevDisabled}
        className={styles.button}
        aria-label="Previous page"
      >
        <ChevronLeft />
      </button>
      <span className={styles.pageInfo}>
        Page {currentPage}
        {typeof totalPages === "number" ? ` of ${totalPages}` : ""}
      </span>
      <button
        onClick={onNext}
        disabled={isNextDisabled}
        className={styles.button}
        aria-label="Next page"
      >
        <ChevronRight />
      </button>
    </div>
    {showPerPageSelector && perPage !== undefined && onPerPageChange && (
      <div className={styles.perPageContainer}>
        <label className={styles.perPageLabel}>Results per page:</label>
        <select value={perPage} onChange={onPerPageChange} className={styles.perPageSelect} disabled={disabled}>
          {PER_PAGE_OPTIONS.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    )}
  </div>
);

export default Pagination; 