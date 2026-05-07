import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'crm-not-found',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, MatButtonModule, MatIconModule],
  template: `
    <div class="nf">
      <mat-icon class="nf-icon">search_off</mat-icon>
      <h1>404 – Page Not Found</h1>
      <p>The page you are looking for doesn't exist.</p>
      <button mat-raised-button color="primary" routerLink="/dashboard">
        <mat-icon>home</mat-icon> Go to Dashboard
      </button>
    </div>
  `,
  styles: [`
    .nf { display: flex; flex-direction: column; align-items: center; justify-content: center;
      min-height: 100vh; gap: 16px; text-align: center; padding: 24px; }
    .nf-icon { font-size: 80px; width: 80px; height: 80px; color: var(--border-color); }
    h1 { font-size: 28px; margin: 0; }
    p { color: var(--text-secondary); margin: 0; }
  `],
})
export class NotFoundComponent {}
