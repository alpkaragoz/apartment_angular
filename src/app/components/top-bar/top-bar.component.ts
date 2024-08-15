import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [],
  template: `
    <div class="top-bar">
      <button (click)="onAddListing()" class="top-bar-button">+</button>
      <button (click)="onMyListings()" class="top-bar-button">My Listings</button>
      <button (click)="onLogout()" class="logout-button">Log Out</button>
    </div>
  `,
  styleUrl: './top-bar.component.css',
})
export class TopBarComponent {
  @Output() addListing = new EventEmitter<void>();
  @Output() myListings = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  onAddListing() {
    this.addListing.emit();
  }

  onMyListings() {
    this.myListings.emit();
  }

  onLogout() {
    this.logout.emit();
  }
}
