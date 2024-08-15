import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  template: `
    <div class="pagination">
      <button (click)="prevPage()">Back</button>
      <span>Page {{ currentPage }}</span>
      <button (click)="nextPage()">Next</button>
    </div>
  `,
  styleUrl: './pagination.component.css',
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
