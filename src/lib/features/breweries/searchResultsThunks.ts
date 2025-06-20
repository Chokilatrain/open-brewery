import { createAppSlice } from "@/lib/createAppSlice";
import type { BreweryResult } from "@/services/open_brewery_db";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSearchResults } from "@/services/open_brewery_db";
import type { RootState } from "@/lib/store";

export interface BrewerySearchResultsState {
  pages: { [search: string]: { [page: number]: string[] } };
  entities: { [id: string]: BreweryResult };
}

const initialState: BrewerySearchResultsState = {
  pages: {},
  entities: {},
};

export const brewerySearchResultsSlice = createAppSlice({
  name: "brewerySearchResults",
  initialState,
  reducers: (create) => ({
    setResults: create.reducer(
      (
        state: BrewerySearchResultsState,
        action: PayloadAction<{ search: string; page: number; results: BreweryResult[] }>
      ) => {
        const normalizedSearch = action.payload.search.trim().toLowerCase();
        // Add/merge entities
        const newEntities = { ...state.entities };
        action.payload.results.forEach(brewery => {
          newEntities[brewery.id] = brewery;
        });
        // Store page as array of ids
        return {
          ...state,
          entities: newEntities,
          pages: {
            ...state.pages,
            [normalizedSearch]: {
              ...(state.pages[normalizedSearch] || {}),
              [action.payload.page]: action.payload.results.map(b => b.id),
            },
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
  async ({ search, page }: { search: string; page: number }, { dispatch, getState }) => {
    const normalizedSearch = search.trim().toLowerCase();
    const state = getState() as RootState;
    const pageIds = state.brewerySearchResults.pages[normalizedSearch]?.[page];
    if (pageIds && pageIds.length > 0) {
      // Already have this page
      return pageIds.map(id => state.brewerySearchResults.entities[id]);
    }
    const results = await fetchSearchResults(search, page);
    dispatch(setResults({ search: normalizedSearch, page, results }));
    return results;
  }
);
