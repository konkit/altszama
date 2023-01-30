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
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {LayoutOneComponent} from './components/layout-one/layout-one.component';
import {ApiModule, BASE_PATH} from "../frontend-client";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthenticatedLayoutComponent} from './components/authenticated-layout/authenticated-layout.component';
import {
  GoogleLoginButtonComponent
} from './views/login/login-view/components/google-login-button/google-login-button.component';
import {AuthInterceptor} from "./interceptor/auth.interceptor";
import {FrontendConfigService} from "./service/frontend-config.service";
import { OrderDataSummaryComponent } from './views/orders/show-order-view/components/order-data-summary/order-data-summary.component';
import { PriceSummaryComponent } from './views/orders/show-order-view/components/price-summary/price-summary.component';
import { PaymentOptionsSummaryComponent } from './views/orders/show-order-view/components/payment-options-summary/payment-options-summary.component';
import {PricePipe} from "./components/pipes/price.pipe";
import { BankTransferQRCodeComponent } from './views/orders/show-order-view/components/price-summary/bank-transfer-qrcode/bank-transfer-qrcode.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { OrderEntriesListComponent } from './views/orders/show-order-view/components/order-entries-list/order-entries-list.component';
import { OrderEntryCardComponent } from './views/orders/show-order-view/components/order-entries-list/order-entry-card/order-entry-card.component';
import { TitleWithPaymentStatusComponent } from './views/orders/show-order-view/components/order-entries-list/title-with-payment-status/title-with-payment-status.component';
import { ShowOrderEntryComponent } from './views/orders/show-order-view/components/order-entries-list/show-order-entry/show-order-entry.component';
import { ShowRestaurantDishesTableComponent } from './views/restaurants/show-restaurant-view/show-restaurant-dishes-table/show-restaurant-dishes-table.component';
import { ViewWrapperComponent } from './components/view-wrapper/view-wrapper.component';
import { ButtonComponent } from './components/button/button.component';

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
    SidebarComponent,
    LayoutOneComponent,
    AuthenticatedLayoutComponent,
    GoogleLoginButtonComponent,
    OrderDataSummaryComponent,
    PriceSummaryComponent,
    PaymentOptionsSummaryComponent,
    PricePipe,
    BankTransferQRCodeComponent,
    OrderEntriesListComponent,
    OrderEntryCardComponent,
    TitleWithPaymentStatusComponent,
    ShowOrderEntryComponent,
    ShowRestaurantDishesTableComponent,
    ViewWrapperComponent,
    ButtonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ApiModule,
    HttpClientModule,
    FontAwesomeModule
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
