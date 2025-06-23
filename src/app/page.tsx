"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateSearchTerm, fetchAutocompleteSuggestionsThunk } from "@/lib/features/breweries/autocompleteThunks";
import { fetchSearchResultsThunk, selectResultEntitiesBySearchKeyFromRoot, selectSearchTotalFromRoot } from "@/lib/features/breweries/searchResultsThunks";
import { selectSearch } from "@/lib/features/breweries/brewerySearchSlice";
import { selectSuggestions } from "@/lib/features/breweries/breweryAutocompleteSlice";
import type { BreweryResult } from "@/services/open_brewery_db";
import { useRouter } from "next/navigation";
import { HomePage } from "@/ui/pages/home/home";
import { Header } from "@/ui/base/header/header";
import type { SuggestionItem } from "@/lib/features/breweries/breweryAutocompleteSlice";

const MIN_SEARCH_CHARACTERS = 3;

export default function HomeContainer() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const search = useAppSelector(selectSearch);
  const suggestionsMap = useAppSelector(selectSuggestions);
  const [searchStatus, setSearchStatus] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filterNameInput, setFilterNameInput] = useState("");
  const [filterCityInput, setFilterCityInput] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [sort, setSort] = useState("");
  const [perPage, setPerPage] = useState(15);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Get suggestions for the current search term as objects with id and name
  const suggestions: SuggestionItem[] = suggestionsMap[search] || [];

  // Get results for the current search term, page, filters, sort, and per_page
  const results: BreweryResult[] = useAppSelector(state =>
    selectResultEntitiesBySearchKeyFromRoot(state, {
      search,
      page,
      by_name: filterName,
      by_city: filterCity,
      sort,
      per_page: perPage,
    })
  );

  // Get total count for pagination
  const totalCount = useAppSelector(state =>
    selectSearchTotalFromRoot(state, {
      search,
      by_name: filterName,
      by_city: filterCity,
      sort,
      per_page: perPage,
    })
  );

  // Use results directly since they're already paginated by the server
  const paginatedResults = results;
  
  // Calculate total pages: if we have total count, use it; otherwise, check if we got a full page
  const totalFilteredPages = totalCount > 0 
    ? Math.ceil(totalCount / perPage)
    : (results.length === perPage ? page + 1 : page); // If we got a full page, assume there might be more

  // Store last used filters to compare for Go button
  const lastFilters = useRef({ name: filterName, city: filterCity });

  // Update handleNextPage and handlePrevPage to trigger search with filters and sort
  const handleNextPage = () => {
    if (page < totalFilteredPages) {
      setPage(page + 1);
      setSearchLoading(true);
      dispatch(fetchSearchResultsThunk({ search, page: page + 1, by_name: filterName, by_city: filterCity, sort, per_page: perPage })).finally(() => setSearchLoading(false));
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      setSearchLoading(true);
      dispatch(fetchSearchResultsThunk({ search, page: page - 1, by_name: filterName, by_city: filterCity, sort, per_page: perPage })).finally(() => setSearchLoading(false));
    }
  };

  // Update FilterPanel Go handler to set active filters and trigger search
  const handleFilterGo = () => {
    // Only trigger search and close drawer if filters changed
    if (filterNameInput !== filterName || filterCityInput !== filterCity) {
      setFilterName(filterNameInput);
      setFilterCity(filterCityInput);
      setPage(1);
      setSearchLoading(true);
      dispatch(fetchSearchResultsThunk({ search, page: 1, by_name: filterNameInput, by_city: filterCityInput, sort, per_page: perPage })).finally(() => setSearchLoading(false));
      lastFilters.current = { name: filterNameInput, city: filterCityInput };
      setIsFilterDrawerOpen(false);
    }
  };

  // Handle sort change
  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setPage(1);
    setSearchLoading(true);
    dispatch(fetchSearchResultsThunk({ search, page: 1, by_name: filterName, by_city: filterCity, sort: newSort, per_page: perPage })).finally(() => setSearchLoading(false));
  };

  // Handle perPage change
  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = parseInt(e.target.value, 10);
    setPerPage(newPerPage);
    setPage(1);
    setSearchLoading(true);
    dispatch(fetchSearchResultsThunk({ search, page: 1, by_name: filterName, by_city: filterCity, sort, per_page: newPerPage })).finally(() => setSearchLoading(false));
  };

  const handleSetSearch = (value: string) => {
    dispatch(updateSearchTerm(value));
    setPage(1); // Reset to first page on new search
    // Update search status based on input length
    if (!value || value.trim().length === 0) {
      setSearchStatus("");
    } else if (value.trim().length < MIN_SEARCH_CHARACTERS) {
      setSearchStatus(`Type ${MIN_SEARCH_CHARACTERS - value.trim().length} more character${MIN_SEARCH_CHARACTERS - value.trim().length === 1 ? '' : 's'} to search`);
    } else {
      setSearchStatus("");
      dispatch(fetchAutocompleteSuggestionsThunk(value));
    }
  };

  // Handle Enter key in the input
  const handleEnter = useCallback(() => {
    if (search && search.trim().length >= MIN_SEARCH_CHARACTERS) {
      setSearchLoading(true);
      setPage(1);
      dispatch(fetchSearchResultsThunk({ search, page: 1, by_name: filterName, by_city: filterCity, per_page: perPage })).finally(() => setSearchLoading(false));
    }
  }, [dispatch, search, filterName, filterCity, perPage]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback(async (suggestion: SuggestionItem) => {
    const breweryId = suggestion.id;
    
    // For now, just use the name as the search term and let the details page handle the lookup
    // This is simpler and more reliable than trying to find the exact brewery ID
    router.push(`/brewery?id=${encodeURIComponent(breweryId)}`);
  }, [router]);

  // Handle brewery click from results table
  const handleBreweryClick = useCallback((brewery: BreweryResult) => {
    router.push(`/brewery?id=${encodeURIComponent(brewery.id)}`);
  }, [router]);

  // Optionally, fetch suggestions if search term is already populated (e.g., on reload)
  useEffect(() => {
    if (!!search && search.trim().length >= MIN_SEARCH_CHARACTERS && !suggestionsMap[search]) {
      dispatch(fetchAutocompleteSuggestionsThunk(search));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <>
      <Header title="Open Brewery DB" showBackButton={false} />
      <HomePage
        search={search}
        suggestions={suggestions}
        paginatedResults={paginatedResults}
        totalCount={totalCount}
        page={page}
        perPage={perPage}
        totalFilteredPages={totalFilteredPages}
        searchLoading={searchLoading}
        searchStatus={searchStatus}
        filterNameInput={filterNameInput}
        filterCityInput={filterCityInput}
        isFilterDrawerOpen={isFilterDrawerOpen}
        sort={sort}
        onSearchChange={handleSetSearch}
        onEnter={handleEnter}
        onSuggestionClick={handleSuggestionClick}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        onFilterGo={handleFilterGo}
        onSortChange={handleSortChange}
        onPerPageChange={handlePerPageChange}
        onFilterNameInputChange={setFilterNameInput}
        onFilterCityInputChange={setFilterCityInput}
        onFilterDrawerOpen={() => setIsFilterDrawerOpen(true)}
        onFilterDrawerClose={() => setIsFilterDrawerOpen(false)}
        onBreweryClick={handleBreweryClick}
      />
    </>
  );
}
