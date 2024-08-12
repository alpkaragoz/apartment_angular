import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../../service/api.service';
import { ApartmentListing } from '../../models/apartment-listing';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterOutlet],
  providers: [DecimalPipe],
  template: `
      <div id="dashboard-container">
        <div class="top-bar">
          <button (click)="openAddListing()" class="top-bar-button">+</button>
          <button (click)="myListings()" class="top-bar-button">My Listings</button>
          <button (click)="logout()" class="logout-button">Log Out</button>
        </div>
        <h1>Welcome to the Dashboard!</h1>
        <div class="search-bar">
          <div>
            <label for="title">Title</label>
            <input id="title" type="text" placeholder="Cheap" [formControl]="searchControl" />
          </div>
          <div>
            <label for="minPrice">Min Price</label>
            <input id="minPrice" type="number" placeholder="5.000" [formControl]="minPriceControl" />
          </div>
          <div>
            <label for="maxPrice">Max Price</label>
            <input id="maxPrice" type="number" placeholder="30.000" [formControl]="maxPriceControl" />
          </div>
          <div>
            <label for="location">Location</label>
            <input id="location" type="text" placeholder="Texas" [formControl]="locationControl" />
          </div>
          <div>
            <label for="rentSale">Rent/Sale</label>
            <select id="rentSale" [formControl]="rentSaleControl">
              <option value="">All</option>
              <option value="RENT">Rent</option>
              <option value="SALE">Sale</option>
            </select>
          </div>
        </div>
        <div id="discover-section">
          <h2>Discover</h2>
          <div class="listing-boxes">
            <div class="box" *ngFor="let listing of filteredListings" (click)="openListingDetails(listing)">
              <span class="home-icon">🏠</span>
              <div class="listing-details">
                <div class="listing-title">{{ listing.listingName }}</div>
                <div class="listing-info">
                  <div>{{ listing.rentSale }}</div>
                  <div>&#8378;{{ listing.price | number:'1.0-0'}}</div>
                  <div>{{ listing.address }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="pagination">
          <button (click)="prevPage()" [disabled]="currentPage === 1">Back</button>
          <span>Page {{ currentPage }}</span>
          <button (click)="nextPage()" [disabled]="currentPage === totalPages">Next</button>
        </div>
        <ng-template #listingContainer></ng-template>
        <router-outlet></router-outlet>
      </div>
  `,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private subscriptions = new Subscription();
  listings: ApartmentListing[] = [];
  filteredListings: ApartmentListing[] = [];
  currentPage = 1;
  listingsPerPage = 100;
  totalPages = 1;

  private fb: FormBuilder = new FormBuilder();
  searchControl: FormControl = this.fb.control('');
  minPriceControl: FormControl = this.fb.control('');
  maxPriceControl: FormControl = this.fb.control('');
  locationControl: FormControl = this.fb.control('');
  rentSaleControl: FormControl = this.fb.control('');

  constructor(
    private router: Router,
    private apiService: ApiService,
  ) {}

  ngOnInit() {
    this.fetchApartmentList();
    this.subscriptions.add(this.searchControl.valueChanges.subscribe(() => this.updateFilteredListings()));
    this.subscriptions.add(this.minPriceControl.valueChanges.subscribe(() => this.updateFilteredListings()));
    this.subscriptions.add(this.maxPriceControl.valueChanges.subscribe(() => this.updateFilteredListings()));
    this.subscriptions.add(this.locationControl.valueChanges.subscribe(() => this.updateFilteredListings()));
    this.subscriptions.add(this.rentSaleControl.valueChanges.subscribe(() => this.updateFilteredListings()));
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this.subscriptions.unsubscribe();
  }

  fetchApartmentList() {
    this.apiService.getApartmentList().subscribe((data: ApartmentListing[]) => {
      this.listings = data;
      this.totalPages = Math.ceil(this.listings.length / this.listingsPerPage);
      this.updateFilteredListings();
    });
  }

  updateFilteredListings() {
    let filtered = this.listings;

    const searchTerm = this.searchControl.value.toLowerCase();
    const minPrice = this.minPriceControl.value;
    const maxPrice = this.maxPriceControl.value;
    const location = this.locationControl.value.toLowerCase();
    const rentSale = this.rentSaleControl.value;

    if (searchTerm) {
      filtered = filtered.filter((listing) =>
        listing.listingName.toLowerCase().includes(searchTerm)
      );
    }

    if (minPrice) {
      filtered = filtered.filter((listing) => listing.price >= minPrice);
    }

    if (maxPrice) {
      filtered = filtered.filter((listing) => listing.price <= maxPrice);
    }

    if (location) {
      filtered = filtered.filter((listing) =>
        listing.address.toLowerCase().includes(location)
      );
    }

    if (rentSale) {
      filtered = filtered.filter((listing) => listing.rentSale === rentSale);
    }

    this.totalPages = Math.ceil(filtered.length / this.listingsPerPage);
    const startIndex = (this.currentPage - 1) * this.listingsPerPage;
    this.filteredListings = filtered.slice(startIndex, startIndex + this.listingsPerPage);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateFilteredListings();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateFilteredListings();
    }
  }

  logout() {
    this.apiService.removeToken();
    this.router.navigate(['/']);
  }

  openListingDetails(listing: ApartmentListing) {
    this.router.navigate(['dashboard/listing-details'], {state: {listing}});
  }

  openAddListing() {
    this.router.navigate(["dashboard/add-listing"]);
  }

  myListings() {
    this.router.navigate(['/my-listings']);
  }
}