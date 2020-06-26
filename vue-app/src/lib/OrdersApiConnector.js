import ApiConnector from "./ApiConnector";
import router from '../router/index';
import store from "@/store";
import { Configuration, OrderControllerApi } from "@/frontend-client";
function headersWithToken() {
    return { headers: { 'Authorization': 'Bearer ' + store.state.token } };
}
var OrdersApiConnector = /** @class */ (function () {
    function OrdersApiConnector() {
    }
    OrdersApiConnector.prototype.createConfiguration = function () {
        var currentDomain = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
        var backendUrl = process.env.VUE_APP_BACKEND_URL2 || currentDomain;
        return new Configuration({
            basePath: backendUrl,
            accessToken: store.state.token || ""
        });
    };
    OrdersApiConnector.prototype.createOrderApi = function () {
        return new OrderControllerApi(this.createConfiguration());
    };
    OrdersApiConnector.prototype.saveOrderEntry = function (orderId, editedOrderEntry) {
        var action = "/order_entries/save";
        var formData = {
            orderId: orderId,
            dishId: editedOrderEntry.dishId,
            newDish: editedOrderEntry.newDish,
            newDishName: editedOrderEntry.newDishName,
            newDishPrice: editedOrderEntry.newDishPrice,
            additionalComments: editedOrderEntry.additionalComments,
            sideDishes: editedOrderEntry.chosenSideDishes.map(function (sd) { return Object.assign(sd, { newSideDishPrice: sd.newSideDishPrice }); })
        };
        return ApiConnector.makePost(action, formData);
    };
    OrdersApiConnector.prototype.updateOrderEntry = function (orderId, orderEntryId, editedOrderEntry) {
        var action = "/order_entries/update";
        var formData = {
            id: orderEntryId,
            orderId: orderId,
            dishEntryId: editedOrderEntry.dishEntryId,
            dishId: editedOrderEntry.dishId,
            newDish: editedOrderEntry.newDish,
            newDishName: editedOrderEntry.newDishName,
            newDishPrice: editedOrderEntry.newDishPrice,
            additionalComments: editedOrderEntry.additionalComments,
            sideDishes: editedOrderEntry.chosenSideDishes.map(function (sd) { return Object.assign({}, sd, { newSideDishPrice: sd.newSideDishPrice }); })
        };
        return ApiConnector.makePost(action, formData);
    };
    OrdersApiConnector.prototype.deleteDishEntry = function (orderEntryId, dishEntryId) {
        return ApiConnector.makeGet('/order_entries/' + orderEntryId + '/dish_entry/' + dishEntryId + '/delete');
    };
    OrdersApiConnector.prototype.fetchOrder = function (orderId) {
        // return ApiConnector.makeGet("/orders/" + orderId + "/show.json")
        //   .then(response => {
        //     return {
        //       order: response.data.order,
        //       orderEntries: response.data.orderEntries,
        //       currentUserId: response.data.currentUserId,
        //       allDishesInRestaurant: response.data.allDishesInRestaurant,
        //       allDishesByCategory: convertToMapEntries(response.data.allDishesByCategory),
        //       dishIdToSideDishesMap: response.data.dishIdToSideDishesMap,
        //       totalOrderPrice: response.data.totalOrderPrice,
        //       baseOrderPrice: response.data.baseOrderPrice
        //     };
        //   })
        return this.createOrderApi().show(orderId, headersWithToken());
    };
    OrdersApiConnector.prototype.fetchAllOrders = function () {
        // return ApiConnector.makeGet("/orders/all.json")
        //   .then(response => {
        //       return response.data.allOrdersList;
        //   })
        return this.createOrderApi().allOrders(headersWithToken());
    };
    OrdersApiConnector.prototype.fetchTodaysOrders = function () {
        // return ApiConnector.makeGet("/orders/today.json")
        //   .then(response => {
        //     return {
        //       currentOrderEntries: response.data.currentOrderEntries,
        //       ordersList: response.data.ordersList
        //     }
        //   })
        return this.createOrderApi().todayOrders(headersWithToken());
    };
    OrdersApiConnector.prototype.fetchOrderView = function (orderId) {
        // return ApiConnector.makeGet("/orders/" + orderId + "/order_view.json")
        //     .then(response => {
        //       return {
        //         orderState: response.data.orderState,
        //         orderDecreaseInPercent: response.data.orderDecreaseInPercent,
        //         orderDeliveryCostPerEverybody: response.data.orderDeliveryCostPerEverybody,
        //         orderDeliveryCostPerDish: response.data.orderDeliveryCostPerDish,
        //         restaurantName: response.data.restaurantName,
        //         restaurantTelephone: response.data.restaurantTelephone,
        //         groupedEntries: response.data.groupedEntries,
        //         allEatingPeopleCount: response.data.allEatingPeopleCount,
        //         basePriceSum: response.data.basePriceSum,
        //         totalPrice: response.data.totalPrice
        //       }
        //     })
        return this.createOrderApi().orderViewJson(orderId, headersWithToken());
    };
    OrdersApiConnector.prototype.getOrderCreateData = function () {
        var createResponse = this.createOrderApi().create(headersWithToken());
        return createResponse
            .then(function (response) {
            var restaurantId;
            if (response.restaurant != null) {
                restaurantId = response.restaurant.id;
            }
            else if (response.restaurantsList.length > 0) {
                restaurantId = response.restaurantsList[0].id;
            }
            var bankTransferNumber = "";
            var paymentByBankTransfer = false;
            if (response.bankTransferNumber) {
                paymentByBankTransfer = true;
                bankTransferNumber = response.bankTransferNumber;
            }
            var blikPhoneNumber = "";
            var paymentByBlik = false;
            if (response.blikPhoneNumber) {
                paymentByBlik = true;
                blikPhoneNumber = response.blikPhoneNumber;
            }
            return {
                restaurantsList: response.restaurantsList,
                order: {
                    restaurantId: restaurantId,
                    orderDate: response.orderDate,
                    timeOfOrder: response.timeOfOrder,
                    decreaseInPercent: 0,
                    deliveryCostPerEverybody: 0,
                    deliveryCostPerDish: 0,
                    paymentByCash: true,
                    paymentByBankTransfer: paymentByBankTransfer,
                    bankTransferNumber: bankTransferNumber,
                    paymentByBlik: paymentByBlik,
                    blikPhoneNumber: blikPhoneNumber
                }
            };
        });
    };
    OrdersApiConnector.prototype.getOrderEditData = function (orderId) {
        // return ApiConnector.makeGet("/orders/" + orderId + "/edit.json")
        //     .then(response => {
        //       return {
        //         order: {
        //           restaurantId: response.data.order.restaurantId,
        //           restaurantName: response.data.order.restaurantName,
        //           orderDate: response.data.order.orderDate,
        //           timeOfOrder: response.data.order.timeOfOrder,
        //           decreaseInPercent: response.data.order.decreaseInPercent,
        //           deliveryCostPerEverybody: response.data.order.deliveryCostPerEverybody,
        //           deliveryCostPerDish: response.data.order.deliveryCostPerDish,
        //           paymentByCash: response.data.order.paymentByCash,
        //           paymentByBankTransfer: response.data.order.paymentByBankTransfer,
        //           bankTransferNumber: response.data.order.bankTransferNumber,
        //           paymentByBlik: response.data.order.paymentByBlik,
        //           blikPhoneNumber: response.data.order.blikPhoneNumber
        //         }
        //       }
        //     })
        return this.createOrderApi().edit(orderId, headersWithToken());
    };
    OrdersApiConnector.prototype.setOrderAsCreated = function (orderId) {
        return ApiConnector.makePost('/orders/' + orderId + '/set_as_created');
    };
    OrdersApiConnector.prototype.setOrderAsOrdered = function (orderId) {
        return ApiConnector.makePost('/orders/' + orderId + '/set_back_as_ordered');
    };
    OrdersApiConnector.prototype.setOrderAsDelivered = function (orderId) {
        return ApiConnector.makePost('/orders/' + orderId + '/set_as_delivered');
    };
    OrdersApiConnector.prototype.setOrderAsRejected = function (orderId) {
        return ApiConnector.makePost('/orders/' + orderId + '/set_as_rejected');
    };
    OrdersApiConnector.prototype.deleteOrder = function (orderId) {
        return ApiConnector.makeDelete('/orders/' + orderId + '/delete');
    };
    OrdersApiConnector.prototype.markOrderEntryAsPaid = function (orderEntryId) {
        return ApiConnector.makeGet('/order_entries/' + orderEntryId + '/mark_as_paid');
    };
    OrdersApiConnector.prototype.confirmOrderEntryAsPaid = function (orderEntryId) {
        return ApiConnector.makeGet('/order_entries/' + orderEntryId + '/confirm_as_paid');
    };
    OrdersApiConnector.prototype.createOrder = function (order) {
        // let formData = {
        //   restaurantId: order.restaurantId,
        //   orderDate: order.orderDate,
        //   timeOfOrder: order.timeOfOrder,
        //   decreaseInPercent: order.decreaseInPercent,
        //   deliveryCostPerEverybody: order.deliveryCostPerEverybody,
        //   deliveryCostPerDish: order.deliveryCostPerDish,
        //   paymentByCash: order.paymentByCash === true,
        //   paymentByBankTransfer: order.paymentByBankTransfer === true,
        //   bankTransferNumber: order.bankTransferNumber,
        //   paymentByBlik: order.paymentByBlik === true,
        //   blikPhoneNumber: order.blikPhoneNumber
        // };
        //
        // return ApiConnector.makePost("/orders/save", formData)
        //   .then(response => router.push("/orders/"))
        return this.createOrderApi().save(order, headersWithToken());
    };
    OrdersApiConnector.prototype.editOrder = function (order) {
        // let formData = {
        //   orderId: orderId,
        //   restaurantId: order.restaurantId,
        //   orderDate: order.orderDate,
        //   timeOfOrder: order.timeOfOrder,
        //   decreaseInPercent: order.decreaseInPercent,
        //   deliveryCostPerEverybody: order.deliveryCostPerEverybody,
        //   deliveryCostPerDish: order.deliveryCostPerDish,
        //   paymentByCash: order.paymentByCash === true,
        //   paymentByBankTransfer: order.paymentByBankTransfer === true,
        //   bankTransferNumber: order.bankTransferNumber,
        //   paymentByBlik: order.paymentByBlik === true,
        //   blikPhoneNumber: order.blikPhoneNumber
        // };
        //
        // return ApiConnector.makePost("/orders/update", formData)
        //   .then(response => router.push("/orders/show/" + orderId))
        return this.createOrderApi().update(order);
    };
    OrdersApiConnector.prototype.makeAnOrder = function (orderId, _a) {
        var approxTimeOfDelivery = _a.approxTimeOfDelivery;
        var action = '/orders/' + orderId + '/set_as_ordered';
        var formData = {
            approxTimeOfDelivery: approxTimeOfDelivery.toString()
        };
        return ApiConnector.makePost(action, formData)
            .then(function (response) { return router.push("/orders/show/" + orderId); });
    };
    return OrdersApiConnector;
}());
export default OrdersApiConnector;
function convertToMapEntries(dishesMap) {
    var result = [];
    for (var _i = 0, _a = Object.keys(dishesMap); _i < _a.length; _i++) {
        var key = _a[_i];
        result.push({ "category": key, "dishes": dishesMap[key] });
    }
    return result;
}
//# sourceMappingURL=OrdersApiConnector.js.map