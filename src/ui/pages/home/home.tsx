"use client";

import React from "react";
import { TextInput, SuggestionItem } from "@/ui/base/text_input/text_input";
import FilterDrawer from "@/ui/base/filter_drawer/filter_drawer";
import FilterPanel from "@/ui/base/filter_panel/filter_panel";
import SortPanel from "@/ui/base/sort_panel/sort_panel";
import Pagination from "@/ui/base/pagination/pagination";
import ResultCount from "@/ui/base/result_count/result_count";
import { ResultsTable } from "@/ui/brewery_results_table/brewery_results_table";
import styles from "./home.module.css";
import type { BreweryResult } from "@/services/open_brewery_db";

export interface HomePageProps {
  search: string;
  suggestions: SuggestionItem[];
  paginatedResults: BreweryResult[];
  totalCount: number;
  page: number;
  perPage: number;
  totalFilteredPages: number;
  searchLoading: boolean;
  searchStatus: string;
  filterNameInput: string;
  filterCityInput: string;
  isFilterDrawerOpen: boolean;
  sort: string;
  onSearchChange: (value: string) => void;
  onEnter: () => void;
  onSuggestionClick: (suggestion: SuggestionItem) => void;
  onBreweryClick: (brewery: BreweryResult) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  onFilterGo: () => void;
  onSortChange: (sort: string) => void;
  onPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onFilterNameInputChange: (value: string) => void;
  onFilterCityInputChange: (value: string) => void;
  onFilterDrawerOpen: () => void;
  onFilterDrawerClose: () => void;
  Header?: React.ReactNode;
  Footer?: React.ReactNode;
}

export const HomePage: React.FC<HomePageProps> = ({
  search,
  suggestions,
  paginatedResults,
  totalCount,
  page,
  perPage,
  totalFilteredPages,
  searchLoading,
  searchStatus,
  filterNameInput,
  filterCityInput,
  isFilterDrawerOpen,
  sort,
  onSearchChange,
  onEnter,
  onSuggestionClick,
  onBreweryClick,
  onNextPage,
  onPrevPage,
  onFilterGo,
  onSortChange,
  onPerPageChange,
  onFilterNameInputChange,
  onFilterCityInputChange,
  onFilterDrawerOpen,
  onFilterDrawerClose,
  Header = null,
  Footer = null,
}) => {
  return (
    <div className={styles.container}>
      {Header}
      {/* Filter Drawer below search box, handle and drawer attached to search input */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onOpen={onFilterDrawerOpen}
        onClose={onFilterDrawerClose}
        drawerContent={
          <FilterPanel
            name={filterNameInput}
            city={filterCityInput}
            onNameChange={onFilterNameInputChange}
            onCityChange={onFilterCityInputChange}
            onGo={onFilterGo}
          />
        }
      >
        <TextInput
          placeholder="Search breweries (min 3 characters)"
          value={search}
          onChange={onSearchChange}
          suggestions={suggestions}
          onEnter={onEnter}
          onSuggestionClick={onSuggestionClick}
        />
      </FilterDrawer>
      {searchStatus && (
        <div className={styles.searchStatus}>{searchStatus}</div>
      )}
      {/* Results Table - Show when we have results OR when loading */}
      {(paginatedResults.length > 0 || searchLoading) && (
        <ResultsTable
          results={paginatedResults}
          loading={searchLoading}
          perPage={perPage}
          onBreweryClick={onBreweryClick}
          PaginationComponent={Pagination}
          SortComponent={SortPanel}
          ResultCountComponent={ResultCount}
          paginationProps={{
            currentPage: page,
            onNext: onNextPage,
            onPrev: onPrevPage,
            isNextDisabled: page >= totalFilteredPages || searchLoading,
            isPrevDisabled: page === 1 || searchLoading,
            totalPages: totalFilteredPages,
            onPerPageChange: onPerPageChange,
            disabled: searchLoading,
          }}
          sortProps={{
            sort: sort,
            onSortChange: onSortChange,
          }}
          resultCountProps={{
            total: totalCount,
            page: page,
          }}
        />
      )}
      {Footer}
    </div>
  );
};





