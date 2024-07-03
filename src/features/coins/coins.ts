/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Coin, getCoinsOptions } from '../../api/coins';

export interface PostsState {
  loaded: boolean;
  coins: Coin[];
  hasError: boolean;
}

export interface СoinsOption {
  page: number;
  currency: string;
  order: string;
  perPage: number;
}

const initialState: PostsState = {
  loaded: false,
  coins: [],
  hasError: false,
};

export const getCoinsOptionally = createAsyncThunk(
  'coins/fetchCoinsOption',
  async ({ page, currency, order, perPage }: СoinsOption) => {
    return getCoinsOptions(page, currency, order, perPage);
  }
);

export const loadCoins = createSlice({
  name: 'coins',
  initialState,
  reducers: {
    setCoins: (state) => {
      state.coins = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCoinsOptionally.pending, (state) => {
        state.loaded = true;
      })
      .addCase(getCoinsOptionally.fulfilled, (state, action) => {
        state.loaded = false;
        state.coins = action.payload;
      })
      .addCase(getCoinsOptionally.rejected, (state) => {
        state.loaded = false;
        state.hasError = true;
      });
  },
});

export const coinsState = (state: RootState) => state.coins;
export const { setCoins } = loadCoins.actions;
export default loadCoins.reducer;
