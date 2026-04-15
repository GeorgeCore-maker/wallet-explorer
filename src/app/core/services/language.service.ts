import { Injectable, signal } from '@angular/core';

export type Language = 'es' | 'en';

interface Translations {
  [key: string]: {
    es: string;
    en: string;
  };
}

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly STORAGE_KEY = 'wallet_explorer_language';

  currentLanguage = signal<Language>('es');

  private translations: Translations = {
    // Header
    'wallet.explorer': {
      es: 'Explorador de Wallet',
      en: 'Wallet Explorer'
    },
    'ethereum.mainnet': {
      es: 'Ethereum Mainnet · Blockscout',
      en: 'Ethereum Mainnet · Blockscout'
    },

    // Search
    'ethereum.address': {
      es: 'Dirección Ethereum',
      en: 'Ethereum address'
    },
    'search': {
      es: 'Buscar',
      en: 'Search'
    },
    'recent.searches': {
      es: 'Búsquedas recientes',
      en: 'Recent searches'
    },
    'clear': {
      es: 'Limpiar',
      en: 'Clear'
    },
    'invalid.address': {
      es: 'Dirección inválida. Debe ser 0x seguido de 40 caracteres hex.',
      en: 'Invalid address. Must be 0x followed by 40 hex characters.'
    },

    // Navigation
    'back': {
      es: 'Volver',
      en: 'Back'
    },
    'wallet.not.found': {
      es: 'Wallet no encontrada o error de API.',
      en: 'Wallet not found or API error.'
    },

    // Wallet
    'balance': {
      es: 'Balance',
      en: 'Balance'
    },
    'transactions': {
      es: 'Transacciones',
      en: 'Transactions'
    },
    'tokens': {
      es: 'Tokens',
      en: 'Tokens'
    },
    'nfts': {
      es: 'NFTs',
      en: 'NFTs'
    },
    'copy': {
      es: 'Copiar',
      en: 'Copy'
    },

    // Transactions
    'export.csv': {
      es: 'Exportar CSV',
      en: 'Export CSV'
    },
    'no.transactions': {
      es: 'No se encontraron transacciones.',
      en: 'No transactions found.'
    },
    'hash': {
      es: 'Hash',
      en: 'Hash'
    },
    'from': {
      es: 'De',
      en: 'From'
    },
    'to': {
      es: 'Para',
      en: 'To'
    },
    'value.eth': {
      es: 'Valor (ETH)',
      en: 'Value (ETH)'
    },
    'status': {
      es: 'Estado',
      en: 'Status'
    },
    'time': {
      es: 'Tiempo',
      en: 'Time'
    },

    // Status
    'confirmed': {
      es: 'Confirmada',
      en: 'Confirmed'
    },
    'pending': {
      es: 'Pendiente',
      en: 'Pending'
    },
    'failed': {
      es: 'Fallida',
      en: 'Failed'
    },

    // Tokens
    'no.tokens': {
      es: 'No se encontraron tokens.',
      en: 'No tokens found.'
    },
    'token': {
      es: 'Token',
      en: 'Token'
    },
    'amount': {
      es: 'Cantidad',
      en: 'Amount'
    },
    'price': {
      es: 'Precio',
      en: 'Price'
    },

    // NFTs
    'no.nfts': {
      es: 'No se encontraron NFTs.',
      en: 'No NFTs found.'
    },
    'collection': {
      es: 'Colección',
      en: 'Collection'
    },
    'name': {
      es: 'Nombre',
      en: 'Name'
    },

    // Languages
    'spanish': {
      es: 'Español',
      en: 'Spanish'
    },
    'english': {
      es: 'Inglés',
      en: 'English'
    }
  };

  constructor() {
    this.loadLanguage();
  }

  translate(key: string): string {
    const translation = this.translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[this.currentLanguage()];
  }

  setLanguage(lang: Language): void {
    this.currentLanguage.set(lang);
    this.saveLanguage();
  }

  private saveLanguage(): void {
    localStorage.setItem(this.STORAGE_KEY, this.currentLanguage());
  }

  private loadLanguage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY) as Language;
      if (stored && ['es', 'en'].includes(stored)) {
        this.currentLanguage.set(stored);
      }
    } catch (e) {
      console.error('Error loading language:', e);
    }
  }
}
