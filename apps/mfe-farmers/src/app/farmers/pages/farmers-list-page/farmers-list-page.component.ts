import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'farmers-farmers-list-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Farmers</h1>
      </div>
      <p style="color: var(--color-text-secondary)">This module is under development.</p>
    </div>
  `,
  styles: ['.page-container{padding:24px}.page-header{margin-bottom:16px}.page-title{font-size:24px;font-weight:700;margin:0}'],
})
export class FarmersListPageComponent {}
