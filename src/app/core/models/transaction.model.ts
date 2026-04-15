export interface Transaction {
  hash: string;
  from: { hash: string };
  to: { hash: string } | null;
  value: string;
  status: 'ok' | 'error' | null;
  timestamp: string;
  gas_used: string;
  fee: { value: string };
}
