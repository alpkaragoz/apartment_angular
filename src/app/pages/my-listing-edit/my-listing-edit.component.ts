import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApartmentListing } from '../../models/apartment-listing';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../service/toast.service';
import { CommonModule, DecimalPipe, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { ButtonModule } from 'primeng/button';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-my-listing-edit',
  standalone: true,
  imports: [ToastModule, DecimalPipe, MatIconModule, CommonModule, ReactiveFormsModule, ButtonModule, TranslateModule],
  template: `
    <div class="listing-backdrop"></div>
    <p-toast></p-toast>
    <div class="listing-content">
      <button class="close-button" (click)="closeTab()">✕</button>
      <h2>{{ 'listingEdit.editDetailsTitle' | translate }}</h2>
      <div class="listing-info-container">
        <form [formGroup]="listingForm">
          <div class="info-item">
            <label for="listingName">{{ 'listingEdit.listingNameLabel' | translate }}</label>
            <input id="listingName" formControlName="listingName" />
          </div>
          <div class="info-item">
            <label for="address">{{ 'listingEdit.addressLabel' | translate }}</label>
            <input id="address" formControlName="address" />
          </div>
          <div class="info-item">
            <label for="age">{{ 'listingEdit.ageLabel' | translate }}</label>
            <input id="age" type="number" formControlName="age" />
          </div>
          <div class="info-item">
            <label for="roomNumber">{{ 'listingEdit.roomNumberLabel' | translate }}</label>
            <input id="roomNumber" type="number" formControlName="roomNumber" />
          </div>
          <div class="info-item">
            <label for="price">{{ 'listingEdit.priceLabel' | translate }}</label>
            <input id="price" type="number" formControlName="price" />
          </div>
          <div class="info-item">
            <label for="rentSale">{{ 'listingEdit.rentSaleLabel' | translate }}</label>
            <select id="rentSale" formControlName="rentSale">
              <option value="RENT">{{ 'listingEdit.rentOption' | translate }}</option>
              <option value="SALE">{{ 'listingEdit.saleOption' | translate }}</option>
            </select>
          </div>
          <div class="info-item">
            <label for="hasFurniture">{{ 'listingEdit.hasFurnitureLabel' | translate }}</label>
            <input id="hasFurniture" type="checkbox" formControlName="hasFurniture" />
          </div>
          <div class="info-item">
            <label for="hasBalcony">{{ 'listingEdit.hasBalconyLabel' | translate }}</label>
            <input id="hasBalcony" type="checkbox" formControlName="hasBalcony" />
          </div>
          <div class="info-item">
            <label for="bathroomNumber">{{ 'listingEdit.bathroomNumberLabel' | translate }}</label>
            <input id="bathroomNumber" type="number" formControlName="bathroomNumber" />
          </div>
          <div class="info-item">
            <label for="homeSquareMeter">{{ 'listingEdit.homeSquareMeterLabel' | translate }}</label>
            <input id="homeSquareMeter" type="number" formControlName="homeSquareMeter" />
          </div>
          <div class="form-buttons">
            <p-button
              styleClass="save-button"
              [label]="'listingEdit.saveButton' | translate"
              [disabled]="listingForm.invalid"
              class="p-button-md"
              (click)="updateListing()"
            ></p-button>
            <p-button
              styleClass="delete-button"
              [label]="'listingEdit.deleteButton' | translate"
              [disabled]="listingForm.invalid"
              class="p-button-md"
              (click)="deleteListing()"
            ></p-button>
            <p-button
              styleClass="cancel-button"
              [label]="'listingEdit.cancelButton' | translate"
              class="p-button-md"
              (click)="closeTab()"
            ></p-button>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrl: './my-listing-edit.component.css',
})
export class MyListingEditComponent implements OnInit {
  listing: ApartmentListing;
  listingForm: FormGroup;

  constructor(
    private router: Router,
    private toastService: ToastService,
    private location: Location,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private translate: TranslateService // Inject TranslateService
  ) {
    this.listing = this.router.getCurrentNavigation()?.extras.state?.['listing'];
    this.listingForm = this.formBuilder.group({
      id: this.listing.id,
      listingName: [this.listing.listingName, Validators.required],
      address: [this.listing.address, Validators.required],
      age: [this.listing.age, [Validators.required, Validators.min(0)]],
      roomNumber: [this.listing.roomNumber, [Validators.required, Validators.min(0)]],
      price: [this.listing.price, [Validators.required, Validators.min(0)]],
      rentSale: [this.listing.rentSale, Validators.required],
      hasFurniture: [this.listing.hasFurniture],
      hasBalcony: [this.listing.hasBalcony],
      bathroomNumber: [this.listing.bathroomNumber, [Validators.required, Validators.min(0)]],
      homeSquareMeter: [this.listing.homeSquareMeter, [Validators.required, Validators.min(0)]],
      listerEmail: this.listing.listerEmail,
    });
  }

  ngOnInit() {
    if (this.listing == null) {
      this.toastService.showToast(
        'error',
        this.translate.instant('toastMessages.errorTitle'),
        this.translate.instant('toastMessages.unableToRetrieveData')
      );
      this.location.back();
    }
  }

  updateListing(): void {
    if (this.listingForm.valid) {
      const updatedListing: ApartmentListing = this.listingForm.value;
      this.apiService.updateMyListing(updatedListing).subscribe({
        next: (response) => {
          if (response.status === 200 && response.body != null) {
            this.toastService.showToast(
              'success',
              this.translate.instant('toastMessages.successTitle'),
              response.body.message
            );
            this.location.back();
          }
        },
        error: (error) => {
          this.toastService.showToast('error', this.translate.instant('toastMessages.errorTitle'), error.error.message);
        },
      });
    }
  }

  deleteListing(): void {
    const updatedListing: ApartmentListing = this.listingForm.value;
    this.apiService.deleteUserListing(updatedListing.id).subscribe({
      next: (response) => {
        if (response.status === 200 && response.body != null) {
          this.toastService.showToast(
            'success',
            this.translate.instant('toastMessages.successTitle'),
            response.body.message
          );
          this.location.back();
        }
      },
      error: (error) => {
        this.toastService.showToast('error', this.translate.instant('toastMessages.errorTitle'), error.error.message);
      },
    });
  }

  closeTab() {
    this.location.back();
  }
}
