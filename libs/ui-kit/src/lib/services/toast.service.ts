import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly snackBar = inject(MatSnackBar);

  show(message: string, type: ToastType = 'info', duration = 4000): void {
    this.snackBar.open(message, 'Dismiss', {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [`toast-${type}`],
    });
  }

  success(message: string): void { this.show(message, 'success'); }
  error(message: string, duration = 6000): void { this.show(message, 'error', duration); }
  info(message: string): void { this.show(message, 'info'); }
  warning(message: string): void { this.show(message, 'warning'); }
}
