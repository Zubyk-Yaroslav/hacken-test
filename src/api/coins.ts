import { client } from '../utils/fetchClient';

export interface Coin {
  key: string;
  image: string;
  name: string;
  current_price: number;
  circulating_supply: number;
}

export const getCoinsOptions = (
  page: number = 1,
  currency: string = 'usd',
  order: string = 'market_cap_desc',
  perPage: number = 10
) => {
  return client.get<Coin[]>(
    `markets?vs_currency=${currency}&order=${order}&per_page=${perPage}&page=${page}&sparkline=false`
  );
};
