import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'kgFormat', standalone: true, pure: true })
export class KgFormatPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) return '—';
    if (value >= 1000) {
      return `${(value / 1000).toFixed(2)} MT`;
    }
    return `${value.toLocaleString('en-IN')} kg`;
  }
}
