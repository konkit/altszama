import {NgModule} from '@angular/core';
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
import {TodaysOrderViewComponent} from './views/orders/todays-order-view/todays-order-view.component';
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
    TodaysOrderViewComponent,
    RestaurantsListViewComponent,
    ShowRestaurantViewComponent,
    SidebarComponent,
    LayoutOneComponent,
    AuthenticatedLayoutComponent,
    GoogleLoginButtonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ApiModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: BASE_PATH,
      // multi: true,
      useFactory: () => {
        return location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");
      }
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
