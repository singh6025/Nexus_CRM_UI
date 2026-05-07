import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy,
  OnChanges, SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';

export interface TableColumn<T = Record<string, unknown>> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'badge' | 'date' | 'currency' | 'link' | 'actions' | 'custom';
  badgeVariant?: (row: T) => string;
  routerLink?: (row: T) => string[];
  format?: (row: T) => string;
  width?: string;
}

export interface TableAction<T = Record<string, unknown>> {
  label: string;
  icon: string;
  action: (row: T) => void;
  danger?: boolean;
  hidden?: (row: T) => boolean;
}

@Component({
  selector: 'ui-data-table',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatTableModule, MatSortModule,
    MatPaginatorModule, MatIconModule, MatButtonModule, MatMenuModule,
    MatProgressBarModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent<T extends Record<string, unknown>> implements OnChanges {
  @Input() columns: TableColumn<T>[] = [];
  @Input() data: T[] = [];
  @Input() total = 0;
  @Input() page = 0;
  @Input() pageSize = 10;
  @Input() loading = false;
  @Input() actions: TableAction<T>[] = [];
  @Input() rowClickable = false;
  @Input() emptyMessage = 'No records found';

  @Output() sortChange = new EventEmitter<Sort>();
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() rowClick = new EventEmitter<T>();

  displayedColumns: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns'] || changes['actions']) {
      this.displayedColumns = [
        ...this.columns.map((c) => String(c.key)),
        ...(this.actions.length ? ['__actions'] : []),
      ];
    }
  }

  getCellValue(row: T, col: TableColumn<T>): unknown {
    if (col.format) return col.format(row);
    return row[col.key as keyof T];
  }

  visibleActions(row: T): TableAction<T>[] {
    return this.actions.filter((a) => !a.hidden?.(row));
  }

  trackByIndex(index: number): number {
    return index;
  }
}
