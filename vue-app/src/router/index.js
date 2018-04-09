import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'
import TodayOrders from '@/components/orders/TodayOrders'
import ShowOrder from '@/components/orders/ShowOrder'
import OrderCreateForm from '@/components/orders/OrderCreateForm'
import OrderEditForm from '@/components/orders/OrderEditForm'
import OrderEntryCreateForm from '@/components/orders/OrderEntryCreateForm'
import OrderView from '@/components/orders/OrderView'

import AllOrders from '@/components/orders/AllOrders'

import RestaurantIndex from '@/components/restaurants/RestaurantIndex'
import ShowRestaurant from '@/components/restaurants/ShowRestaurant'

import RestaurantCreateForm from '@/components/restaurants/RestaurantCreateForm'
import RestaurantEditForm from '@/components/restaurants/RestaurantEditForm'

import DishCreateForm from '@/components/restaurants/DishCreateForm'
import DishEditForm from '@/components/restaurants/DishEditForm'

import ImportCrawledRestaurantData from '@/components/restaurants/ImportCrawledRestaurantData'

Vue.use(Router)

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
      path: '/orders/:id/create_entry',
      name: 'OrderEntryCreateForm',
      component: OrderEntryCreateForm
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
