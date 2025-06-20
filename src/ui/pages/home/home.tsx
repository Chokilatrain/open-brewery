"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { TextInput } from "@/ui/base/text_input/text_input";
import { testApiConnection } from "@/services/open_brewery_db";
import { updateSearchTerm, fetchAutocompleteSuggestionsThunk } from "@/lib/features/breweries/autocompleteThunks";
import { fetchSearchResultsThunk } from "@/lib/features/breweries/searchResultsThunks";
import { selectSearch } from "@/lib/features/breweries/brewerySearchSlice";
import { selectSuggestions } from "@/lib/features/breweries/breweryAutocompleteSlice";
import { selectEntities, selectResultEntitiesBySearchKeyFromRoot } from "@/lib/features/breweries/searchResultsThunks";
import type { BreweryResult } from "@/services/open_brewery_db";
import { useRouter } from "next/navigation";
import type { SuggestionItem } from "@/ui/base/text_input/text_input";
import Pagination from "@/ui/base/pagination";
import FilterPanel from "@/ui/base/filter_panel";
import SortPanel from "@/ui/base/sort_panel";
import ResultCount from "@/ui/base/result_count";
import FilterDrawer from "@/ui/base/filter_drawer";

export const HomePage = ({ Header = null, Footer = null }: { Header?: React.ReactNode, Footer?: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const search = useAppSelector(selectSearch);
  const suggestionsMap = useAppSelector(selectSuggestions);
  const entitiesMap = useAppSelector(selectEntities) as Record<string, BreweryResult>;
  const [apiStatus, setApiStatus] = useState<string>("Testing...");
  const [searchStatus, setSearchStatus] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filterNameInput, setFilterNameInput] = useState("");
  const [filterCityInput, setFilterCityInput] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [sort, setSort] = useState("");
  const [perPage, setPerPage] = useState(3);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const PAGE_SIZE = 20; // Open Brewery DB default

  // Get suggestions for the current search term as objects with id and name
  const suggestions: SuggestionItem[] = (suggestionsMap[search]?.length ? suggestionsMap[search] : []).map((name: string) => {
    // Try to find the id from the autocomplete results in the Redux state (if available)
    // Fallback to name as id if not available
    console.log("name", name);
    console.log("entitiesMap", entitiesMap);
    const found = Object.values(entitiesMap).find(b => b.name === name);
    console.log("found", found);
    return { id: found?.id || name, name };
  });
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

  // Pagination for Redux results
  const paginatedResults = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalFilteredPages = Math.ceil(results.length / PAGE_SIZE);

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
    } else if (value.trim().length < 3) {
      setSearchStatus(`Type ${3 - value.trim().length} more character${3 - value.trim().length === 1 ? '' : 's'} to search`);
    } else {
      setSearchStatus("");
      dispatch(fetchAutocompleteSuggestionsThunk(value));
    }
  };

  // Handle Enter key in the input
  const handleEnter = useCallback(() => {
    if (search && search.trim().length >= 3) {
      setSearchLoading(true);
      setPage(1);
      dispatch(fetchSearchResultsThunk({ search, page: 1, by_name: filterName, by_city: filterCity })).finally(() => setSearchLoading(false));
    }
  }, [dispatch, search, filterName, filterCity]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback(async (suggestion: SuggestionItem) => {
    let breweryId = suggestion.id;
    console.log("suggestion", suggestion);
    console.log("breweryId", breweryId);
    console.log("entitiesMap", entitiesMap);
    console.log("entitiesMap[breweryId]", entitiesMap[breweryId]);
    // If the id is not a valid UUID (or is just the name), fetch the full brewery object by name
    if (!entitiesMap[breweryId] || breweryId === suggestion.name) {
      // Try to fetch the brewery by name using the search API
      const results = await fetchSearchResultsThunk({ search: suggestion.name, page: 1 })(dispatch, () => ({ brewerySearchResults: { pages: {}, entities: entitiesMap } }), undefined);
      const found = Array.isArray(results) ? (results as BreweryResult[]).find((b) => b.name === suggestion.name) : null;
      if (found && found.id) {
        breweryId = found.id;
      }
    }
    router.push(`/brewery?id=${encodeURIComponent(breweryId)}`);
  }, [router, entitiesMap, dispatch]);

  // Test API connection on component mount
  useEffect(() => {
    testApiConnection().then((isAccessible) => {
      setApiStatus(isAccessible ? "✅ API Connected" : "❌ API Not Accessible");
    });
  }, []);

  // Optionally, fetch suggestions if search term is already populated (e.g., on reload)
  useEffect(() => {
    if (!!search && search.trim().length >= 3 && !suggestionsMap[search]) {
      dispatch(fetchAutocompleteSuggestionsThunk(search));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="flex flex-col gap-4 w-full max-w-screen-lg mx-auto px-2 sm:px-6 md:px-8 bg-gray-900 text-white border border-gray-700 rounded shadow min-h-screen">
      {Header}
      <div className="text-sm text-gray-400">{apiStatus}</div>
      {/* Filter Drawer below search box, handle and drawer attached to search input */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onOpen={() => setIsFilterDrawerOpen(true)}
        onClose={() => setIsFilterDrawerOpen(false)}
        drawerContent={
          <FilterPanel
            name={filterNameInput}
            city={filterCityInput}
            onNameChange={setFilterNameInput}
            onCityChange={setFilterCityInput}
            onGo={handleFilterGo}
          />
        }
      >
        <TextInput
          placeholder="Search breweries (min 3 characters)"
          value={search}
          onChange={handleSetSearch}
          suggestions={suggestions}
          onEnter={handleEnter}
          onSuggestionClick={handleSuggestionClick}
        />
      </FilterDrawer>
      {searchStatus && (
        <div className="text-sm text-blue-600">{searchStatus}</div>
      )}
      {/* Results Table */}
      {paginatedResults.length > 0 && !searchLoading && (
        <>
          <div className="overflow-x-auto w-full">
            <table className="min-w-full border border-gray-700 mt-4 bg-gray-900 text-white">
              <thead className="bg-gray-800 text-blue-200">
                <tr>
                  <th className="border border-gray-700 px-2 py-1">Brewery Name</th>
                  <th className="border border-gray-700 px-2 py-1">Type</th>
                  <th className="border border-gray-700 px-2 py-1">City</th>
                  <th className="border border-gray-700 px-2 py-1">Country</th>
                  <th className="border border-gray-700 px-2 py-1">Website</th>
                  <th className="border border-gray-700 px-2 py-1">Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {paginatedResults.map((brewery, i) => (
                  <tr key={brewery.id} className={i % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}>
                    <td className="border border-gray-700 px-2 py-1">{brewery.name}</td>
                    <td className="border border-gray-700 px-2 py-1">{brewery.brewery_type}</td>
                    <td className="border border-gray-700 px-2 py-1">{brewery.city}</td>
                    <td className="border border-gray-700 px-2 py-1">{brewery.country}</td>
                    <td className="border border-gray-700 px-2 py-1">
                      {brewery.website_url ? (
                        <a href={brewery.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">
                          {brewery.website_url}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="border border-gray-700 px-2 py-1">{brewery.phone || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <SortPanel sort={sort} onSortChange={handleSortChange} />
          <Pagination
            currentPage={page}
            onNext={handleNextPage}
            onPrev={handlePrevPage}
            isNextDisabled={page >= totalFilteredPages}
            isPrevDisabled={page === 1}
            totalPages={totalFilteredPages}
          />
          <div className="flex items-center gap-2 my-4 justify-center">
            <label className="font-semibold">Results per page:</label>
            <select value={perPage} onChange={handlePerPageChange} className="border-2 border-gray-300 rounded-md p-2 w-20">
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
          <ResultCount total={results.length} page={page} perPage={perPage} />
        </>
      )}
      {Footer}
    </div>
  );
}





