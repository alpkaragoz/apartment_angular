import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { ApartmentListing } from '../../models/apartment-listing';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ToastService } from '../../service/toast.service';
import { Router, RouterModule } from '@angular/router';
import { MyListingEditComponent } from "../../components/my-listing-edit/my-listing-edit.component";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-listings',
  standalone: true,
  imports: [CommonModule, ToastModule, ButtonModule, RouterModule, MyListingEditComponent],
  template: `
    <div id="main">
      <p-toast [breakpoints]="{ '920px': { width: '100%', right: '0', left: '0' } }"></p-toast>
      <div id="discover-section">
      <button class="back-button" (click)='goBack()'>< Dashboard</button>
        <h2>My Listings</h2>
        <div class="listing-boxes">
        <div class="box" *ngFor="let listing of myListings">
          <div class="box-content">
            <span class="home-icon">🏠</span>
            <div class="listing-details">
              <div class="listing-title">{{ listing.listingName }}</div>
              <div class="listing-info">
                <div class="listing-item">
                  <span class="label">Type:</span> {{ listing.rentSale }}
                </div>
                <div class="listing-item">
                  <span class="label">Price:</span> &#8378;{{ listing.price | number:'1.0-0' }}
                </div>
                <div class="listing-item">
                  <span class="label">Address:</span> {{ listing.address }}
                </div>
              </div>
            </div>
          </div>
          <p-button id="view-hover" class="edit-overlay" (click)="openDetails(listing)">Details</p-button>
          <p-button class="edit-hover" id="edit-hover" class="edit-overlay" (click)="openEdit(listing)">Edit</p-button>
        </div>
        </div>
      </div>
    </div>
    <router-outlet> </router-outlet>
  `,
  styleUrl: './my-listings.component.css'
})
export class MyListingsComponent implements OnInit, OnDestroy {
    myListings: ApartmentListing[] = [];
    private subscription: Subscription = new Subscription;

    constructor(
      private apiService: ApiService,
      private toastService: ToastService,
      private router: Router,
    ) {}

    ngOnInit(){
      this.fetchMyListings();
      this.subscription = this.apiService.listingUpdated$.subscribe(() => {
        this.fetchMyListings(); // Refresh the listings when an update occurs
      });
    }

    ngOnDestroy(): void {
      // Unsubscribe to avoid memory leaks
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }

    fetchMyListings() {
      this.apiService.getMyListings().subscribe({
        next: response => {
          this.myListings = response.body.listings;
        },
        error: err => {
          this.toastService.showToast(err.error.messageSeverity, 'Error', err.error.message);
        },
      });
    }

    goBack() {
      this.router.navigate(['/dashboard']);
    }

    openDetails (listing: ApartmentListing) {
      this.router.navigate(['/my-listings/details'], {state: {listing}});
    }

    openEdit (listing: ApartmentListing) {
      this.router.navigate(['/my-listings/edit'], {state: {listing}});
    }
}