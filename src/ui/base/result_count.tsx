import React from "react";

interface ResultCountProps {
  total: number;
  page: number;
  perPage: number;
  className?: string;
}

const ResultCount: React.FC<ResultCountProps> = ({ total, page, perPage, className = "" }) => {
  const totalPages = Math.ceil(total / perPage);
  return (
    <div className={`w-full flex justify-center items-center py-2 text-sm text-gray-700 ${className}`}>
      Showing page {page} of {totalPages} ({total} results)
    </div>
  );
};

export default ResultCount; 