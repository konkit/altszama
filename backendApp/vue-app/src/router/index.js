import Vue from 'vue'
import Router from 'vue-router'

import Login from '../components/Login'
import TodayOrders from '../views/TodayOrders'
import ShowOrder from '../views/ShowOrder'
import OrderCreateForm from '../views/OrderCreateForm'
import OrderEditForm from '../views/OrderEditForm'
import OrderView from '../views/OrderView'

import AllOrders from '../views/AllOrders'

import RestaurantIndex from '../views/RestaurantIndex'
import ShowRestaurant from '../views/ShowRestaurant'

import RestaurantCreateForm from '../views/RestaurantCreateForm'
import RestaurantEditForm from '../views/RestaurantEditForm'

import DishCreateForm from '../views/DishCreateForm'
import DishEditForm from '../views/DishEditForm'

import ImportCrawledRestaurantData from '../views/ImportCrawledRestaurantData'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/orders',
      name: 'TodayOrders',
      component: TodayOrders
    },
    {
      path: '/orders/show/:id',
      name: 'ShowOrder',
      component: ShowOrder
    },
    {
      path: '/orders/create',
      name: 'OrderCreateForm',
      component: OrderCreateForm
    },
    {
      path: '/orders/:id/edit',
      name: 'OrderEditForm',
      component: OrderEditForm
    },
    {
      path: '/orders/:id/order_view',
      name: 'OrderView',
      component: OrderView
    },
    {
      path: '/all_orders',
      name: 'AllOrders',
      component: AllOrders
    },
    {
      path: '/restaurants',
      name: 'RestaurantIndex',
      component: RestaurantIndex
    },
    {
      path: '/restaurants/show/:id',
      name: 'ShowRestaurant',
      component: ShowRestaurant
    },
    {
      path: '/restaurants/create',
      name: 'RestaurantCreateForm',
      component: RestaurantCreateForm
    },
    {
      path: '/restaurants/:id/edit',
      name: 'RestaurantEditForm',
      component: RestaurantEditForm
    },
    {
      path: '/restaurants/:id/dishes/create',
      name: 'DishCreateForm',
      component: DishCreateForm
    },
    {
      path: '/restaurants/:id/dishes/:dishId/edit',
      name: 'DishEditForm',
      component: DishEditForm
    },
    {
      path: '/restaurants/import/upload',
      name: 'ImportCrawledRestaurantData',
      component: ImportCrawledRestaurantData
    },
  ]
})
