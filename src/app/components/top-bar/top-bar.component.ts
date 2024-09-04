import { Component, EventEmitter, Output } from '@angular/core';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { LanguageService } from '../../service/language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [ThemeToggleComponent, TranslateModule],
  template: `
    <div class="top-bar">
      <button (click)="onAddListing()" class="top-bar-button">{{ 'topBar.addListing' | translate }}</button>
      <button (click)="onMyListings()" class="top-bar-button">{{ 'topBar.myListings' | translate }}</button>
      <button (click)="onDataPanel()" class="top-bar-button">{{ 'topBar.data' | translate }}</button>
      <button (click)="onLogout()" class="logout-button">{{ 'topBar.logout' | translate }}</button>
      <app-theme-toggle />
      <button (click)="toggleLanguage()" class="language-toggle-button">
        <i class="language-icon"></i>
      </button>
    </div>
  `,
  styleUrls: ['./top-bar.component.css'],
})
export class TopBarComponent {
  @Output() addListing = new EventEmitter<void>();
  @Output() myListings = new EventEmitter<void>();
  @Output() dataPanel = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  constructor(private languageService: LanguageService) {}

  toggleLanguage() {
    const currentLang = this.languageService.getCurrentLanguage();
    const newLang = currentLang === 'en' ? 'tr' : 'en';
    this.languageService.switchLanguage(newLang);
  }

  onAddListing() {
    this.addListing.emit();
  }

  onMyListings() {
    this.myListings.emit();
  }

  onDataPanel() {
    this.dataPanel.emit();
  }

  onLogout() {
    this.logout.emit();
  }
}
