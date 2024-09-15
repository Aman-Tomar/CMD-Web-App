import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { RouterModule, provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    importProvidersFrom(BrowserAnimationsModule, RouterModule.forRoot(routes)),
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient()
  ]
})
  .catch((err) => console.error(err));
