import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApartmentListing } from '../../models/apartment-listing';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../service/toast.service';
import { DecimalPipe, Location } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { rentSale } from '../../models/rent-sale';

@Component({
  selector: 'app-my-listing-details',
  standalone: true,
  imports: [ToastModule, DecimalPipe, TranslateModule],
  template: `
    <div class="listing-backdrop"></div>
    <p-toast></p-toast>
    <div class="listing-content">
      <button class="close-button" (click)="closeTab()">✕</button>
      <h2>{{ 'listingDetails.title' | translate }}</h2>
      <div class="listing-info-container">
        <div class="info-item">
          <span class="label">{{ 'listingDetails.listingName' | translate }}:</span>
          <span>{{ listing.listingName }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ 'listingDetails.address' | translate }}:</span>
          <span>{{ listing.address }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ 'listingDetails.age' | translate }}:</span>
          <span>{{ listing.age }} {{ 'listingDetails.years' | translate }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ 'listingDetails.roomNumber' | translate }}:</span>
          <span>{{ listing.roomNumber }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ 'listingDetails.price' | translate }}:</span>
          <span>&#8378;{{ listing.price | number: '1.0-0' }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ 'listingDetails.rentSale' | translate }}:</span>
          <span>{{ getTranslatedRentSale() }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ 'listingDetails.hasFurniture' | translate }}:</span>
          <span>{{ getTranslatedBoolean(listing.hasFurniture) }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ 'listingDetails.hasBalcony' | translate }}:</span>
          <span>{{ getTranslatedBoolean(listing.hasBalcony) }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ 'listingDetails.bathroomNumber' | translate }}:</span>
          <span>{{ listing.bathroomNumber }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ 'listingDetails.homeSquareMeter' | translate }}:</span>
          <span>{{ listing.homeSquareMeter }} m²</span>
        </div>
        <div class="info-item">
          <span class="label">{{ 'listingDetails.lister' | translate }}:</span>
          <span>{{ listing.listerEmail ?? 'Unknown' | translate }}</span>
        </div>
      </div>
    </div>
  `,
  styleUrl: './my-listing-details.component.css',
})
export class MyListingDetailsComponent implements OnInit {
  listing: ApartmentListing;

  constructor(
    private router: Router,
    private toastService: ToastService,
    private location: Location,
    private translate: TranslateService
  ) {
    this.listing = this.router.getCurrentNavigation()?.extras.state?.['listing'];
  }

  ngOnInit(): void {
    if (this.listing == null) {
      const errorMsg = this.translate.instant('toastMessages.unableToRetrieveData');
      this.toastService.showToast('error', this.translate.instant('toastMessages.errorTitle'), errorMsg);
      this.location.back();
    }
  }

  getTranslatedRentSale(): string {
    if (this.listing.rentSale.valueOf() === rentSale.RENT) {
      return this.translate.instant('listingEdit.rentOption');
    } else if (this.listing.rentSale.valueOf() === rentSale.SALE.valueOf()) {
      return this.translate.instant('listingEdit.saleOption');
    }
    return 'Not Found'; // Fallback value
  }

  getTranslatedBoolean(boolean: boolean): string {
    if (boolean) {
      return this.translate.instant('yes');
    } else {
      return this.translate.instant('no');
    }
  }

  closeTab() {
    this.location.back();
  }
}
