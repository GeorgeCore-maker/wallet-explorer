// features/wallet/wallet.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BlockscoutService } from '../../core/services/blockscout.service';
import { LanguageService } from '../../core/services/language.service';
import { AddressInfo } from '../../core/models/address.model';
import { TransactionsComponent } from './transactions/transactions.component';
import { TokensComponent } from './tokens/tokens.component';
import { NftsComponent } from './nfts/nfts.component';
import { LanguageSelectorComponent } from '../../shared/components/language-selector/language-selector.component';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    TransactionsComponent,
    TokensComponent,
    NftsComponent,
    LanguageSelectorComponent,
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <!-- Language Selector -->
      <div class="absolute top-4 right-4">
        <app-language-selector />
      </div>

      <div class="max-w-5xl mx-auto p-6">
        <button mat-button (click)="router.navigate(['/'])" class="mb-4 -ml-2 text-slate-300 hover:text-white">
          <mat-icon>arrow_back</mat-icon> {{ languageService.translate('back') }}
        </button>

        @if (loading()) {
          <div class="flex justify-center mt-32">
            <mat-spinner />
          </div>
        } @else if (error()) {
          <div class="flex flex-col items-center mt-32 gap-2 bg-red-900/30 border border-red-700/50 rounded-lg p-6 text-red-300">
            <mat-icon class="!text-4xl">error_outline</mat-icon>
            <p class="font-medium">{{ error() }}</p>
          </div>
        } @else if (info()) {
          <div class="mb-6 p-6 rounded-xl border border-blue-500/30 bg-slate-800/50 backdrop-blur">
            <div class="flex items-center gap-2 mb-3">
              <p class="text-sm text-slate-300 break-all font-mono">{{ info()!.hash }}</p>
              <button mat-icon-button (click)="copyAddress()" [matTooltip]="languageService.translate('copy')" class="!w-6 !h-6 text-slate-400 hover:text-white">
                <mat-icon class="!text-sm">content_copy</mat-icon>
              </button>
            </div>
            <div class="flex items-end gap-3 mt-3">
              <span class="text-4xl font-bold text-white">{{ ethBalance() }} ETH</span>
              @if (info()!.name) {
                <span class="text-sm text-slate-300 mb-1 font-medium">{{ info()!.name }}</span>
              }
              @if (info()!.is_contract) {
                <span class="text-xs bg-purple-600/40 text-purple-200 px-3 py-1 rounded-full mb-1 font-semibold border border-purple-500/30">Contract</span>
              }
            </div>
            <p class="text-sm text-slate-400 mt-2 font-medium">{{ info()!.transaction_count }} {{ languageService.translate('transactions').toLowerCase() }}</p>
          </div>

          <mat-tab-group animationDuration="200ms" dynamicHeight class="text-white">
            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon class="mr-1 text-base">swap_horiz</mat-icon> {{ languageService.translate('transactions') }}
              </ng-template>
            <app-transactions [address]="address()" />
          </mat-tab>

          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="mr-1 text-base">toll</mat-icon> {{ languageService.translate('tokens') }}
            </ng-template>
            <app-tokens [address]="address()" />
          </mat-tab>

          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="mr-1 text-base">image</mat-icon> {{ languageService.translate('nfts') }}
            </ng-template>
            <app-nfts [address]="address()" />
          </mat-tab>
        </mat-tab-group>
      }
    </div>
  `
})
export class WalletComponent implements OnInit {
  protected router = inject(Router);
  private route = inject(ActivatedRoute);
  private svc = inject(BlockscoutService);
  languageService = inject(LanguageService);

  info = signal<AddressInfo | null>(null);
  loading = signal(true);
  error = signal('');
  address = signal('');

  copyAddress(): void {
    navigator.clipboard.writeText(this.address());
  }

  ethBalance(): string {
    return (Number(this.info()?.coin_balance ?? '0') / 1e18).toFixed(4);
  }

  ngOnInit(): void {
    const addr = this.route.snapshot.paramMap.get('address')!;
    this.address.set(addr);
    this.svc.getAddress(addr).subscribe({
      next: data => { this.info.set(data); this.loading.set(false); },
      error: () => { this.error.set(this.languageService.translate('wallet.not.found')); this.loading.set(false); }
    });
  }
}
