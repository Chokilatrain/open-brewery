import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import { combineSlices } from "@reduxjs/toolkit";
import { breweryAutocompleteSlice } from "./features/breweries/breweryAutocompleteSlice";
import { brewerySearchSlice } from "./features/breweries/brewerySearchSlice";
import { brewerySearchResultsSlice } from "./features/breweries/searchResultsThunks";

const rootReducer = combineSlices(breweryAutocompleteSlice, brewerySearchSlice, brewerySearchResultsSlice);

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = () => configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware();
  }
});

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<ThunkReturnType, RootState, unknown, Action>;

export const store = makeStore();