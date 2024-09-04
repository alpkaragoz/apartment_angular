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
import { TranslateModule } from '@ngx-translate/core';
import { rentSale } from '../../models/rent-sale';

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
    TranslateModule,
  ],
  providers: [],
  template: `
    <p-toast />
    <div id="dashboard-container">
      <app-top-bar
        (addListing)="openAddListing()"
        (logout)="logout()"
        (myListings)="openMyListings()"
        (dataPanel)="openDataPanel()"
      />
      <h2>{{ 'loginWelcome' | translate }}</h2>
      <div id="discover-section">
        <app-search-bar (filter)="filterListings($event)" />
        <h3>{{ 'discover' | translate }}</h3>
        <div class="listing-boxes">
          <app-listing-box
            *ngFor="let listing of listingsOnCurrentPage"
            [listing]="listing"
            [likedListings]="likedListings"
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
  listingsOnCurrentPage: ApartmentListing[] = [];
  currentPage = 1;
  listingsPerPage = 12;
  totalPages = 1;
  rentOrSale: rentSale | undefined;
  minPrice = 0;
  maxPrice = Infinity;
  address = '';
  listingName = '';
  likedListings: Set<number> = new Set<number>();

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.fetchApartmentList();
    this.fetchLikedListings();
    this.subscriptions.add(
      this.apiService.listingUpdated$.subscribe(() => {
        this.fetchApartmentList();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  fetchApartmentList(page = 0) {
    this.apiService
      .getFilteredApartmentListings(
        this.rentOrSale,
        this.minPrice,
        this.maxPrice,
        this.address,
        this.listingName,
        page,
        this.listingsPerPage
      )
      .subscribe((response) => {
        if (response.body != null) {
          this.listingsOnCurrentPage = response.body.listings;
          this.totalPages = response.body.totalPages;
        }
      });
  }

  fetchLikedListings() {
    this.apiService.getLikedListings().subscribe({
      next: (likedListingIds) => {
        this.likedListings = new Set(likedListingIds);
      },
      error: (error) => {
        console.error('Failed to fetch liked listings', error);
      },
    });
  }

  filterListings(filterValues: FormGroup) {
    this.listingName = filterValues.value.titleControl?.toLowerCase() || '';
    this.minPrice = filterValues.value.minPriceControl || 0;
    this.maxPrice = filterValues.value.maxPriceControl || Infinity;
    this.address = filterValues.value.locationControl?.toLowerCase() || '';
    this.rentOrSale = filterValues.value.rentSaleControl || '';

    this.currentPage = 1; // Reset to the first page
    this.apiService
      .getFilteredApartmentListings(
        this.rentOrSale,
        this.minPrice,
        this.maxPrice,
        this.address,
        this.listingName,
        this.currentPage - 1,
        this.listingsPerPage
      )
      .subscribe((response) => {
        if (response.body != null) {
          this.listingsOnCurrentPage = response.body.listings;
          this.totalPages = response.body.totalPages;
        }
      });
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchApartmentList(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchApartmentList(this.currentPage - 1);
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

  openDataPanel() {
    this.router.navigate(['/data-panel']);
  }
}
