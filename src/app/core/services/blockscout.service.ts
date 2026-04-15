// core/services/blockscout.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AddressInfo } from '../models/address.model';
import { Transaction } from '../models/transaction.model';
import { TokenBalance } from '../models/token.model';
import { NFT } from '../models/nft.model';

interface PaginatedResponse<T> {
  items: T[];
  next_page_params: Record<string, unknown> | null;
}

@Injectable({ providedIn: 'root' })
export class BlockscoutService {
  private readonly http = inject(HttpClient);
  private readonly base = 'https://eth.blockscout.com/api/v2';

  getAddress(hash: string): Observable<AddressInfo> {
    return this.http.get<AddressInfo>(`${this.base}/addresses/${hash}`)
      .pipe(catchError(err => throwError(() => err)));
  }

  getTransactions(hash: string, pageParams?: Record<string, unknown>): Observable<PaginatedResponse<Transaction>> {
    let params = new HttpParams();

    if (pageParams) {
      Object.entries(pageParams).forEach(([key, value]) => {
        params = params.set(key, String(value));
      });
    }

    console.log('API call params:', params.toString());

    return this.http.get<PaginatedResponse<Transaction>>(
      `${this.base}/addresses/${hash}/transactions`,
      { params }
    ).pipe(catchError(err => throwError(() => err)));
  }  getTokens(hash: string): Observable<TokenBalance[]> {
  return this.http.get<TokenBalance[]>(
    `${this.base}/addresses/${hash}/token-balances`
  ).pipe(catchError(err => throwError(() => err)));
}

  getNFTs(hash: string): Observable<PaginatedResponse<NFT>> {
    return this.http.get<PaginatedResponse<NFT>>(
      `${this.base}/addresses/${hash}/nft`,
      { params: new HttpParams().set('type', 'ERC-721,ERC-1155') }
    ).pipe(catchError(err => throwError(() => err)));
  }
}
