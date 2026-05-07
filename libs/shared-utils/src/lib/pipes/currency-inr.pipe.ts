import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyInr', standalone: true, pure: true })
export class CurrencyInrPipe implements PipeTransform {
  transform(value: number | null | undefined, showPaise = false): string {
    if (value === null || value === undefined) return '—';
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: showPaise ? 2 : 0,
      maximumFractionDigits: showPaise ? 2 : 0,
    }).format(value);
    return formatted;
  }
}
