import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { ApiService } from '../../service/api.service';
import { ToastService } from '../../service/toast.service';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-listing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule],
  template: `
    <div class="listing-backdrop"></div>
    <div class="listing-content">
      <button class="close-button" (click)="closeListing()">✕</button>
      <h2>Add Listing</h2>
      <form [formGroup]="listingForm" (ngSubmit)="saveListing($event)">
        <div>
          <label for="listingName">Listing Name</label>
          <input id="listingName" formControlName="listingName" type="text" />
        </div>
        <div>
          <label for="address">Address</label>
          <input id="address" formControlName="address" type="text" />
        </div>
        <div>
          <label for="age">Age</label>
          <input id="age" formControlName="age" type="number" />
        </div>
        <div>
          <label for="roomNumber">Room Number</label>
          <input id="roomNumber" formControlName="roomNumber" type="number" />
        </div>
        <div>
          <label for="price">Price</label>
          <input id="price" formControlName="price" type="number" />
        </div>
        <div>
          <label for="rentSale">Rent or Sale</label>
          <select id="rentSale" formControlName="rentSale">
            <option value="RENT">Rent</option>
            <option value="SALE">Sale</option>
          </select>
        </div>
        <div class="checkbox-group">
          <div>
            <label for="hasFurniture">Has Furniture</label>
            <input id="hasFurniture" formControlName="hasFurniture" type="checkbox" />
          </div>
          <div>
            <label for="hasBalcony">Has Balcony</label>
            <input id="hasBalcony" formControlName="hasBalcony" type="checkbox" />
          </div>
        </div>
        <div>
          <label for="bathroomNumber">Bathroom Number</label>
          <input id="bathroomNumber" formControlName="bathroomNumber" type="number" />
        </div>
        <div>
          <label for="homeSquareMeter">Home Square Meter</label>
          <input id="homeSquareMeter" formControlName="homeSquareMeter" type="number" />
        </div>
        <div class="form-buttons">
          <p-button styleClass="save-button" type="submit" label="Save" [disabled]="listingForm.invalid" class="p-button-md" />
          <p-button styleClass="cancel-button" label="Cancel" class="p-button-md" (click)="closeListing()" />
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./add-listing.component.css'],
})
export class AddListingComponent {
  listingForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastService: ToastService,
    private location: Location,
    private messageService: MessageService
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
      const listing = this.listingForm.value;
      this.apiService.createListing(listing).subscribe({
        next: (response) => {
          if (response.status === 200 && response.body != null) {
            this.toastService.showToast('success', 'Success', response.body.message);
            this.closeListing();
          }
        },
        error: (err) => {
          this.toastService.showToast('error', 'Error', err.error.message);
        },
      });
    }
  }

  closeListing() {
    this.location.back();
  }
}
