// features/search/search.component.ts
import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { SearchHistoryService } from '../../core/services/search-history.service';
import { LanguageService } from '../../core/services/language.service';
import { LanguageSelectorComponent } from '../../shared/components/language-selector/language-selector.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, LanguageSelectorComponent],
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen gap-6 p-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <!-- Language Selector -->
      <div class="absolute top-4 right-4">
        <app-language-selector />
      </div>

      <h1 class="text-5xl font-bold tracking-tight text-white">{{ languageService.translate('wallet.explorer') }}</h1>
      <p class="text-base text-slate-300 font-medium">{{ languageService.translate('ethereum.mainnet') }}</p>

      <div class="flex w-full max-w-xl gap-2">
        <mat-form-field appearance="fill" class="flex-1">
          <mat-label>{{ languageService.translate('ethereum.address') }}</mat-label>
          <input matInput [(ngModel)]="address" (keyup.enter)="search()"
                placeholder="0x..." maxlength="42" />
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        <button mat-flat-button color="primary" (click)="search()"
                [disabled]="!isValid()" class="font-semibold">
          {{ languageService.translate('search') }}
        </button>
      </div>

      @if (error()) {
        <p class="text-red-400 text-sm font-medium bg-red-900/30 px-4 py-2 rounded-lg border border-red-700/50">{{ error() }}</p>
      }

      @if (historyService.history().length > 0) {
        <div class="w-full max-w-xl">
          <div class="flex items-center justify-between mb-3">
            <p class="text-slate-400 font-medium text-sm">{{ languageService.translate('recent.searches') }}</p>
            <button (click)="historyService.clearHistory()"
                    class="text-xs text-slate-500 hover:text-red-400 transition font-medium">
              {{ languageService.translate('clear') }}
            </button>
          </div>
          <div class="grid grid-cols-1 gap-2">
            @for (item of historyService.history(); track item.address) {
              <button
                (click)="selectFromHistory(item.address)"
                class="text-left px-4 py-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-slate-600 transition text-slate-300 hover:text-white">
                <div class="flex flex-col gap-1">
                  <span class="text-sm font-mono text-slate-300">{{ item.address }}</span>
                  @if (item.name) {
                    <span class="text-xs text-slate-400 font-medium">{{ item.name }}</span>
                  }
                </div>
              </button>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class SearchComponent {
  private router = inject(Router);
  historyService = inject(SearchHistoryService);
  languageService = inject(LanguageService);

  address = '';
  error = signal('');

  isValid(): boolean {
    return /^0x[0-9a-fA-F]{40}$/.test(this.address.trim());
  }

  selectFromHistory(addr: string): void {
    this.address = addr;
    this.search();
  }

  search(): void {
    const addr = this.address.trim();
    if (!this.isValid()) {
      this.error.set(this.languageService.translate('invalid.address'));
      return;
    }
    this.error.set('');
    this.historyService.addSearch(addr);
    this.router.navigate(['/wallet', addr]);
  }
}
