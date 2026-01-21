import { configureStore } from '@reduxjs/toolkit';
import { spotifyApi } from './spotifyApi';
import { accountApi } from './accountApi';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [spotifyApi.reducerPath]: spotifyApi.reducer,
      [accountApi.reducerPath]: accountApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        spotifyApi.middleware,
        accountApi.middleware
      ),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
