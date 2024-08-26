import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly LANGUAGE_KEY = 'app_language';

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['en', 'tr']);
    const savedLang = localStorage.getItem(this.LANGUAGE_KEY);
    if (savedLang) {
      this.translate.use(savedLang);
    } else {
      const browserLang = this.translate.getBrowserLang();
      const defaultLang = browserLang?.match(/en|tr/) ? browserLang : 'en';
      this.translate.use(defaultLang);
      localStorage.setItem(this.LANGUAGE_KEY, defaultLang);
    }
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem(this.LANGUAGE_KEY, lang);
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang;
  }
}
