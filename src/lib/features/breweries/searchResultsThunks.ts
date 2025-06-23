import { createAppSlice } from "@/lib/createAppSlice";
import type { BreweryResult } from "@/services/open_brewery_db";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSearchResults } from "@/services/open_brewery_db";
import type { RootState } from "@/lib/store";

export interface BrewerySearchResultsState {
  pages: { [searchKey: string]: string[] };
  entities: { [id: string]: BreweryResult };
  totalCounts: { [searchKey: string]: number };
  searchTotals: { [searchKey: string]: number }; // Total counts without page info
}

const initialState: BrewerySearchResultsState = {
  pages: {},
  entities: {},
  totalCounts: {},
  searchTotals: {},
};

// Helper to create a composite key for search results
function makeSearchKey({ search, page, by_name, by_city, sort, per_page }: { search: string; page: number; by_name?: string; by_city?: string; sort?: string; per_page?: number }) {
  return [
    search.trim().toLowerCase(),
    `page=${page}`,
    by_name ? `by_name=${by_name}` : '',
    by_city ? `by_city=${by_city}` : '',
    sort ? `sort=${sort}` : '',
    per_page ? `per_page=${per_page}` : ''
  ].filter(Boolean).join('|');
}

// Helper to create a search key without page for total count
function makeSearchKeyWithoutPage({ search, by_name, by_city, sort, per_page }: { search: string; by_name?: string; by_city?: string; sort?: string; per_page?: number }) {
  return [
    search.trim().toLowerCase() || 'empty',
    by_name ? `by_name=${by_name}` : '',
    by_city ? `by_city=${by_city}` : '',
    sort ? `sort=${sort}` : '',
    per_page ? `per_page=${per_page}` : ''
  ].filter(Boolean).join('|');
}

export const brewerySearchResultsSlice = createAppSlice({
  name: "brewerySearchResults",
  initialState,
  reducers: (create) => ({
    setResults: create.reducer(
      (
        state: BrewerySearchResultsState,
        action: PayloadAction<{ search: string; page: number; by_name?: string; by_city?: string; sort?: string; per_page?: number; results: BreweryResult[]; total?: number }>
      ) => {
        const searchKey = makeSearchKey(action.payload);
        const searchKeyWithoutPage = makeSearchKeyWithoutPage(action.payload);
        // Add/merge entities
        const newEntities = { ...state.entities };
        action.payload.results.forEach(brewery => {
          newEntities[brewery.id] = brewery;
        });
        // Store page as array of ids, keyed by composite searchKey
        const newState = {
          ...state,
          entities: newEntities,
          pages: {
            ...state.pages,
            [searchKey]: action.payload.results.map(b => b.id),
          },
        };
        
        // Store total count if provided
        if (action.payload.total !== undefined) {
          newState.totalCounts = {
            ...newState.totalCounts,
            [searchKey]: action.payload.total,
          };
          // Also store total count without page info
          newState.searchTotals = {
            ...newState.searchTotals,
            [searchKeyWithoutPage]: action.payload.total,
          };
        }
        
        return newState;
      }
    ),
  }),
  selectors: {
    selectPages: (state: BrewerySearchResultsState) => state.pages,
    selectEntities: (state: BrewerySearchResultsState) => state.entities,
    selectTotalCounts: (state: BrewerySearchResultsState) => state.totalCounts,
  },
});

export const { setResults } = brewerySearchResultsSlice.actions;
export const { selectPages, selectEntities, selectTotalCounts } = brewerySearchResultsSlice.selectors;

// Thunk to fetch search results and update Redux state
export const fetchSearchResultsThunk = createAsyncThunk(
  'breweries/fetchSearchResults',
  async (
    { search, page, by_name, by_city, sort, per_page }: { search: string; page: number; by_name?: string; by_city?: string; sort?: string; per_page?: number },
    { dispatch, getState }
  ) => {
    const searchKey = makeSearchKey({ search, page, by_name, by_city, sort, per_page });
    const state = getState() as RootState;
    const pageIds = state.brewerySearchResults.pages[searchKey];
    if (pageIds && pageIds.length > 0) {
      // Already have this page
      return pageIds.map(id => state.brewerySearchResults.entities[id]);
    }
    
    // For mock data, we can get total count
    if (process.env.NODE_ENV === 'development' && (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' || process.env.NEXT_PUBLIC_USE_MOCK_API === undefined)) {
      const { mockFetchSearchResults } = await import('@/services/open_brewery_db');
      const mockResult = await mockFetchSearchResults(search, page, by_name, by_city, sort, per_page);
      dispatch(setResults({ search, page, by_name, by_city, sort, per_page: per_page ?? 3, results: mockResult.results, total: mockResult.total }));
      return mockResult.results;
    } else {
      // Real API - no total count available
      const results = await fetchSearchResults(search, page, by_name, by_city, sort, per_page);
      dispatch(setResults({ search, page, by_name, by_city, sort, per_page: per_page ?? 3, results }));
      return results;
    }
  }
);

// Selector to get results by composite search key from RootState
export const selectResultsBySearchKeyFromRoot = (
  state: RootState,
  params: { search: string; page: number; by_name?: string; by_city?: string; sort?: string; per_page?: number }
) => {
  const searchKey = makeSearchKey(params);
  return state.brewerySearchResults.pages[searchKey] || [];
};

// Selector to get BreweryResult objects by composite search key from RootState
export const selectResultEntitiesBySearchKeyFromRoot = (
  state: RootState,
  params: { search: string; page: number; by_name?: string; by_city?: string; sort?: string; per_page?: number }
) => {
  const searchKey = makeSearchKey(params);
  const ids = state.brewerySearchResults.pages[searchKey] || [];
  return ids.map((id: string) => state.brewerySearchResults.entities[id]).filter(Boolean);
};

// Selector to get total count by composite search key from RootState
export const selectTotalCountBySearchKeyFromRoot = (
  state: RootState,
  params: { search: string; page: number; by_name?: string; by_city?: string; sort?: string; per_page?: number }
) => {
  const searchKey = makeSearchKey(params);
  return state.brewerySearchResults.totalCounts[searchKey] || 0;
};

// Selector to get total count for a search without page information
export const selectSearchTotalFromRoot = (
  state: RootState,
  params: { search: string; by_name?: string; by_city?: string; sort?: string; per_page?: number }
) => {
  const searchKeyWithoutPage = makeSearchKeyWithoutPage(params);
  return state.brewerySearchResults.searchTotals[searchKeyWithoutPage] || 0;
};

// Selector to get a brewery entity by ID from RootState
export const selectBreweryByIdFromRoot = (
  state: RootState,
  breweryId: string
) => {
  return state.brewerySearchResults.entities[breweryId] || null;
};

// Selector to find a brewery by name from RootState
export const selectBreweryByNameFromRoot = (
  state: RootState,
  breweryName: string
) => {
  const entities = state.brewerySearchResults.entities;
  return Object.values(entities).find(brewery => brewery.name === breweryName) || null;
};

// Selector to create suggestions with proper brewery IDs
export const selectSuggestionsWithIdsFromRoot = (
  state: RootState,
  suggestionNames: string[]
) => {
  const entities = state.brewerySearchResults.entities;
  return suggestionNames.map(name => {
    const brewery = Object.values(entities).find(b => b.name === name);
    return { id: brewery?.id || name, name };
  });
};
