// features/wallet/tokens/tokens.component.ts
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BlockscoutService } from '../../../core/services/blockscout.service';
import { CsvExportService } from '../../../core/services/csv-export.service';
import { LanguageService } from '../../../core/services/language.service';
import { TokenBalance } from '../../../core/models/token.model';
import { WeiToEthPipe } from '../../../shared/pipes/wei-to-eth.pipe';

@Component({
  selector: 'app-tokens',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatListModule, MatButtonModule, MatIconModule, WeiToEthPipe],
  template: `
    <div class="py-4">
      @if (loading()) {
        <div class="flex justify-center py-10"><mat-spinner diameter="36" /></div>
      } @else if (items().length === 0) {
        <p class="text-center text-slate-400 py-10 font-medium">{{ languageService.translate('no.tokens') }}</p>
      } @else {
        <!-- Export Button -->
        <div class="flex justify-end mb-4">
          <button mat-stroked-button (click)="exportToCsv()" class="text-slate-300 border-slate-600 hover:bg-slate-800">
            <mat-icon class="mr-2">download</mat-icon>
            {{ languageService.translate('export.csv') }}
          </button>
        </div>

        <mat-list class="!bg-transparent">
          @for (t of items(); track t.token.address) {
            <mat-list-item class="!h-auto !py-4 border-b border-slate-700/50 hover:bg-slate-800/30 transition">
              <div class="flex justify-between w-full items-center">
                <div>
                  <p class="font-semibold text-slate-200">{{ t.token.name }}</p>
                  <p class="text-xs text-slate-400 font-medium">{{ t.token.symbol }} · {{ t.token.type }}</p>
                </div>
                <p class="font-mono text-sm text-slate-100 font-semibold">{{ t.value | weiToEth: t.token.decimals }}</p>
              </div>
            </mat-list-item>
          }
        </mat-list>
      }
    </div>
  `
})
export class TokensComponent implements OnInit {
  address = input.required<string>();
  private svc = inject(BlockscoutService);
  private csvExport = inject(CsvExportService);
  languageService = inject(LanguageService);

  items = signal<TokenBalance[]>([]);
  loading = signal(true);

  exportToCsv(): void {
    const currentData = this.items();
    if (currentData.length === 0) return;

    const csvData = currentData.map(t => ({
      token_name: t.token.name,
      token_symbol: t.token.symbol,
      token_type: t.token.type,
      token_address: t.token.address,
      balance_raw: t.value,
      balance_formatted: (Number(t.value) / Math.pow(10, Number(t.token.decimals) || 18)).toFixed(4),
      decimals: t.token.decimals
    }));

    const filename = `tokens_${this.address()}_${new Date().toISOString().split('T')[0]}.csv`;

    this.csvExport.exportToCsv(csvData, filename, [
      { key: 'token_name', header: 'Token Name' },
      { key: 'token_symbol', header: 'Symbol' },
      { key: 'token_type', header: 'Type' },
      { key: 'token_address', header: 'Contract Address' },
      { key: 'balance_formatted', header: 'Balance' },
      { key: 'balance_raw', header: 'Balance (Raw)' },
      { key: 'decimals', header: 'Decimals' }
    ]);
  }

  ngOnInit(): void {
    this.svc.getTokens(this.address()).subscribe({
      next: res => { this.items.set(res); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
