import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form class="search-form" [formGroup]="searchGroup">
      <div>
        <label for="title">Title</label>
        <input id="title" type="text" placeholder="Cheap" formControlName="titleControl" (input)="onFilter()" />
      </div>
      <div>
        <label for="minPrice">Min Price</label>
        <input id="minPrice" type="number" placeholder="5.000" formControlName="minPriceControl" (input)="onFilter()" />
      </div>
      <div>
        <label for="maxPrice">Max Price</label>
        <input id="maxPrice" type="number" placeholder="30.000" formControlName="maxPriceControl" (input)="onFilter()" />
      </div>
      <div>
        <label for="location">Location</label>
        <input id="location" type="text" placeholder="Texas" formControlName="locationControl" (input)="onFilter()" />
      </div>
      <div>
        <label for="rentSale">Rent/Sale</label>
        <select id="rentSale" formControlName="rentSaleControl" (change)="onFilter()">
          <option value="">All</option>
          <option value="RENT">Rent</option>
          <option value="SALE">Sale</option>
        </select>
      </div>
    </form>
  `,
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent {
  searchGroup = new FormGroup({
    titleControl: new FormControl(''),
    minPriceControl: new FormControl(''),
    maxPriceControl: new FormControl(''),
    locationControl: new FormControl(''),
    rentSaleControl: new FormControl(''),
  });

  @Output() filter = new EventEmitter<FormGroup>();

  onFilter() {
    this.filter.emit(this.searchGroup);
  }
}
