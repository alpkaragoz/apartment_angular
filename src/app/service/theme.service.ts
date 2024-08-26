import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeKey = 'theme';
  private readonly THEME_KEY = 'app_theme';

  constructor() {
    this.loadTheme();
  }

  toggleTheme() {
    const currentTheme = this.getTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  private setTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.themeKey, theme);
  }

  public getTheme(): string {
    return localStorage.getItem(this.themeKey) || 'light';
  }

  private loadTheme() {
    const savedTheme = this.getTheme();
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
}
