import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import coinsReducer from '../features/coins/coins';

export const store = configureStore({
  reducer: {
    coins: coinsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

/* eslint-disable @typescript-eslint/indent */
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
/* eslint-enable @typescript-eslint/indent */
