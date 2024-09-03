import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, DecimalPipe, CommonModule, FormsModule],
  template: `
    <form class="search-form" [formGroup]="searchGroup">
      <div>
        <label for="title">{{ 'searchBar.title' | translate }}</label>
        <input
          id="title"
          type="text"
          [placeholder]="'searchBar.placeholders.title' | translate"
          formControlName="titleControl"
          (input)="onFilter()"
        />
      </div>
      <div>
        <label for="minPrice">{{ 'searchBar.minPrice' | translate }}</label>
        <input
          id="minPrice"
          type="number"
          [placeholder]="'searchBar.placeholders.minPrice' | translate"
          formControlName="minPriceControl"
          (input)="onFilter()"
        />
      </div>
      <div>
        <label for="maxPrice">{{ 'searchBar.maxPrice' | translate }}</label>
        <input
          id="maxPrice"
          type="number"
          value="{{ searchGroup.get('maxPriceControl')?.value | number: '1.0-0' }}"
          [placeholder]="'searchBar.placeholders.maxPrice' | translate"
          formControlName="maxPriceControl"
          (input)="onFilter()"
        />
      </div>
      <div>
        <label for="location">{{ 'searchBar.location' | translate }}</label>
        <input
          id="location"
          type="text"
          [placeholder]="'searchBar.placeholders.location' | translate"
          formControlName="locationControl"
          (input)="onFilter()"
        />
      </div>
      <div>
        <label for="rentSale">{{ 'searchBar.rentSale' | translate }}</label>
        <select id="rentSale" formControlName="rentSaleControl" (change)="onFilter()">
          <option value="">{{ 'searchBar.options.all' | translate }}</option>
          <option value="RENT">{{ 'searchBar.options.rent' | translate }}</option>
          <option value="SALE">{{ 'searchBar.options.sale' | translate }}</option>
        </select>
      </div>
    </form>
  `,
  styleUrls: ['./search-bar.component.css'],
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
  value1 = 0;

  onFilter() {
    this.filter.emit(this.searchGroup);
  }
}
