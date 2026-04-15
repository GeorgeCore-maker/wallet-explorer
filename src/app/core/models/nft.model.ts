export interface NFT {
  token: {
    name: string;
    symbol: string;
    address: string;
  };
  token_id: string;
  image_url: string | null;
  metadata: Record<string, unknown> | null;
}
