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

@Component({
  selector: 'app-my-listing-edit',
  standalone: true,
  imports: [ToastModule, DecimalPipe, MatIconModule, CommonModule, ReactiveFormsModule, ButtonModule],
  template: `
    <div class="listing-backdrop"></div>
    <p-toast></p-toast>
    <div class="listing-content">
      <button class="close-button" (click)="closeTab()">✕</button>
      <h2>Edit Details</h2>
      <div class="listing-info-container">
        <form [formGroup]="listingForm">
          <div class="info-item">
            <label for="listingName">Listing Name:</label>
            <input id="listingName" formControlName="listingName" />
          </div>
          <div class="info-item">
            <label for="address">Address:</label>
            <input id="address" formControlName="address" />
          </div>
          <div class="info-item">
            <label for="age">Age:</label>
            <input id="age" type="number" formControlName="age" />
          </div>
          <div class="info-item">
            <label for="roomNumber">Room Number:</label>
            <input id="roomNumber" type="number" formControlName="roomNumber" />
          </div>
          <div class="info-item">
            <label for="price">Price:</label>
            <input id="price" type="number" formControlName="price" />
          </div>
          <div class="info-item">
            <label for="rentSale">Rent or Sale:</label>
            <select id="rentSale" formControlName="rentSale">
              <option value="Rent">Rent</option>
              <option value="Sale">Sale</option>
            </select>
          </div>
          <div class="info-item">
            <label for="hasFurniture">Has Furniture:</label>
            <input id="hasFurniture" type="checkbox" formControlName="hasFurniture" />
          </div>
          <div class="info-item">
            <label for="hasBalcony">Has Balcony:</label>
            <input id="hasBalcony" type="checkbox" formControlName="hasBalcony" />
          </div>
          <div class="info-item">
            <label for="bathroomNumber">Bathroom Number:</label>
            <input id="bathroomNumber" type="number" formControlName="bathroomNumber" />
          </div>
          <div class="info-item">
            <label for="homeSquareMeter">Home Square Meter:</label>
            <input id="homeSquareMeter" type="number" formControlName="homeSquareMeter" />
          </div>
          <div class="form-buttons">
            <p-button styleClass="save-button" label="Save" [disabled]="listingForm.invalid" class="p-button-md" (click)="updateListing()" />
            <p-button styleClass="delete-button" label="Delete" [disabled]="listingForm.invalid" class="p-button-md" (click)="deleteListing()" />
            <p-button styleClass="cancel-button" label="Cancel" class="p-button-md" (click)="closeTab()" />
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
    private apiService: ApiService
  ) {
    this.listing = this.router.getCurrentNavigation()?.extras.state?.['listing'];
    this.listingForm = this.formBuilder.group({
      id: this.listing.id,
      listingName: [this.listing.listingName, Validators.required],
      address: [this.listing.address, Validators.required],
      age: [this.listing.age, [Validators.required, Validators.min(0)]],
      roomNumber: [this.listing.roomNumber, [Validators.required, Validators.min(1)]],
      price: [this.listing.price, [Validators.required, Validators.min(0)]],
      rentSale: [this.listing.rentSale, Validators.required],
      hasFurniture: [this.listing.hasFurniture],
      hasBalcony: [this.listing.hasBalcony],
      bathroomNumber: [this.listing.bathroomNumber, [Validators.required, Validators.min(1)]],
      homeSquareMeter: [this.listing.homeSquareMeter, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    if (this.listing == null) {
      this.toastService.showToast('error', 'Error', 'Unable to retrieve data.');
      this.location.back();
    }
  }

  updateListing(): void {
    if (this.listingForm.valid) {
      const updatedListing: ApartmentListing = this.listingForm.value;
      this.apiService.updateMyListing(updatedListing).subscribe({
        next: (response) => {
          if (response.status === 200 && response.body != null) {
            this.toastService.showToast('success', 'Success', response.body.message);
            this.location.back();
          }
        },
        error: (error) => {
          this.toastService.showToast('error', 'Error', error.error.message);
          this.location.back();
        },
      });
    }
  }

  deleteListing(): void {
    const updatedListing: ApartmentListing = this.listingForm.value;
    this.apiService.deleteMyListing(updatedListing).subscribe({
      next: (response) => {
        if (response.status === 200 && response.body != null) {
          this.toastService.showToast('success', 'Success', response.body.message);
          this.location.back();
        }
      },
      error: (error) => {
        this.toastService.showToast('error', 'Error', error.error.message);
        this.location.back();
      },
    });
  }

  closeTab() {
    this.location.back();
  }
}
