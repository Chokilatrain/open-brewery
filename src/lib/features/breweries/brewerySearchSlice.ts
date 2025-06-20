import { createAppSlice } from "@/lib/createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface BrewerySearchState {
  search: string;
}

const initialState: BrewerySearchState = {
  search: "",
};

export const brewerySearchSlice = createAppSlice({
  name: "brewerySearch",
  initialState,
  reducers: (create) => ({
    setSearch: create.reducer((state: BrewerySearchState, action: PayloadAction<string>) => {
      state.search = action.payload;
    }),
  }),
  selectors: {
    selectSearch: (state: BrewerySearchState) => state.search,
  },
});

export const { setSearch } = brewerySearchSlice.actions;
export const { selectSearch } = brewerySearchSlice.selectors; 