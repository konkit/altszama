import {ResolveData, Route, Routes, RunGuardsAndResolvers} from '@angular/router';
import {Type} from '@angular/core';
import {AuthenticatedLayoutComponent} from './components/authenticated-layout/authenticated-layout.component';
import {LandingPageViewComponent} from './views/landing/landing-page-view/landing-page-view.component';
import {LoginViewComponent} from './views/login/login-view/login-view.component';
import {TestLoginViewComponent} from './views/login/test-login-view/test-login-view.component';
import {TodayOrdersViewComponent} from './views/orders/today-orders-view/today-orders-view.component';
import {todayOrdersResolver} from './views/orders/today-orders-view/today-orders.resolver';
import {AllOrdersViewComponent} from './views/orders/all-orders-view/all-orders-view.component';
import {allOrdersResolver} from './views/orders/all-orders-view/all-orders.resolver';
import {RestaurantsListViewComponent} from './views/restaurants/restaurants-list-view/restaurants-list-view.component';
import {restaurantsListResolver} from './views/restaurants/restaurants-list-view/restaurants-list.resolver';
import {BalanceViewComponent} from './views/balance/balance-view/balance-view.component';
import {ShowRestaurantViewComponent} from './views/restaurants/show-restaurant-view/show-restaurant-view.component';
import {showRestaurantResolver,} from './views/restaurants/show-restaurant-view/show-restaurant.resolver';
import {
  CreateRestaurantViewComponent
} from './views/restaurants/create-restaurant-view/create-restaurant-view.component';
import {CreateOrderViewComponent} from './views/orders/create-order-view/create-order-view.component';
import {CreateOrderResolver} from './views/orders/create-order-view/create-order.resolver';
import {MakeAnOrderViewComponent} from './views/orders/make-an-order-view/make-an-order-view.component';
import {ShowOrderViewComponent} from './views/orders/show-order-view/show-order-view.component';
import {ShowOrderResolver} from './views/orders/show-order-view/show-order.resolver';
import {EditOrderViewComponent} from './views/orders/edit-order-view/edit-order-view.component';
import {EditOrderResolver} from './views/orders/edit-order-view/edit-order.resolver';

export const notAuthenticatedRoutes: Routes = [
  {
    path: '',
    title: "AltSzama",
    component: LandingPageViewComponent,
  },
  {
    path: "login",
    title: "Login | AltSzama",
    component: LoginViewComponent,
  },
  {
    path: "login/test",
    title: "TestLogin | AltSzama",
    component: TestLoginViewComponent,
  }
]


export const authenticatedRoutes: Routes = [
  authenticatedRoute({
    path: "orders/today",
    title: "Today's orders",
    component: TodayOrdersViewComponent,
    resolve: {
      response: todayOrdersResolver
    }
  }),
  authenticatedRoute({
    path: "orders/create",
    title: "Create new order | AltSzama",
    component: CreateOrderViewComponent,
    resolve: {
      response: CreateOrderResolver
    }
  }),
  authenticatedRoute({
    path: "orders/:id/make_an_order",
    title: "Make an order | AltSzama",
    component: MakeAnOrderViewComponent,
  }),
  authenticatedRoute({
    path: "orders/:id/show",
    title: "Show Order | AltSzama",
    component: ShowOrderViewComponent,
    resolve: {
      response: ShowOrderResolver
    }
  }),
  authenticatedRoute({
    path: "orders/:id/edit",
    title: "Edit Order | AltSzama",
    component: EditOrderViewComponent,
    resolve: {
      response: EditOrderResolver
    }
  }),
  authenticatedRoute({
    path: "orders/all",
    title: "All orders | AltSzama",
    component: AllOrdersViewComponent,
    resolve: {
      response: allOrdersResolver
    }
  }),
  authenticatedRoute({
    path: "restaurants",
    title: "Restaurants | AltSzama",
    component: RestaurantsListViewComponent,
    resolve: {
      response: restaurantsListResolver
    }
  }),
  authenticatedRoute({
    path: "restaurants/create",
    title: "Create restaurant | AltSzama",
    component: CreateRestaurantViewComponent,
  }),
  authenticatedRoute({
    path: "restaurants/:id",
    title: "Show restaurant | AltSzama",
    component: ShowRestaurantViewComponent,
    runGuardsAndResolvers: "always",
    resolve: {
      response: showRestaurantResolver
    }
  }),
  authenticatedRoute({
    path: "balance",
    title: "Your order history | AltSzama",
    component: BalanceViewComponent,
  }),
]

export const routes = [
  ...notAuthenticatedRoutes,
  ...authenticatedRoutes
]

function authenticatedRoute(param: {path: string, title: string, component: Type<any>, resolve?: ResolveData, runGuardsAndResolvers?: RunGuardsAndResolvers}): Route {
  let route: Route = {
    path: param.path,
    title: param.title,
    component: AuthenticatedLayoutComponent,
    children: [
      {
        path: '',
        component: param.component,
      }
    ],
  }

  if (param.resolve != null) {
    route.resolve = param.resolve
  }

  return route;
}
