import { Component, OnInit } from '@angular/core';
import { RouterOutlet,Router  } from '@angular/router';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ThemeService } from './services/theme.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
  title = 'sasafinda_management';

  constructor(
    private readonly themeService: ThemeService,
    private readonly translate: TranslateService,
    private readonly http: HttpClient,
    private readonly router: Router
  ) {
    
    translate.addLangs(['en', 'fr', 'ar']);
    
    translate.setDefaultLang('en');
   
    const savedLang = localStorage.getItem('preferredLanguage') ?? 'en';
   
    // Test direct HTTP request
    this.http.get(`./assets/i18n/${savedLang}.json`).subscribe({
      next: (data) => console.log('Translation file found:', data),
      error: (error) => console.log('Translation file error:', error.message)
    });

    // Test translation service
    translate.use(savedLang).subscribe({
      next: () => console.log('Translation service success'),
      error: (error) => console.log('Translation service error:', error.message),
      complete: () => console.log('Translation loading completed')
    });
  }

  ngOnInit() {
    this.themeService.initializeTheme();
    const params = new URLSearchParams(window.location.search);
  if (params.get('route') === 'dashboard') {
    this.router.navigate(['/dashboard']);
  }
    const savedLang = localStorage.getItem('preferredLanguage') ?? 'en';
  
    // Set initial direction and language attributes
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLang;
  
    // Subscribe to language changes
    this.translate.onLangChange.subscribe({
      next: (event: LangChangeEvent) => {
        document.documentElement.dir = event.lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = event.lang;
      }    });
  }
  
}