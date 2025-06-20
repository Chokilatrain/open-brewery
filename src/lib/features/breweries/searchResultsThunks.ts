import { createAppSlice } from "@/lib/createAppSlice";
import type { BreweryResult } from "@/services/open_brewery_db";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSearchResults } from "@/services/open_brewery_db";
import type { RootState } from "@/lib/store";

export interface BrewerySearchResultsState {
  pages: { [searchKey: string]: string[] };
  entities: { [id: string]: BreweryResult };
}

const initialState: BrewerySearchResultsState = {
  pages: {},
  entities: {},
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

export const brewerySearchResultsSlice = createAppSlice({
  name: "brewerySearchResults",
  initialState,
  reducers: (create) => ({
    setResults: create.reducer(
      (
        state: BrewerySearchResultsState,
        action: PayloadAction<{ search: string; page: number; by_name?: string; by_city?: string; sort?: string; per_page?: number; results: BreweryResult[] }>
      ) => {
        const searchKey = makeSearchKey(action.payload);
        console.log('searchKey ASDSASD', searchKey);
        // Add/merge entities
        const newEntities = { ...state.entities };
        action.payload.results.forEach(brewery => {
          newEntities[brewery.id] = brewery;
        });
        // Store page as array of ids, keyed by composite searchKey
        return {
          ...state,
          entities: newEntities,
          pages: {
            ...state.pages,
            [searchKey]: action.payload.results.map(b => b.id),
          },
        };
      }
    ),
  }),
  selectors: {
    selectPages: (state: BrewerySearchResultsState) => state.pages,
    selectEntities: (state: BrewerySearchResultsState) => state.entities,
  },
});

export const { setResults } = brewerySearchResultsSlice.actions;
export const { selectPages, selectEntities } = brewerySearchResultsSlice.selectors;

// Thunk to fetch search results and update Redux state
export const fetchSearchResultsThunk = createAsyncThunk(
  'breweries/fetchSearchResults',
  async (
    { search, page, by_name, by_city, sort, per_page }: { search: string; page: number; by_name?: string; by_city?: string; sort?: string; per_page?: number },
    { dispatch, getState }
  ) => {
    const searchKey = makeSearchKey({ search, page, by_name, by_city, sort, per_page });
    console.log('searchKey', searchKey);
    const state = getState() as RootState;
    const pageIds = state.brewerySearchResults.pages[searchKey];
    if (pageIds && pageIds.length > 0) {
      // Already have this page
      return pageIds.map(id => state.brewerySearchResults.entities[id]);
    }
    const results = await fetchSearchResults(search, page, by_name, by_city, sort, per_page);
    dispatch(setResults({ search, page, by_name, by_city, sort, per_page: per_page ?? 3, results }));
    return results;
  }
);

// Selector to get results by composite search key from RootState
export const selectResultsBySearchKeyFromRoot = (
  state: RootState,
  params: { search: string; page: number; by_name?: string; by_city?: string; sort?: string; per_page?: number }
) => {
  const searchKey = makeSearchKey(params);
  console.log('searchKey', searchKey);
  return state.brewerySearchResults.pages[searchKey] || [];
};

// Selector to get BreweryResult objects by composite search key from RootState
export const selectResultEntitiesBySearchKeyFromRoot = (
  state: RootState,
  params: { search: string; page: number; by_name?: string; by_city?: string; sort?: string; per_page?: number }
) => {
  const searchKey = makeSearchKey(params);
  console.log('searchKey', searchKey);
  const ids = state.brewerySearchResults.pages[searchKey] || [];
  return ids.map((id: string) => state.brewerySearchResults.entities[id]).filter(Boolean);
};
