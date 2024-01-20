import {AppComponent} from './app/app.component';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import {MatChipsModule} from '@angular/material/chips';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {QRCodeModule} from 'angularx-qrcode';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatListModule} from '@angular/material/list';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTableModule} from '@angular/material/table';
import {MatStepperModule} from '@angular/material/stepper';
import {MatIconModule} from '@angular/material/icon';
import {NgxMatTimepickerModule} from 'ngx-mat-timepicker';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {provideAnimations} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app/app-routing.module';
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {AuthInterceptor} from './app/interceptor/auth.interceptor';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {ApiModule, BASE_PATH} from './frontend-client';
import {FrontendConfigService} from './app/service/frontend-config.service';
import {APP_INITIALIZER, importProvidersFrom} from '@angular/core';


bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule, ApiModule, FormsModule, MatButtonModule, MatDatepickerModule, MatInputModule, NgxMatTimepickerModule, MatIconModule, MatStepperModule, MatTableModule, ReactiveFormsModule, MatCheckboxModule, MatSlideToggleModule, MatPaginatorModule, MatListModule, MatSelectModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule, MatTooltipModule, QRCodeModule, MatAutocompleteModule, MatToolbarModule, MatSidenavModule, MatCardModule, MatExpansionModule, ScrollingModule, MatChipsModule, CdkAccordionModule),
        {
            provide: APP_INITIALIZER,
            multi: true,
            deps: [FrontendConfigService],
            useFactory: (frontendConfigService: FrontendConfigService) => {
                return () => {
                    //Make sure to return a promise!
                    return frontendConfigService.initConfig();
                };
            }
        },
        {
            provide: BASE_PATH,
            useFactory: () => {
                return location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");
            }
        },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations()
    ]
})
  .catch(err => console.error(err));
