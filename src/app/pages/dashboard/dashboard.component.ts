import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { ApartmentListing } from '../../models/apartment-listing';
import { Subscription } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { ListingBoxComponent } from '../../components/listing-box/listing-box.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { TopBarComponent } from '../../components/top-bar/top-bar.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ToastModule,
    ListingBoxComponent,
    SearchBarComponent,
    TopBarComponent,
    PaginationComponent,
  ],
  providers: [],
  template: `
    <p-toast />
    <div id="dashboard-container">
      <app-top-bar (addListing)="openAddListing()" (logout)="logout()" (myListings)="openMyListings()" />
      <h2>Welcome to the Dashboard!</h2>
      <div id="discover-section">
        <app-search-bar (filter)="filterListings($event)" />
        <h3>Discover</h3>
        <div class="listing-boxes">
          <app-listing-box
            *ngFor="let listing of listingsOnCurrentPage"
            [listing]="listing"
            (listingClicked)="openListingDetails($event)"
          >
          </app-listing-box>
        </div>
      </div>
      <app-pagination [currentPage]="currentPage" (nextEmitter)="nextPage()" (prevEmitter)="prevPage()" />
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  listings: ApartmentListing[] = [];
  filteredListings: ApartmentListing[] = [];
  listingsOnCurrentPage: ApartmentListing[] = [];
  currentPage = 1;
  listingsPerPage = 6;
  totalPages = 1;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.fetchApartmentList();
    this.subscriptions.add(
      this.apiService.listingUpdated$.subscribe(() => {
        this.fetchApartmentList();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  fetchApartmentList() {
    this.apiService.getApartmentList().subscribe((data: ApartmentListing[]) => {
      this.listings = data;
      this.filteredListings = data;
      this.paginateListings();
    });
  }

  paginateListings() {
    this.totalPages = Math.ceil(this.filteredListings.length / this.listingsPerPage);
    const startIndex = (this.currentPage - 1) * this.listingsPerPage;
    this.listingsOnCurrentPage = this.filteredListings.slice(startIndex, startIndex + this.listingsPerPage);
  }

  filterListings(filterValues: FormGroup) {
    let filtered = this.listings;

    if (filterValues) {
      const searchTerm = filterValues.value.titleControl?.toLowerCase() || '';
      const minPrice = filterValues.value.minPriceControl || 0;
      const maxPrice = filterValues.value.maxPriceControl || Infinity;
      const location = filterValues.value.locationControl?.toLowerCase() || '';
      const rentSale = filterValues.value.rentSaleControl || '';

      if (searchTerm) {
        filtered = filtered.filter((listing) => listing.listingName.toLowerCase().includes(searchTerm));
      }

      if (minPrice) {
        filtered = filtered.filter((listing) => listing.price >= minPrice);
      }

      if (maxPrice) {
        filtered = filtered.filter((listing) => listing.price <= maxPrice);
      }

      if (location) {
        filtered = filtered.filter((listing) => listing.address.toLowerCase().includes(location));
      }

      if (rentSale) {
        filtered = filtered.filter((listing) => listing.rentSale === rentSale);
      }
    }

    this.filteredListings = filtered;
    this.currentPage = 1;
    this.paginateListings();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateListings();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateListings();
    }
  }

  logout() {
    this.apiService.removeToken();
    this.router.navigate(['/']);
  }

  openListingDetails(listing: ApartmentListing) {
    this.router.navigate(['dashboard/listing-details'], { state: { listing } });
  }

  openAddListing() {
    this.router.navigate(['dashboard/add-listing']);
  }

  openMyListings() {
    this.router.navigate(['/my-listings']);
  }
}
