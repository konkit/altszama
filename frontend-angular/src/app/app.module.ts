import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BalanceViewComponent} from './views/balance/balance-view/balance-view.component';
import {LandingPageViewComponent} from './views/landing/landing-page-view/landing-page-view.component';
import {LoginViewComponent} from './views/login/login-view/login-view.component';
import {TestLoginViewComponent} from './views/login/test-login-view/test-login-view.component';
import {AllOrdersViewComponent} from './views/orders/all-orders-view/all-orders-view.component';
import {MakeAnOrderViewComponent} from './views/orders/make-an-order-view/make-an-order-view.component';
import {ShowOrderViewComponent} from './views/orders/show-order-view/show-order-view.component';
import {TodayOrdersViewComponent} from './views/orders/today-orders-view/today-orders-view.component';
import {RestaurantsListViewComponent} from './views/restaurants/restaurants-list-view/restaurants-list-view.component';
import {ShowRestaurantViewComponent} from './views/restaurants/show-restaurant-view/show-restaurant-view.component';
import {ApiModule, BASE_PATH} from "../frontend-client";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthenticatedLayoutComponent} from './components/authenticated-layout/authenticated-layout.component';
import {
  GoogleLoginButtonComponent
} from './views/login/login-view/components/google-login-button/google-login-button.component';
import {AuthInterceptor} from "./interceptor/auth.interceptor";
import {FrontendConfigService} from "./service/frontend-config.service";
import {PricePipe} from "./components/pipes/price.pipe";
import {
  OrderEntriesListComponent
} from './views/orders/show-order-view/components/order-entries-list/order-entries-list.component';
import {
  TitleWithPaymentStatusComponent
} from './views/orders/show-order-view/components/order-entries-list/components/title-with-payment-status/title-with-payment-status.component';
import {
  ShowOrderEntryComponent
} from './views/orders/show-order-view/components/order-entries-list/components/show-order-entry/show-order-entry.component';
import {ViewWrapperComponent} from './components/view-wrapper/view-wrapper.component';
import {CreateOrderViewComponent} from './views/orders/create-order-view/create-order-view.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {NgxMatTimepickerModule} from "ngx-mat-timepicker";
import {MatIconModule} from "@angular/material/icon";
import {MatStepperModule} from "@angular/material/stepper";
import {MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatListModule} from "@angular/material/list";
import {
  CreateRestaurantViewComponent
} from './views/restaurants/create-restaurant-view/create-restaurant-view.component';
import {ButtonComponent} from './components/button/button.component';
import {MatSelectModule} from "@angular/material/select";
import {
  CreateDishFormComponent
} from './views/restaurants/show-restaurant-view/components/create-dish-form/create-dish-form.component';
import {MoneyInputComponent} from './components/money-input/money-input.component';
import {
  EditDishFormComponent
} from './views/restaurants/show-restaurant-view/components/edit-dish-form/edit-dish-form.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {
  DeleteConfirmationModalComponent
} from './components/delete-confirmation-modal/delete-confirmation-modal.component';
import {RelativeDatePipe} from './components/pipes/date-to-rel.pipe';
import {
  RestaurantDetailsComponent
} from './views/restaurants/show-restaurant-view/components/restaurant-details/restaurant-details.component';
import {
  EditRestaurantFormComponent
} from './views/restaurants/show-restaurant-view/components/edit-restaurant-form/edit-restaurant-form.component';
import {DishEntryComponent} from "./views/restaurants/show-restaurant-view/components/dish-entry/dish-entry.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {DishFormComponent} from './views/restaurants/show-restaurant-view/components/dish-form/dish-form.component';
import {
  DishFormPlaceholderComponent
} from './views/restaurants/show-restaurant-view/components/dish-form-placeholder/dish-form-placeholder.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {
  CreateOrderEntryComponent
} from './views/orders/show-order-view/components/order-entries-list/components/create-order-entry/create-order-entry.component';
import {
  EditOrderEntryComponent
} from './views/orders/show-order-view/components/order-entries-list/components/edit-order-entry/edit-order-entry.component';
import {UserOrdersComponent} from './views/orders/make-an-order-view/components/user-orders/user-orders.component';
import {EditOrderViewComponent} from './views/orders/edit-order-view/edit-order-view.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {
  OrderEntryFormComponent
} from './views/orders/show-order-view/components/order-entries-list/components/order-entry-form/order-entry-form.component';
import {
  SideDishesInputComponent
} from './views/orders/show-order-view/components/order-entries-list/components/side-dishes-input/side-dishes-input.component';
import {
  OrderStateButtonsComponent
} from "./views/orders/edit-order-view/components/order-state-buttons/order-state-buttons.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatCardModule} from "@angular/material/card";
import {PaymentDataFormComponent} from './views/orders/components/payment-data-form/payment-data-form.component';
import {DeliveryDataFormComponent} from './views/orders/components/delivery-data-form/delivery-data-form.component';
import {OrderTimeFormComponent} from './views/orders/components/order-time-form/order-time-form.component';
import {TimePickerComponent} from './components/time-picker/time-picker.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {ErrorSnackBarComponent} from './components/error-snack-bar/error-snack-bar.component';
import {
  ExistingOrderEntryCardComponent
} from './views/orders/show-order-view/components/order-entries-list/components/existing-order-entry-card/existing-order-entry-card.component';
import {
  PaymentStatusChipComponent
} from "./views/orders/show-order-view/components/order-entries-list/components/title-with-payment-status/payment-status-chip/payment-status-chip.component";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {
  OrderOwnerButtonsComponent
} from './views/orders/show-order-view/components/order-owner-buttons/order-owner-buttons.component';
import {
  OrderLockedWarningBannerComponent
} from './views/orders/show-order-view/components/order-locked-warning-banner/order-locked-warning-banner.component';
import {OrderDetailsComponent} from './views/orders/show-order-view/components/order-details/order-details.component';
import {MatChipsModule} from "@angular/material/chips";
import {ChipComponent} from './components/chip/chip.component';
import {QRCodeModule} from 'angularx-qrcode';
import {
  OrderDataSummaryComponent
} from "./views/orders/show-order-view/components/order-details/components/order-data-summary/order-data-summary.component";
import {
  PriceSummaryComponent
} from "./views/orders/show-order-view/components/order-details/components/price-summary/price-summary.component";
import {
  PaymentOptionsSummaryComponent
} from "./views/orders/show-order-view/components/order-details/components/payment-options-summary/payment-options-summary.component";
import {
  BankTransferQrcodeModal
} from "./views/orders/show-order-view/components/order-details/components/payment-options-summary/bank-transfer-qrcode-modal/bank-transfer-qrcode-modal.component";

@NgModule({
  declarations: [
    AppComponent,
    BalanceViewComponent,
    LandingPageViewComponent,
    LoginViewComponent,
    TestLoginViewComponent,
    AllOrdersViewComponent,
    MakeAnOrderViewComponent,
    ShowOrderViewComponent,
    TodayOrdersViewComponent,
    RestaurantsListViewComponent,
    ShowRestaurantViewComponent,
    AuthenticatedLayoutComponent,
    GoogleLoginButtonComponent,
    OrderDataSummaryComponent,
    PriceSummaryComponent,
    PaymentOptionsSummaryComponent,
    PricePipe,
    BankTransferQrcodeModal,
    OrderEntriesListComponent,
    TitleWithPaymentStatusComponent,
    ShowOrderEntryComponent,
    DishEntryComponent,
    ViewWrapperComponent,
    CreateOrderViewComponent,
    CreateRestaurantViewComponent,
    ButtonComponent,
    CreateDishFormComponent,
    MoneyInputComponent,
    EditDishFormComponent,
    DeleteConfirmationModalComponent,
    RelativeDatePipe,
    RestaurantDetailsComponent,
    EditRestaurantFormComponent,
    DishFormComponent,
    DishFormPlaceholderComponent,
    CreateOrderEntryComponent,
    EditOrderEntryComponent,
    UserOrdersComponent,
    EditOrderViewComponent,
    OrderEntryFormComponent,
    SideDishesInputComponent,
    OrderStateButtonsComponent,
    PaymentDataFormComponent,
    DeliveryDataFormComponent,
    OrderTimeFormComponent,
    TimePickerComponent,
    ErrorSnackBarComponent,
    ExistingOrderEntryCardComponent,
    PaymentStatusChipComponent,
    OrderOwnerButtonsComponent,
    OrderLockedWarningBannerComponent,
    OrderDetailsComponent,
    ChipComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ApiModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    NgxMatTimepickerModule,
    MatIconModule,
    MatStepperModule,
    MatTableModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatListModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    QRCodeModule,
    MatAutocompleteModule,
    MatToolbarModule,
    MatSidenavModule,
    MatCardModule,
    MatExpansionModule,
    ScrollingModule,
    MatChipsModule,
  ],
  providers: [
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
