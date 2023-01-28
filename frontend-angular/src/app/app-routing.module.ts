import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LandingPageViewComponent} from "./views/landing/landing-page-view/landing-page-view.component";
import {LoginViewComponent} from "./views/login/login-view/login-view.component";
import {TestLoginViewComponent} from "./views/login/test-login-view/test-login-view.component";
import {TodaysOrderViewComponent} from "./views/orders/todays-order-view/todays-order-view.component";
import {ShowOrderViewComponent} from "./views/orders/show-order-view/show-order-view.component";
import {AllOrdersViewComponent} from "./views/orders/all-orders-view/all-orders-view.component";
import {RestaurantsListViewComponent} from "./views/restaurants/restaurants-list-view/restaurants-list-view.component";
import {ShowRestaurantViewComponent} from "./views/restaurants/show-restaurant-view/show-restaurant-view.component";
import {BalanceViewComponent} from "./views/balance/balance-view/balance-view.component";
import {MakeAnOrderViewComponent} from "./views/orders/make-an-order-view/make-an-order-view.component";


export const notAuthenticatedRoutes: Routes = [
  {
    path: '',
    title: "LandingPage",
    component: LandingPageViewComponent,
  },
  {
    path: "login",
    title: "Login",
    component: LoginViewComponent,
  },
  {
    path: "login/test",
    title: "TestLogin",
    component: TestLoginViewComponent,
  }
]


export const authenticatedRoutes: Routes = [
  {
    path: "orders",
    title: "TodayOrders",
    component: TodaysOrderViewComponent,
  },
  {
    path: "orders/show/:id",
    title: "ShowOrder",
    component: ShowOrderViewComponent,
  },
  {
    path: "orders/:id/make_an_order",
    title: "OrderView",
    component: MakeAnOrderViewComponent,
  },
  {
    path: "orders/all",
    title: "AllOrders",
    component: AllOrdersViewComponent,
  },
  {
    path: "restaurants",
    title: "RestaurantIndex",
    component: RestaurantsListViewComponent,
  },
  {
    path: "restaurants/show/:id",
    title: "ShowRestaurant",
    component: ShowRestaurantViewComponent,
  },
  {
    path: "balance",
    title: "Balance",
    component: BalanceViewComponent,
  },
]

@NgModule({
  imports: [RouterModule.forRoot([...notAuthenticatedRoutes, ...authenticatedRoutes])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
