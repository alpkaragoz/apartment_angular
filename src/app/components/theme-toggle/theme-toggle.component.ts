import { Component } from '@angular/core';
import { ThemeService } from '../../service/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-theme-toggle',
  template: ` <button class="toggle-button" (click)="toggleTheme()">
    <ng-container *ngIf="themeService.getTheme() === 'dark'; else lightMode"> ☀️ </ng-container>
    <ng-template #lightMode> 🌙 </ng-template>
  </button>`,
  styleUrls: ['./theme-toggle.component.css'],
})
export class ThemeToggleComponent {
  constructor(public themeService: ThemeService) {}

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
