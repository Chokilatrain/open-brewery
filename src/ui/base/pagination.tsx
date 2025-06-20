import React from "react";

interface PaginationProps {
  currentPage: number;
  onNext: () => void;
  onPrev: () => void;
  isNextDisabled?: boolean;
  isPrevDisabled?: boolean;
  totalPages?: number;
  className?: string;
}

const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
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
}) => (
  <div className={`flex flex-col items-center w-full ${className}`}>
    <div className="flex flex-row gap-2 items-center justify-center w-full">
      <button
        onClick={onPrev}
        disabled={isPrevDisabled}
        className="px-3 py-1 border rounded disabled:opacity-50 flex items-center justify-center"
        aria-label="Previous page"
      >
        <ChevronLeft />
      </button>
      <span>
        Page {currentPage}
        {typeof totalPages === "number" ? ` of ${totalPages}` : ""}
      </span>
      <button
        onClick={onNext}
        disabled={isNextDisabled}
        className="px-3 py-1 border rounded disabled:opacity-50 flex items-center justify-center"
        aria-label="Next page"
      >
        <ChevronRight />
      </button>
    </div>
  </div>
);

export default Pagination; 