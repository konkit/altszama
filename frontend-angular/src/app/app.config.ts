import {ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {BASE_PATH} from '../frontend-client';
import {FrontendConfigService} from './service/frontend-config.service';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {AuthInterceptor} from './interceptor/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),

    // importProvidersFrom(BrowserModule, AppRoutingModule, ApiModule, FormsModule, MatButtonModule, MatDatepickerModule, MatInputModule, NgxMatTimepickerModule, MatIconModule, MatStepperModule, MatTableModule, ReactiveFormsModule, MatCheckboxModule, MatSlideToggleModule, MatPaginatorModule, MatListModule, MatSelectModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule, MatTooltipModule, QRCodeModule, MatAutocompleteModule, MatToolbarModule, MatSidenavModule, MatCardModule, MatExpansionModule, ScrollingModule, MatChipsModule, CdkAccordionModule),
    // importProvidersFrom(ApiModule),
    provideAppInitializer(() => {
      let frontendConfigService = inject(FrontendConfigService)
      return frontendConfigService.initConfig()
    }),
    {
      provide: BASE_PATH,
      useFactory: () => {
        return location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");
      }
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideHttpClient(withInterceptorsFromDi()),
  ]
};
