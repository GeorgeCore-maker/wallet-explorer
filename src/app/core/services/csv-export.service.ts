import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CsvExportService {

  exportToCsv<T extends Record<string, any>>(
    data: T[],
    filename: string,
    columns?: { key: keyof T; header: string }[]
  ): void {
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    // Si no se especifican columnas, usar todas las propiedades del primer objeto
    const cols = columns || Object.keys(data[0]).map(key => ({ key, header: key }));

    // Crear headers CSV
    const headers = cols.map(col => col.header).join(',');

    // Crear filas CSV
    const rows = data.map(item =>
      cols.map(col => {
        const value = item[col.key];
        // Escapar valores que contengan comas o comillas
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      }).join(',')
    );

    // Combinar headers y filas
    const csvContent = [headers, ...rows].join('\n');

    // Crear y descargar archivo
    this.downloadFile(csvContent, filename);
  }

  private downloadFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }
}
