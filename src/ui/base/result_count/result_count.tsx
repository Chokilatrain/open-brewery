import React from "react";
import styles from './result_count.module.css';

interface ResultCountProps {
  total: number;
  page: number;
  perPage: number;
  className?: string;
}

const ResultCount: React.FC<ResultCountProps> = ({ total, page, perPage, className = "" }) => {
  const totalPages = Math.ceil(total / perPage);
  return (
    <div className={`${styles.container} ${className}`}>
      Showing page {page} of {totalPages} ({total} results)
    </div>
  );
};

export default ResultCount; 