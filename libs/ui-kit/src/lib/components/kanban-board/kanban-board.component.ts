import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterModule } from '@angular/router';

export interface KanbanLane<T extends Record<string, unknown> = Record<string, unknown>> {
  id: string;
  label: string;
  color: string;
  items: T[];
  totalValue?: number;
}

export interface KanbanDropEvent<T> {
  item: T;
  fromLaneId: string;
  toLaneId: string;
  newIndex: number;
}

@Component({
  selector: 'ui-kanban-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatCardModule, MatIconModule, MatButtonModule, MatBadgeModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kanban-board.component.html',
  styleUrl: './kanban-board.component.scss',
})
export class KanbanBoardComponent<T extends Record<string, unknown>> {
  @Input() lanes: KanbanLane<T>[] = [];
  @Input() titleKey = 'title';
  @Input() subtitleKey = 'subtitle';
  @Input() valueKey: string | null = null;
  @Input() routerLinkFn: ((item: T) => string[]) | null = null;

  @Output() dropped = new EventEmitter<KanbanDropEvent<T>>();

  get laneIds(): string[] {
    return this.lanes.map((l) => l.id);
  }

  onDrop(event: CdkDragDrop<T[]>, toLane: KanbanLane<T>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }

    const fromLane = this.lanes.find((l) => l.items === event.previousContainer.data);
    if (!fromLane) return;

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    this.dropped.emit({
      item: event.item.data as T,
      fromLaneId: fromLane.id,
      toLaneId: toLane.id,
      newIndex: event.currentIndex,
    });
  }
}
