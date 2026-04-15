export interface TokenBalance {
  token: {
    name: string;
    symbol: string;
    decimals: string;
    address: string;
    type: string;
  };
  value: string;
}
