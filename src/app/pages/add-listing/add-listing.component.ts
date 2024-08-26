import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { ApiService } from '../../service/api.service';
import { ToastService } from '../../service/toast.service';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-listing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, TranslateModule],
  template: `
    <div class="listing-backdrop"></div>
    <div class="listing-content">
      <button class="close-button" (click)="closeListing()">✕</button>
      <h2>{{ 'addListing.title' | translate }}</h2>
      <form [formGroup]="listingForm" (ngSubmit)="saveListing($event)">
        <div>
          <label for="listingName">{{ 'addListing.listingNameLabel' | translate }}</label>
          <input id="listingName" formControlName="listingName" type="text" />
        </div>
        <div>
          <label for="address">{{ 'addListing.addressLabel' | translate }}</label>
          <input id="address" formControlName="address" type="text" />
        </div>
        <div>
          <label for="age">{{ 'addListing.ageLabel' | translate }}</label>
          <input id="age" formControlName="age" type="number" />
        </div>
        <div>
          <label for="roomNumber">{{ 'addListing.roomNumberLabel' | translate }}</label>
          <input id="roomNumber" formControlName="roomNumber" type="number" />
        </div>
        <div>
          <label for="price">{{ 'addListing.priceLabel' | translate }}</label>
          <input id="price" formControlName="price" type="number" />
        </div>
        <div>
          <label for="rentSale">{{ 'addListing.rentSaleLabel' | translate }}</label>
          <select id="rentSale" formControlName="rentSale">
            <option value="RENT">Rent</option>
            <option value="SALE">Sale</option>
          </select>
        </div>
        <div class="checkbox-group">
          <div>
            <label for="hasFurniture">{{ 'addListing.hasFurnitureLabel' | translate }}</label>
            <input id="hasFurniture" formControlName="hasFurniture" type="checkbox" />
          </div>
          <div>
            <label for="hasBalcony">{{ 'addListing.hasBalconyLabel' | translate }}</label>
            <input id="hasBalcony" formControlName="hasBalcony" type="checkbox" />
          </div>
        </div>
        <div>
          <label for="bathroomNumber">{{ 'addListing.bathroomNumberLabel' | translate }}</label>
          <input id="bathroomNumber" formControlName="bathroomNumber" type="number" />
        </div>
        <div>
          <label for="homeSquareMeter">{{ 'addListing.homeSquareMeterLabel' | translate }}</label>
          <input id="homeSquareMeter" formControlName="homeSquareMeter" type="number" />
        </div>
        <div class="form-buttons">
          <p-button
            styleClass="save-button"
            type="submit"
            [label]="'addListing.saveButton' | translate"
            [disabled]="listingForm.invalid"
            [loading]="loading"
            class="p-button-md"
          />
          <p-button
            styleClass="cancel-button"
            [label]="'addListing.cancelButton' | translate"
            class="p-button-md"
            (click)="closeListing()"
          />
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./add-listing.component.css'],
})
export class AddListingComponent {
  listingForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastService: ToastService,
    private location: Location,
    private translate: TranslateService // Inject TranslateService
  ) {
    this.listingForm = this.fb.group({
      listingName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      age: [0, [Validators.required]],
      roomNumber: [0, [Validators.required]],
      price: [0, [Validators.required]],
      rentSale: ['RENT', [Validators.required]],
      hasFurniture: [false],
      hasBalcony: [false],
      bathroomNumber: [0, [Validators.required]],
      homeSquareMeter: [0, [Validators.required]],
    });
  }

  saveListing(event: Event) {
    event.preventDefault();
    if (this.listingForm.valid) {
      this.loading = true;
      const listing = this.listingForm.value;
      this.apiService.createListing(listing).subscribe({
        next: (response) => {
          if (response.status === 200 && response.body != null) {
            const successTitle = this.translate.instant('toastMessages.successTitle');
            this.toastService.showToast('success', successTitle, response.body.message);
            this.loading = false;
            this.closeListing();
          }
        },
        error: (err) => {
          this.loading = false;
          const errorTitle = this.translate.instant('toastMessages.errorTitle');
          this.toastService.showToast('error', errorTitle, err.error);
        },
      });
    }
  }

  closeListing() {
    this.location.back();
  }
}
