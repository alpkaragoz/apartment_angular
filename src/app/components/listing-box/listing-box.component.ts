import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ApartmentListing } from '../../models/apartment-listing';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { rentSale } from '../../models/rent-sale';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../service/api.service';
import { ToastService } from '../../service/toast.service';

@Component({
  selector: 'app-listing-box',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="box" tabindex="0" (click)="onClick()" (keydown.enter)="onClick()">
      <div class="box-content">
        <span class="home-icon">🏠</span>
        <div class="listing-details">
          <div class="listing-title">{{ listing.listingName }}</div>
          <div class="listing-info">
            <div class="listing-item">
              <span class="label">{{ 'listingBox.type' | translate }}</span> {{ getTranslatedRentSale() }}
            </div>
            <div class="listing-item">
              <span class="label">{{ 'listingBox.price' | translate }}</span> &#8378;{{
                listing.price | number: '1.0-0'
              }}
            </div>
            <div class="listing-item">
              <span class="label">{{ 'listingBox.address' | translate }}</span> {{ listing.address }}
            </div>
            <div class="listing-item">
              <span class="label">{{ 'listingBox.lister' | translate }}</span>
              {{ listing.listerEmail ?? ('listingBox.unknown' | translate) }}
            </div>
          </div>
        </div>
        <span class="like-icon" (click)="toggleLike($event)" (keydown)="toggleLike($event)" tabindex="1">
          <i [ngClass]="isLiked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
        </span>
      </div>
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./listing-box.component.css'],
})
export class ListingBoxComponent implements OnInit {
  @Input() listing!: ApartmentListing;
  @Input() likedListings?: Set<number>;
  @Output() listingClicked = new EventEmitter<ApartmentListing>();
  isLiked = false;

  constructor(
    private translate: TranslateService,
    private apiService: ApiService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.isLiked = this.likedListings?.has(this.listing.id) ?? false; // Check if the listing is liked
  }

  onClick() {
    this.listingClicked.emit(this.listing);
  }

  toggleLike(event: Event) {
    event.stopPropagation();
    if (this.isLiked) {
      this.apiService.removeFavorite(this.listing.id).subscribe({
        next: () => {
          this.toastService.showToast(
            'success',
            this.translate.instant('toastMessages.successTitle'),
            this.translate.instant('toastMessages.favoritesUpdate')
          );
        },
        error: () => {
          this.toastService.showToast(
            'error',
            this.translate.instant('toastMessages.errorTitle'),
            this.translate.instant('toastMessages.genericError')
          );
        },
      });
    } else {
      this.apiService.addFavorite(this.listing.id).subscribe({
        next: () => {
          this.toastService.showToast(
            'success',
            this.translate.instant('toastMessages.successTitle'),
            this.translate.instant('toastMessages.favoritesUpdate')
          );
        },
        error: () => {
          this.toastService.showToast(
            'error',
            this.translate.instant('toastMessages.errorTitle'),
            this.translate.instant('toastMessages.genericError')
          );
        },
      });
    }
    this.isLiked = !this.isLiked;
  }

  getTranslatedRentSale(): string {
    if (this.listing.rentSale.valueOf() === rentSale.RENT) {
      return this.translate.instant('listingEdit.rentOption');
    } else if (this.listing.rentSale.valueOf() === rentSale.SALE.valueOf()) {
      return this.translate.instant('listingEdit.saleOption');
    }
    return 'Not Found'; // Fallback value
  }
}
