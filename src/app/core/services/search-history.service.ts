import { Injectable, signal, inject } from '@angular/core';
import { BlockscoutService } from './blockscout.service';

interface SearchHistoryItem {
  address: string;
  name: string | null;
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class SearchHistoryService {
  private readonly blockscout = inject(BlockscoutService);
  private readonly STORAGE_KEY = 'wallet_explorer_history';
  private readonly MAX_ITEMS = 10;

  history = signal<SearchHistoryItem[]>([]);

  constructor() {
    this.loadHistory();
  }

  addSearch(address: string): void {
    // Buscar info de la address para obtener el nombre
    this.blockscout.getAddress(address).subscribe({
      next: (info) => {
        this.addToHistory({
          address,
          name: info.name,
          timestamp: Date.now()
        });
      },
      error: () => {
        // Si falla, agregar sin nombre
        this.addToHistory({
          address,
          name: null,
          timestamp: Date.now()
        });
      }
    });
  }

  private addToHistory(item: SearchHistoryItem): void {
    let current = this.history();

    // Remover duplicados (mismo address)
    current = current.filter(h => h.address.toLowerCase() !== item.address.toLowerCase());

    // Agregar al inicio
    current.unshift(item);

    // Limitar a MAX_ITEMS
    current = current.slice(0, this.MAX_ITEMS);

    this.history.set(current);
    this.saveHistory();
  }

  clearHistory(): void {
    this.history.set([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private saveHistory(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.history()));
  }

  private loadHistory(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Verificar si es el formato antiguo (array de strings)
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
          // Convertir formato antiguo a nuevo
          const converted: SearchHistoryItem[] = parsed.map(addr => ({
            address: addr,
            name: null,
            timestamp: Date.now()
          }));
          this.history.set(converted);
          this.saveHistory(); // Guardar en nuevo formato
        } else {
          this.history.set(parsed);
        }
      }
    } catch (e) {
      console.error('Error loading search history:', e);
    }
  }
}
