// features/wallet/nfts/nfts.component.ts
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { BlockscoutService } from '../../../core/services/blockscout.service';
import { LanguageService } from '../../../core/services/language.service';
import { NFT } from '../../../core/models/nft.model';

@Component({
  selector: 'app-nfts',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatCardModule],
  template: `
    <div class="py-4">
      @if (loading()) {
        <div class="flex justify-center py-10"><mat-spinner diameter="36" /></div>
      } @else if (items().length === 0) {
        <p class="text-center text-slate-400 py-10 font-medium">{{ languageService.translate('no.nfts') }}</p>
      } @else {
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          @for (nft of items(); track nft.token_id) {
            <mat-card class="overflow-hidden bg-slate-800 border border-slate-700/50 hover:border-slate-600 transition">
              @if (nft.image_url) {
                <img [src]="nft.image_url" [alt]="nft.token.name"
                     class="w-full h-36 object-cover" />
              } @else {
                <div class="w-full h-36 bg-slate-700 flex items-center justify-center text-slate-400 text-xs font-medium">
                  No image
                </div>
              }
              <mat-card-content class="!p-3 bg-slate-800/50">
                <p class="text-xs font-semibold text-slate-200 truncate">{{ nft.token.name }}</p>
                <p class="text-xs text-slate-400 font-medium">#{{ nft.token_id }}</p>
              </mat-card-content>
            </mat-card>
          }
        </div>
      }
    </div>
  `
})
export class NftsComponent implements OnInit {
  address = input.required<string>();
  private svc = inject(BlockscoutService);
  languageService = inject(LanguageService);

  items = signal<NFT[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.svc.getNFTs(this.address()).subscribe({
      next: res => { this.items.set(res.items); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
