"use client";

import { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { FlyoutMenu } from "@/ui/base/flyout_menu/flyout_menu";
import { TextInput } from "@/ui/base/text_input/text_input";
import { testApiConnection } from "@/services/open_brewery_db";
import { updateSearchTerm, fetchAutocompleteSuggestionsThunk } from "@/lib/features/breweries/autocompleteThunks";
import { fetchSearchResultsThunk } from "@/lib/features/breweries/searchResultsThunks";
import { selectSearch } from "@/lib/features/breweries/brewerySearchSlice";
import { selectSuggestions } from "@/lib/features/breweries/breweryAutocompleteSlice";
import { selectPages, selectEntities } from "@/lib/features/breweries/searchResultsThunks";
import type { BreweryResult } from "@/services/open_brewery_db";
import { useRouter } from "next/navigation";
import type { SuggestionItem } from "@/ui/base/text_input/text_input";

export const HomePage = ({ Header = null, Footer = null }: { Header?: React.ReactNode, Footer?: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const search = useAppSelector(selectSearch);
  const suggestionsMap = useAppSelector(selectSuggestions);
  const pagesMap = useAppSelector(selectPages);
  const entitiesMap = useAppSelector(selectEntities) as Record<string, BreweryResult>;
  const [apiStatus, setApiStatus] = useState<string>("Testing...");
  const [searchStatus, setSearchStatus] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const PAGE_SIZE = 20; // Open Brewery DB default

  // Get suggestions for the current search term as objects with id and name
  const suggestions: SuggestionItem[] = (suggestionsMap[search]?.length ? suggestionsMap[search] : []).map((name: string) => {
    // Try to find the id from the autocomplete results in the Redux state (if available)
    // Fallback to name as id if not available
    const found = Object.values(entitiesMap).find(b => b.name === name);
    return { id: found?.id || name, name };
  });
  // Get results for the current search term and page
  const normalizedSearch = search.trim().toLowerCase();
  const pageIds: string[] = Array.isArray(pagesMap[normalizedSearch]?.[page]) ? pagesMap[normalizedSearch][page] : [];
  const results: BreweryResult[] = pageIds.map((id: string) => entitiesMap[id]).filter((b): b is BreweryResult => Boolean(b));

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
      dispatch(fetchSearchResultsThunk({ search, page: 1 }));
      setPage(1);
    }
  }, [dispatch, search]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: SuggestionItem) => {
    // Navigate to the brewery details page using query param
    router.push(`/brewery?id=${encodeURIComponent(suggestion.id)}`);
  }, [router]);

  // Pagination controls
  const handleNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    dispatch(fetchSearchResultsThunk({ search, page: nextPage }));
  };
  const handlePrevPage = () => {
    if (page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
      dispatch(fetchSearchResultsThunk({ search, page: prevPage }));
    }
  };

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
    <div className="flex flex-col gap-4">
      {Header}
      <div className="text-sm text-gray-600">{apiStatus}</div>
      <TextInput
        placeholder="Search breweries (min 3 characters)"
        value={search}
        onChange={handleSetSearch}
        suggestions={suggestions}
        onEnter={handleEnter}
        onSuggestionClick={handleSuggestionClick}
      />
      {searchStatus && (
        <div className="text-sm text-blue-600">{searchStatus}</div>
      )}
      <FlyoutMenu buttonLabel="Filter" menuItems={[{ label: "Filter 1", onClick: () => {} }, { label: "Filter 2", onClick: () => {} }]} />
      {/* Results Table */}
      {results.length > 0 && (
        <>
          <table className="min-w-full border mt-4">
            <thead>
              <tr>
                <th className="border px-2 py-1">Brewery Name</th>
                <th className="border px-2 py-1">Type</th>
                <th className="border px-2 py-1">City</th>
                <th className="border px-2 py-1">Country</th>
                <th className="border px-2 py-1">Website</th>
                <th className="border px-2 py-1">Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {results.map((brewery) => (
                <tr key={brewery.id}>
                  <td className="border px-2 py-1">{brewery.name}</td>
                  <td className="border px-2 py-1">{brewery.brewery_type}</td>
                  <td className="border px-2 py-1">{brewery.city}</td>
                  <td className="border px-2 py-1">{brewery.country}</td>
                  <td className="border px-2 py-1">
                    {brewery.website_url ? (
                      <a href={brewery.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        {brewery.website_url}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="border px-2 py-1">{brewery.phone || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex gap-2 mt-2">
            <button onClick={handlePrevPage} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
            <span>Page {page}</span>
            <button onClick={handleNextPage} className="px-3 py-1 border rounded" disabled={results.length < PAGE_SIZE}>Next</button>
          </div>
        </>
      )}
      {Footer}
    </div>
  );
}





