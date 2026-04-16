# 🔍 Wallet Explorer

**Explorador de wallets en Ethereum mainnet** — Aplicación Web3 para buscar, visualizar y analizar wallets usando la API de Blockscout sin autenticación.

## 🎯 Características

- ✅ Búsqueda de direcciones Ethereum con validación
- ✅ **Historial de búsquedas** (últimas 10, almacenado en localStorage)
- ✅ Saldo en ETH y contador de transacciones
- ✅ Listado de transacciones recientes con estado (confirmada/pendiente/fallida)
- ✅ **Paginación de transacciones** (10, 25, 50 items/página)
- ✅ **Exportar datos a CSV** (transacciones y tokens)
- ✅ Visualización de tokens ERC-20 con balance en decimales
- ✅ Galería de NFTs asociados
- ✅ Links directos a Etherscan
- ✅ Copiar dirección/hash al clipboard
- ✅ **Dark mode elegante** con alto contraste
- ✅ Diseño responsive con Tailwind CSS + Angular Material

## 🛠️ Stack Tecnológico

| Tecnología | Versión |
|---|---|
| **Angular** | 18+ (Standalone Components) |
| **TypeScript** | Tipado Estricto |
| **Tailwind CSS** | Diseño Responsivo |
| **Angular Material** | Componentes UI |
| **RxJS** | Manejo Asincrónico |
| **Blockscout API** | v2 (Ethereum Mainnet) |
| **Node.js** | 18.20.8 |

## Ruta del proyecto:

https://georgecore-maker.github.io/wallet-explorer/

## 🧪 Tokens de Prueba

Usa estas direcciones para probar la aplicación:

### Wallets Populares
| Tipo | Dirección | Descripción |
|------|-----------|-------------|
| **Vitalik Buterin** | `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045` | Wallet del fundador de Ethereum con alta actividad |
| **Binance Hot Wallet** | `0x28C6c06298d514Db089934071355E5743bf21d60` | Exchange principal con miles de transacciones |
| **OpenSea** | `0x5b3256365E7B4269B2c4Aa9cF4622324372C9c7c` | Marketplace de NFTs con colecciones variadas |

### Contratos Inteligentes
| Tipo | Dirección | Descripción |
|------|-----------|-------------|
| **USDT** | `0xdAC17F958D2ee523a2206206994597C13D831ec7` | Stablecoin más usado, ideal para ver tokens |
| **Uniswap V3** | `0x1F98431c8aD98523631AE4a59f267346ea31F984` | Factory del DEX más popular |
| **BAYC** | `0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D` | NFT collection premium |

### Wallets con NFTs
| Tipo | Dirección | Descripción |
|------|-----------|-------------|
| **Collector** | `0x9f8c163cBA728e99993ABe7495F06c0A3c8Ac8b9` | Wallet con múltiples NFTs y colecciones |
| **Artist** | `0x3B3525F60eCf214eCa2aB1C3cFaf5f51C2A8C59B` | Creador activo con obras diversas |

## 📁 Estructura del Proyecto

```
src/app/
├── core/
│   ├── models/
│   │   ├── address.model.ts
│   │   ├── transaction.model.ts
│   │   ├── token.model.ts
│   │   └── nft.model.ts
│   └── services/
│       └── blockscout.service.ts
├── features/
│   ├── search/
│   │   └── search.component.ts
│   └── wallet/
│       ├── wallet.component.ts
│       ├── transactions/transactions.component.ts
│       ├── tokens/tokens.component.ts
│       └── nfts/nfts.component.ts
└── shared/
    ├── components/
    │   └── status-badge/status-badge.component.ts
    └── pipes/
        └── wei-to-eth.pipe.ts
```

## 🚀 Instalación y Setup

### Requisitos
- Node.js 18.20.8+
- npm o yarn

### Pasos

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd wallet-explorer

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm start

# 4. Abrir en navegador
# http://localhost:4200
```

## 🧪 Pruebas

```bash
# Ejecutar tests unitarios
npm test
```

## 📚 Endpoints Blockscout Utilizados

| Endpoint | Descripción |
|---|---|
| `GET /addresses/:hash` | Info de wallet (saldo, tx count, is_contract) |
| `GET /addresses/:hash/transactions` | Transacciones recientes |
| `GET /addresses/:hash/token-balances` | Tokens ERC-20 |
| `GET /addresses/:hash/nft` | NFTs asociados |

## 🎨 Componentes Principales

### `SearchComponent`
- Validación de dirección Ethereum con regex
- Navegación a `/wallet/:address`

### `WalletComponent`
- Display de información de wallet
- Tabs para Transacciones, Tokens y NFTs
- Copiar dirección al clipboard

### `TransactionsComponent`
- Tabla de transacciones con paginación (10, 25, 50 items)
- Caché de páginas para navegación rápida
- **Exportar a CSV** con todos los detalles
- Status badge (confirmada/pendiente/fallida)
- Links a Etherscan
- Copiar hash al clipboard

### `TokensComponent`
- Lista de tokens ERC-20
- **Exportar a CSV** con balance formateado
- Conversión Wei → ETH con pipe reutilizable
- Balance formateado según decimals

### `NftsComponent`
- Galería de NFTs
- Imagen y metadata

## 🔧 Pipes y Servicios

### `WeiToEthPipe`
Convierte valores Wei a ETH con decimales personalizables:
```typescript
{{ valor | weiToEth: decimals : 4 }}
```

### `StatusBadgeComponent`
Badge reutilizable con estados:
```typescript
<app-status-badge [status]="'confirmed'" />
```

### `CsvExportService`
Servicio utilitario para exportar datos a CSV:
- Manejo automático de escape de caracteres especiales
- Headers personalizables
- Descarga automática de archivo
```typescript
this.csvExport.exportToCsv(data, filename, [
  { key: 'hash', header: 'Transaction Hash' },
  { key: 'value_eth', header: 'Value (ETH)' }
]);
```

### `SearchHistoryService`
Maneja historial de búsquedas con localStorage:
- Últimas 10 búsquedas
- Sin duplicados
- Limpiar historial
```typescript
constructor() {
  this.historyService = inject(SearchHistoryService);
}
this.historyService.addSearch(address);
this.historyService.clearHistory();
```

### `BlockscoutService`
Centraliza todas las llamadas a la API:
```typescript
getTokens(address: string): Observable<TokenBalance[]>
getTransactions(address: string): Observable<{ items: Transaction[] }>
```

## 📋 Roadmap Futuro

- [x] Paginación en transacciones
- [x] Historial de búsquedas
- [x] Exportar datos a CSV
- [ ] Dark mode toggle
- [ ] Gráficos de actividad
- [ ] Soporte multi-chain
- [ ] Watchlist de wallets

## 📝 Licencia

MIT

## 👨‍💻 Autor

GeorgeCore-maker — 2026

