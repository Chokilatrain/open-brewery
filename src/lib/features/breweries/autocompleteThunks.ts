import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAutocompleteSuggestions } from '@/services/open_brewery_db';
import { setSuggestions } from './breweryAutocompleteSlice';
import { setSearch } from './brewerySearchSlice';
import { setResults } from './searchResultsThunks';
import type { RootState } from '@/lib/store';

// Thunk to update the search term in Redux state
export const updateSearchTerm = createAsyncThunk(
  'breweries/updateSearchTerm',
  async (search: string, { dispatch }) => {
    dispatch(setSearch(search));
    return search;
  }
);

// Thunk to fetch autocomplete suggestions and update Redux state
export const fetchAutocompleteSuggestionsThunk = createAsyncThunk(
  'breweries/fetchAutocompleteSuggestions',
  async (search: string, { dispatch, getState }) => {
    const state = getState() as RootState;
    if (state.breweryAutocomplete.suggestions[search]) {
      return state.breweryAutocomplete.suggestions[search];
    }
    const suggestions = await fetchAutocompleteSuggestions(search);
    // Add autocomplete breweries to the entities map (page 0 for autocomplete)
    dispatch(setResults({ search, page: 0, results: suggestions }));
    dispatch(setSuggestions({ search, suggestions: suggestions.map(s => s.name) }));
    return suggestions;
  }
); 