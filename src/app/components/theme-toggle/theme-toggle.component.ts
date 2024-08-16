import { Component } from '@angular/core';
import { ThemeService } from '../../service/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-theme-toggle',
  template: ` <button class="toggle-button" (click)="toggleTheme()">
    <ng-container *ngIf="theme === 'dark'; else lightMode"> ☀️ </ng-container>
    <ng-template #lightMode> 🌙 </ng-template>
  </button>`,
  styleUrl: './theme-toggle.component.css',
})
export class ThemeToggleComponent {
  theme: string;
  constructor(private themeService: ThemeService) {
    this.theme = this.themeService.getTheme();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.theme = this.themeService.getTheme();
  }
}
