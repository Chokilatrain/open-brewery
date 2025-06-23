"use client";

import React from "react";
import { WebsiteIcon } from "@/ui/base/website_icon/website_icon";
import styles from "./brewery_results_table.module.css";
import type { BreweryResult } from "@/services/open_brewery_db";

export interface ResultsTableProps {
  results: BreweryResult[];
  loading: boolean;
  perPage: number;
  onBreweryClick: (brewery: BreweryResult) => void;
  PaginationComponent: React.ComponentType<{
    currentPage: number;
    onNext: () => void;
    onPrev: () => void;
    isNextDisabled: boolean;
    isPrevDisabled: boolean;
    totalPages: number;
    perPage: number;
    onPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    showPerPageSelector: boolean;
    disabled: boolean;
  }>;
  SortComponent: React.ComponentType<{
    sort: string;
    onSortChange: (sort: string) => void;
    disabled: boolean;
  }>;
  ResultCountComponent: React.ComponentType<{
    total: number;
    page: number;
    perPage: number;
  }>;
  paginationProps: {
    currentPage: number;
    onNext: () => void;
    onPrev: () => void;
    isNextDisabled: boolean;
    isPrevDisabled: boolean;
    totalPages: number;
    onPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled: boolean;
  };
  sortProps: {
    sort: string;
    onSortChange: (sort: string) => void;
  };
  resultCountProps: {
    total: number;
    page: number;
  };
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  results,
  loading,
  perPage,
  onBreweryClick,
  PaginationComponent,
  SortComponent,
  ResultCountComponent,
  paginationProps,
  sortProps,
  resultCountProps,
}) => {
  return (
    <>
      <div className={styles.tableWrapper}>
        <div className={styles.sortPanelContainer}>
          <SortComponent 
            sort={sortProps.sort} 
            onSortChange={sortProps.onSortChange} 
            disabled={loading} 
          />
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th className={styles.tableHeader}>Brewery Name</th>
                <th className={styles.tableHeader}>Type</th>
                <th className={styles.tableHeader}>City</th>
                <th className={styles.tableHeader}>Country</th>
                <th className={styles.tableHeader}>Website</th>
                <th className={styles.tableHeader}>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Show loading skeleton rows
                Array.from({ length: perPage }).map((_, i) => (
                  <tr key={`loading-${i}`} className={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                    <td className={styles.tableCell}>
                      <div className={styles.loadingSkeleton}></div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.loadingSkeleton}></div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.loadingSkeleton}></div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.loadingSkeleton}></div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.loadingSkeleton}></div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.loadingSkeleton}></div>
                    </td>
                  </tr>
                ))
              ) : (
                // Show actual data rows
                results.map((brewery, i) => (
                  <tr key={brewery.id} className={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                    <td className={styles.tableCell}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onBreweryClick(brewery);
                        }}
                        className={styles.breweryNameLink}
                      >
                        {brewery.name}
                      </a>
                    </td>
                    <td className={styles.tableCell}>{brewery.brewery_type}</td>
                    <td className={styles.tableCell}>{brewery.city}</td>
                    <td className={styles.tableCell}>{brewery.country}</td>
                    <td className={styles.tableCell}>
                      {brewery.website_url ? (
                        <WebsiteIcon url={brewery.website_url} />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className={styles.tableCell}>{brewery.phone || "N/A"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <PaginationComponent
        {...paginationProps}
        perPage={perPage}
        onPerPageChange={paginationProps.onPerPageChange}
        showPerPageSelector={true}
      />
      <ResultCountComponent
        {...resultCountProps}
        perPage={perPage}
      />
    </>
  );
}; 