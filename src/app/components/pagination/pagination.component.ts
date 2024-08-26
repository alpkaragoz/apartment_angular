import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <div class="pagination">
      <button (click)="prevPage()">{{ 'pagination.back' | translate }}</button>
      <span>{{ 'pagination.page' | translate }} {{ currentPage }}</span>
      <button (click)="nextPage()">{{ 'pagination.next' | translate }}</button>
    </div>
  `,
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent {
  @Output() nextEmitter = new EventEmitter();
  @Output() prevEmitter = new EventEmitter();
  @Input() currentPage!: number;

  prevPage() {
    this.prevEmitter.emit();
  }

  nextPage() {
    this.nextEmitter.emit();
  }
}
