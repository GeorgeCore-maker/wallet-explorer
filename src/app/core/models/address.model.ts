export interface AddressInfo {
  hash: string;
  coin_balance: string;
  transaction_count: number;
  is_contract: boolean;
  name: string | null;
}
