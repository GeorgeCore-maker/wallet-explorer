import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatFormFieldModule, MatIconModule],
  template: `
    <div class="flex items-center gap-2">
      <mat-icon class="text-slate-400 text-base">language</mat-icon>
      <mat-form-field appearance="outline" class="!text-xs">
        <mat-select
          [value]="languageService.currentLanguage()"
          (selectionChange)="languageService.setLanguage($event.value)"
          class="text-slate-300">
          <mat-option value="es">{{ languageService.translate('spanish') }}</mat-option>
          <mat-option value="en">{{ languageService.translate('english') }}</mat-option>
        </mat-select>
      </mat-form-field>
    </div>
  `,
  styles: [`
    ::ng-deep .mat-mdc-form-field {
      .mat-mdc-text-field-wrapper {
        background-color: rgba(51, 65, 85, 0.3);
        border-radius: 8px;
      }
      .mdc-notched-outline {
        border-color: rgb(71, 85, 105);
      }
      &:hover .mdc-notched-outline {
        border-color: rgb(100, 116, 139);
      }
      .mat-mdc-select-value {
        color: rgb(203, 213, 225);
        font-size: 14px;
      }
      .mat-mdc-select-arrow {
        color: rgb(148, 163, 184);
      }
    }
    ::ng-deep .mat-mdc-select-panel {
      background-color: rgb(30, 41, 59);
    }
    ::ng-deep .mat-mdc-option {
      color: rgb(203, 213, 225);
      &:hover {
        background-color: rgb(51, 65, 85);
      }
      &.mdc-list-item--selected {
        background-color: rgb(59, 130, 246);
      }
    }
  `]
})
export class LanguageSelectorComponent {
  languageService = inject(LanguageService);
}
