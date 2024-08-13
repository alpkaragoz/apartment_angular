import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApartmentListing } from '../../models/apartment-listing';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../service/toast.service';
import { DecimalPipe, Location } from '@angular/common';

@Component({
  selector: 'app-my-listing-details',
  standalone: true,
  imports: [ToastModule, DecimalPipe],
  template: `
    <div class="listing-backdrop" (click)='closeTab()'></div>
      <p-toast></p-toast>
      <div class="listing-content">
      <button class="close-button" (click)="closeTab()">✕</button>
        <h2>Listing Details</h2>
        <div class="listing-info-container">
          <div class="info-item">
            <span class="label">Listing Name:</span>
            <span>{{ listing.listingName }}</span>
          </div>
          <div class="info-item">
            <span class="label">Address:</span>
            <span>{{ listing.address }}</span>
          </div>
          <div class="info-item">
            <span class="label">Age:</span>
            <span>{{ listing.age }} years</span>
          </div>
          <div class="info-item">
            <span class="label">Room Number:</span>
            <span>{{ listing.roomNumber }}</span>
          </div>
          <div class="info-item">
            <span class="label">Price:</span>
            <span>&#8378;{{ listing.price | number: '1.0-0' }}</span>
          </div>
          <div class="info-item">
            <span class="label">Rent or Sale:</span>
            <span>{{ listing.rentSale }}</span>
          </div>
          <div class="info-item">
            <span class="label">Has Furniture:</span>
            <span>{{ listing.hasFurniture ? 'Yes' : 'No' }}</span>
          </div>
          <div class="info-item">
            <span class="label">Has Balcony:</span>
            <span>{{ listing.hasBalcony ? 'Yes' : 'No' }}</span>
          </div>
          <div class="info-item">
            <span class="label">Bathroom Number:</span>
            <span>{{ listing.bathroomNumber }}</span>
          </div>
          <div class="info-item">
            <span class="label">Home Square Meter:</span>
            <span>{{ listing.homeSquareMeter }} m²</span>
          </div>
        </div>
    </div>
  `,
  styleUrl: './my-listing-details.component.css'
})
export class MyListingDetailsComponent implements OnInit {
  listing: ApartmentListing;

  constructor(
    private router: Router,
    private toastService: ToastService,
    private location: Location,
  ){
    this.listing = this.router.getCurrentNavigation()?.extras.state?.['listing'];
  }

  ngOnInit(): void {
    if(this.listing == null) {
      this.toastService.showToast('error', 'Error', 'Unable to retrieve data.');
      this.location.back();
    }
  }

  closeTab() {
    this.location.back();
  }
}