import Vue from "vue";
import Router from "vue-router";

import Login from "@/views/Login.vue";
import TodayOrders from "../views/orders/TodayOrders.vue";
import ShowOrder from "../views/orders/ShowOrder.vue";
import OrderCreateForm from "../views/orders/OrderCreateForm.vue";
import OrderEditForm from "../views/orders/OrderEditForm.vue";
import OrderView from "../views/orders/OrderView.vue";
import AllOrders from "../views/orders/AllOrders.vue";

import RestaurantIndex from "../views/dishes/RestaurantIndex.vue";
import ShowRestaurant from "../views/dishes/ShowRestaurant.vue";
import RestaurantCreateForm from "../views/dishes/RestaurantCreateForm.vue";
import RestaurantEditForm from "../views/dishes/RestaurantEditForm.vue";
import DishCreateForm from "../views/dishes/DishCreateForm.vue";
import DishEditForm from "../views/dishes/DishEditForm.vue";
import TeamsView from "@/views/teams/TeamsView.vue";
import CreateTeamForm from "@/views/teams/CreateTeamForm.vue";
import LandingPage from '@/views/landing/LandingPage.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: "Login",
      component: LandingPage,
    },
    {
      path: "/orders",
      name: "TodayOrders",
      component: TodayOrders,
      meta: {backButton: false}
    },
    {
      path: "/orders/show/:id",
      name: "ShowOrder",
      component: ShowOrder,
      meta: {backButton: true}
    },
    {
      path: "/orders/create",
      name: "OrderCreateForm",
      component: OrderCreateForm,
      meta: {backButton: true}
    },
    {
      path: "/orders/:id/edit",
      name: "OrderEditForm",
      component: OrderEditForm,
      meta: {backButton: true}
    },
    {
      path: "/orders/:id/order_view",
      name: "OrderView",
      component: OrderView,
      meta: {backButton: true}
    },
    {
      path: "/all_orders",
      name: "AllOrders",
      component: AllOrders,
      meta: {backButton: false}
    },
    {
      path: "/restaurants",
      name: "RestaurantIndex",
      component: RestaurantIndex,
      meta: {backButton: false}
    },
    {
      path: "/restaurants/show/:id",
      name: "ShowRestaurant",
      component: ShowRestaurant,
      meta: {backButton: true}
    },
    {
      path: "/restaurants/create",
      name: "RestaurantCreateForm",
      component: RestaurantCreateForm,
      meta: {backButton: true}
    },
    {
      path: "/restaurants/:id/edit",
      name: "RestaurantEditForm",
      component: RestaurantEditForm,
      meta: {backButton: true}
    },
    {
      path: "/restaurants/:id/dishes/create",
      name: "DishCreateForm",
      component: DishCreateForm,
      meta: {backButton: true}
    },
    {
      path: "/restaurants/:id/dishes/:dishId/edit",
      name: "DishEditForm",
      component: DishEditForm,
      meta: {backButton: true}
    },
    {
      path: "/teams",
      name: "TeamsView",
      component: TeamsView,
      meta: {backButton: true}
    },
    {
      path: "/teams/create",
      name: "TeamsCreate",
      component: CreateTeamForm,
      meta: {backButton: true}
    }
  ]
});
