import { createAppSlice } from "@/lib/createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface BreweryAutocompleteState {
  suggestions: { [key: string]: string[] };
}

const initialState: BreweryAutocompleteState = {
  suggestions: {},
};

export const breweryAutocompleteSlice = createAppSlice({
  name: "breweryAutocomplete",
  initialState,
  reducers: (create) => ({
    setSuggestions: create.reducer(
      (
        state: BreweryAutocompleteState,
        action: PayloadAction<{ search: string; suggestions: string[] }>
      ) => ({
        ...state,
        suggestions: {
          ...state.suggestions,
          [action.payload.search]: action.payload.suggestions,
        },
      })
    ),
  }),
  selectors: {
    selectSuggestions: (state: BreweryAutocompleteState) => state.suggestions,
  },
});

export const { setSuggestions } = breweryAutocompleteSlice.actions;
export const { selectSuggestions } = breweryAutocompleteSlice.selectors;
