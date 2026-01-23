import { configureStore } from '@reduxjs/toolkit';
import { spotifyApi } from './spotifyApi';
import { soundcloudApi } from './soundcloudApi';
import { accountApi } from './accountApi';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [spotifyApi.reducerPath]: spotifyApi.reducer,
      [soundcloudApi.reducerPath]: soundcloudApi.reducer,
      [accountApi.reducerPath]: accountApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        spotifyApi.middleware,
        soundcloudApi.middleware,
        accountApi.middleware
      ),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
