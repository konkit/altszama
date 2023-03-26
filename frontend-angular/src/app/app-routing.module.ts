import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LandingPageViewComponent} from "./views/landing/landing-page-view/landing-page-view.component";
import {LoginViewComponent} from "./views/login/login-view/login-view.component";
import {TestLoginViewComponent} from "./views/login/test-login-view/test-login-view.component";
import {TodayOrdersViewComponent} from "./views/orders/today-orders-view/today-orders-view.component";
import {ShowOrderViewComponent} from "./views/orders/show-order-view/show-order-view.component";
import {AllOrdersViewComponent} from "./views/orders/all-orders-view/all-orders-view.component";
import {RestaurantsListViewComponent} from "./views/restaurants/restaurants-list-view/restaurants-list-view.component";
import {ShowRestaurantViewComponent} from "./views/restaurants/show-restaurant-view/show-restaurant-view.component";
import {BalanceViewComponent} from "./views/balance/balance-view/balance-view.component";
import {MakeAnOrderViewComponent} from "./views/orders/make-an-order-view/make-an-order-view.component";
import {TodayOrdersResolver} from "./views/orders/today-orders-view/today-orders.resolver";
import {ShowOrderResolver} from "./views/orders/show-order-view/show-order.resolver";
import {AllOrdersResolver} from "./views/orders/all-orders-view/all-orders.resolver";
import {RestaurantsListResolver} from "./views/restaurants/restaurants-list-view/restaurants-list.resolver";
import {ShowRestaurantResolver} from "./views/restaurants/show-restaurant-view/show-restaurant.resolver";
import {CreateOrderViewComponent} from "./views/orders/create-order-view/create-order-view.component";
import {CreateOrderResolver} from "./views/orders/create-order-view/create-order.resolver";
import {
  CreateRestaurantViewComponent
} from "./views/restaurants/create-restaurant-view/create-restaurant-view.component";
import {EditOrderViewComponent} from "./views/orders/edit-order-view/edit-order-view.component";
import {EditOrderResolver} from "./views/orders/edit-order-view/edit-order.resolver";


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
    path: "orders/today",
    title: "TodayOrders",
    component: TodayOrdersViewComponent,
    resolve: {
      response: TodayOrdersResolver
    }
  },
  {
    path: "orders/create",
    title: "CreateOrder",
    component: CreateOrderViewComponent,
    resolve: {
      response: CreateOrderResolver
    }
  },
  {
    path: "orders/:id/make_an_order",
    title: "MakeAnOrderView",
    component: MakeAnOrderViewComponent,
  },
  {
    path: "orders/:id/show",
    title: "ShowOrder",
    component: ShowOrderViewComponent,
    resolve: {
      response: ShowOrderResolver
    }
  },
  {
    path: "orders/:id/edit",
    title: "EditOrderView",
    component: EditOrderViewComponent,
    resolve: {
      response: EditOrderResolver
    }
  },
  {
    path: "orders/all",
    title: "AllOrders",
    component: AllOrdersViewComponent,
    resolve: {
      response: AllOrdersResolver
    }
  },
  {
    path: "restaurants",
    title: "RestaurantIndex",
    component: RestaurantsListViewComponent,
    resolve: {
      response: RestaurantsListResolver
    }
  },
  {
    path: "restaurants/create",
    title: "CreateRestaurant",
    component: CreateRestaurantViewComponent,
  },
  {
    path: "restaurants/:id",
    title: "ShowRestaurant",
    component: ShowRestaurantViewComponent,
    runGuardsAndResolvers: "always",
    resolve: {
      response: ShowRestaurantResolver
    }
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
