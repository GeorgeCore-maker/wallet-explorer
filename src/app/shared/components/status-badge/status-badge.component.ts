import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';

export type TransactionStatus = 'confirmed' | 'pending' | 'failed';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="getBadgeClass()">
      {{ getLabel() }}
    </span>
  `,
  styles: [`
    span {
      @apply px-2 py-1 text-xs font-medium rounded-full;
    }
  `]
})
export class StatusBadgeComponent {
  status = input.required<TransactionStatus>();
  private languageService = inject(LanguageService);

  getLabel(): string {
    return this.languageService.translate(this.status());
  }

  getBadgeClass(): string {
    const classes: Record<TransactionStatus, string> = {
      confirmed: 'bg-green-900/40 text-green-200 border border-green-600/50 font-semibold',
      pending: 'bg-yellow-900/40 text-yellow-200 border border-yellow-600/50 font-semibold',
      failed: 'bg-red-900/40 text-red-200 border border-red-600/50 font-semibold'
    };
    return classes[this.status()];
  }
}
