import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ApartmentListing } from '../../models/apartment-listing';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listing-box',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="box" tabindex="0" (click)="onClick()" (keydown.enter)="onClick()">
      <div class="box-content">
        <span class="home-icon">🏠</span>
        <div class="listing-details">
          <div class="listing-title">{{ listing.listingName }}</div>
          <div class="listing-info">
            <div class="listing-item"><span class="label">Type:</span> {{ listing.rentSale }}</div>
            <div class="listing-item">
              <span class="label">Price:</span> &#8378;{{ listing.price | number: '1.0-0' }}
            </div>
            <div class="listing-item"><span class="label">Address:</span> {{ listing.address }}</div>
            <div class="listing-item"><span class="label">Lister:</span> {{ listing.listerEmail ?? 'Unknown' }}</div>
          </div>
        </div>
      </div>
      <ng-content></ng-content>
      <!-- This is where additional content can be projected -->
    </div>
  `,
  styleUrls: ['./listing-box.component.css'],
})
export class ListingBoxComponent {
  @Input() listing!: ApartmentListing; // Input property to receive listing data
  @Output() listingClicked = new EventEmitter<ApartmentListing>(); // Output event to notify parent when listing is clicked

  onClick() {
    this.listingClicked.emit(this.listing);
  }
}
