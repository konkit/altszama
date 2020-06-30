import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/Login.vue';
import TodayOrders from '../views/orders/TodayOrders.vue';
import ShowOrder from '../views/orders/ShowOrder.vue';
import OrderCreateForm from '../views/orders/OrderCreateForm.vue';
import OrderEditForm from '../views/orders/OrderEditForm.vue';
import OrderView from '../views/orders/OrderView.vue';
import AllOrders from '../views/orders/AllOrders.vue';
import RestaurantIndex from '../views/dishes/RestaurantIndex.vue';
import ShowRestaurant from '../views/dishes/ShowRestaurant.vue';
import RestaurantCreateForm from '../views/dishes/RestaurantCreateForm.vue';
import RestaurantEditForm from '../views/dishes/RestaurantEditForm.vue';
import DishCreateForm from '../views/dishes/DishCreateForm.vue';
import DishEditForm from '../views/dishes/DishEditForm.vue';
import ImportCrawledRestaurantData from '../views/dishes/ImportCrawledRestaurantData.vue';
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
});
//# sourceMappingURL=index.js.map