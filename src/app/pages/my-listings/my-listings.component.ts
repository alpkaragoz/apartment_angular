import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { ApartmentListing } from '../../models/apartment-listing';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ToastService } from '../../service/toast.service';
import { Router, RouterModule } from '@angular/router';
import { MyListingEditComponent } from '../my-listing-edit/my-listing-edit.component';
import { Subscription } from 'rxjs';
import { ListingBoxComponent } from '../../components/listing-box/listing-box.component';

@Component({
  selector: 'app-my-listings',
  standalone: true,
  imports: [CommonModule, ToastModule, ButtonModule, RouterModule, MyListingEditComponent, ListingBoxComponent],
  template: `
    <div id="main">
      <p-toast [breakpoints]="{ '920px': { width: '100%', right: '0', left: '0' } }"></p-toast>
      <div id="discover-section">
        <button class="back-button" (click)="goBack()">< Dashboard</button>
        <h2>My Listings</h2>
        <div class="listing-boxes">
          <app-listing-box class="box" *ngFor="let listing of myListings" [listing]="listing">
            <div class="edit-overlay">
              <p-button id="view-hover" (click)="openDetails(listing)">Details</p-button>
              <p-button id="edit-hover" (click)="openEdit(listing)">Edit</p-button>
            </div>
          </app-listing-box>
        </div>
      </div>
      <router-outlet> </router-outlet>
    </div>
  `,
  styleUrl: './my-listings.component.css',
})
export class MyListingsComponent implements OnInit, OnDestroy {
  myListings: ApartmentListing[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private apiService: ApiService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchMyListings();
    this.subscription = this.apiService.listingUpdated$.subscribe(() => {
      this.fetchMyListings(); // Refresh the listings when an update occurs
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  fetchMyListings() {
    this.apiService.getMyListings().subscribe({
      next: (response) => {
        if (response.status === 200 && response.body != null) {
          this.myListings = response.body.listings;
        }
      },
      error: (err) => {
        this.toastService.showToast(err.error.messageSeverity, 'Error', err.error.message);
      },
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  openDetails(listing: ApartmentListing) {
    this.router.navigate(['/my-listings/details'], { state: { listing } });
  }

  openEdit(listing: ApartmentListing) {
    this.router.navigate(['/my-listings/edit'], { state: { listing } });
  }
}
