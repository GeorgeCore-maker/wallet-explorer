// features/wallet/transactions/transactions.component.ts
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { BlockscoutService } from '../../../core/services/blockscout.service';
import { CsvExportService } from '../../../core/services/csv-export.service';
import { LanguageService } from '../../../core/services/language.service';
import { Transaction } from '../../../core/models/transaction.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { WeiToEthPipe } from '../../../shared/pipes/wei-to-eth.pipe';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule, MatTooltipModule, MatPaginatorModule, StatusBadgeComponent, WeiToEthPipe],
  template: `
    <div class="py-4">
      @if (loading()) {
        <div class="flex justify-center py-10"><mat-spinner diameter="36" /></div>
      } @else if (items().length === 0) {
        <p class="text-center text-slate-400 py-10 font-medium">{{ languageService.translate('no.transactions') }}</p>
      } @else {
        <!-- Export Button -->
        <div class="flex justify-end mb-4">
          <button mat-stroked-button (click)="exportToCsv()" class="text-slate-300 border-slate-600 hover:bg-slate-800">
            <mat-icon class="mr-2">download</mat-icon>
            {{ languageService.translate('export.csv') }}
          </button>
        </div>

        <div class="overflow-x-auto">
          <table mat-table [dataSource]="items()" class="w-full text-slate-200">
            <ng-container matColumnDef="hash">
              <th mat-header-cell *matHeaderCellDef class="text-slate-300 font-semibold">{{ languageService.translate('hash') }}</th>
              <td mat-cell *matCellDef="let tx">
                <div class="flex items-center gap-2">
                  <span class="font-mono text-xs text-blue-300 cursor-pointer hover:text-blue-100 hover:underline transition" (click)="openEtherscan(tx.hash)">{{ tx.hash | slice:0:12 }}...</span>
                  <button mat-icon-button (click)="copyToClipboard(tx.hash)" class="!w-6 !h-6 text-slate-400 hover:text-white" [matTooltip]="languageService.translate('copy')">
                    <mat-icon class="!text-base">content_copy</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

          <ng-container matColumnDef="from">
            <th mat-header-cell *matHeaderCellDef class="text-slate-300 font-semibold">{{ languageService.translate('from') }}</th>
            <td mat-cell *matCellDef="let tx">
              <span class="font-mono text-xs text-slate-300">{{ tx.from.hash | slice:0:10 }}...</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="to">
            <th mat-header-cell *matHeaderCellDef class="text-slate-300 font-semibold">{{ languageService.translate('to') }}</th>
            <td mat-cell *matCellDef="let tx">
              <span class="font-mono text-xs text-slate-300">{{ tx.to?.hash ? (tx.to!.hash | slice:0:10) + '...' : '—' }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="value">
            <th mat-header-cell *matHeaderCellDef class="text-slate-300 font-semibold">{{ languageService.translate('value.eth') }}</th>
            <td mat-cell *matCellDef="let tx" class="text-slate-200 font-medium">{{ tx.value | weiToEth }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef class="text-slate-300 font-semibold">{{ languageService.translate('status') }}</th>
            <td mat-cell *matCellDef="let tx">
              <app-status-badge [status]="mapStatus(tx.status)" />
            </td>
          </ng-container>

          <ng-container matColumnDef="timestamp">
            <th mat-header-cell *matHeaderCellDef class="text-slate-300 font-semibold">{{ languageService.translate('time') }}</th>
            <td mat-cell *matCellDef="let tx">
              <span class="text-xs text-slate-400">{{ tx.timestamp | date:'short' }}</span>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="cols" class="bg-slate-800/50"></tr>
          <tr mat-row *matRowDef="let row; columns: cols" class="border-t border-slate-700/50 hover:bg-slate-800/30 transition"></tr>
        </table>
        </div>

        <mat-paginator
          [length]="totalItems()"
          [pageSize]="pageSize()"
          [pageIndex]="pageIndex()"
          [pageSizeOptions]="[10, 25, 50]"
          (page)="onPageChange($event)"
          showFirstLastButtons
          class="!bg-slate-800/50 text-slate-300">
        </mat-paginator>
      }
    </div>
  `
})
export class TransactionsComponent implements OnInit {
  address = input.required<string>();
  private svc = inject(BlockscoutService);
  private csvExport = inject(CsvExportService);
  languageService = inject(LanguageService);

  items = signal<Transaction[]>([]);
  loading = signal(true);
  cols = ['hash', 'from', 'to', 'value', 'status', 'timestamp'];

  pageIndex = signal(0);
  pageSize = signal(10);
  totalItems = signal(1000); // Estimación para mostrar paginador
  private currentNextPageParams = signal<Record<string, unknown> | null>(null);

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);
  }

  openEtherscan(hash: string): void {
    window.open(`https://etherscan.io/tx/${hash}`, '_blank');
  }

  mapStatus(status: string | null): 'confirmed' | 'pending' | 'failed' {
    if (status === 'ok') return 'confirmed';
    if (status === 'error') return 'failed';
    return 'pending';
  }

  exportToCsv(): void {
    const currentData = this.items();
    if (currentData.length === 0) return;

    const csvData = currentData.map(tx => ({
      hash: tx.hash,
      from: tx.from.hash,
      to: tx.to?.hash || 'N/A',
      value_eth: (Number(tx.value) / 1e18).toFixed(4),
      status: this.mapStatus(tx.status),
      timestamp: tx.timestamp,
      gas_used: tx.gas_used,
      fee_value: tx.fee.value
    }));

    const filename = `transactions_${this.address()}_${new Date().toISOString().split('T')[0]}.csv`;

    this.csvExport.exportToCsv(csvData, filename, [
      { key: 'hash', header: 'Transaction Hash' },
      { key: 'from', header: 'From Address' },
      { key: 'to', header: 'To Address' },
      { key: 'value_eth', header: 'Value (ETH)' },
      { key: 'status', header: 'Status' },
      { key: 'timestamp', header: 'Timestamp' },
      { key: 'gas_used', header: 'Gas Used' },
      { key: 'fee_value', header: 'Fee (Wei)' }
    ]);
  }

  toEth(wei: string): string {
    return (Number(wei) / 1e18).toFixed(4);
  }

  statusClass(status: string | null): string {
    const base = 'text-xs font-medium px-2 py-0.5 rounded-full ';
    if (status === 'ok') return base + 'bg-green-100 text-green-700';
    if (status === 'error') return base + 'bg-red-100 text-red-700';
    return base + 'bg-yellow-100 text-yellow-700';
  }

  onPageChange(event: PageEvent): void {
    const newPageIndex = event.pageIndex;
    const newPageSize = event.pageSize;

    // Si cambió el tamaño de página, reset
    if (newPageSize !== this.pageSize()) {
      this.pageSize.set(newPageSize);
      this.pageIndex.set(0);
      this.currentNextPageParams.set(null); // Reset paginación
      this.totalItems.set(1000); // Reset estimación
      this.loadPage(0);
      return;
    }

    this.pageIndex.set(newPageIndex);
    this.loadPage(newPageIndex);
  }

  private loadPage(index: number): void {
    this.loading.set(true);

    // Construir parámetros para la API de Blockscout
    let pageParams: Record<string, unknown> = {};

    // Si no es la primera página, usar next_page_params pero SIN items_count
    if (index > 0 && this.currentNextPageParams()) {
      const nextParams = this.currentNextPageParams()!;
      // Copiar todos los parámetros EXCEPTO items_count
      Object.keys(nextParams).forEach(key => {
        if (key !== 'items_count') {
          pageParams[key] = nextParams[key];
        }
      });
    }

    // SIEMPRE establecer items_count con el pageSize actual
    pageParams['items_count'] = this.pageSize();

    this.svc.getTransactions(this.address(), pageParams).subscribe({
      next: res => {

        // La API siempre devuelve 50, pero nosotros solo mostramos los que el usuario quiere
        const itemsToShow = res.items.slice(0, this.pageSize());

        this.items.set(itemsToShow);
        this.currentNextPageParams.set(res.next_page_params);

        // Ajustar total si llegamos al final
        if (!res.next_page_params && res.items.length < this.pageSize()) {
          this.totalItems.set((index * this.pageSize()) + res.items.length);
        }

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando transacciones:', err);
        this.loading.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.loadPage(0);
  }
}
