import router from '../router/index';
import store from "@/store";
import { OrderControllerApi, OrderEntryControllerApi } from "@/frontend-client";
import LocalConfiguration from "./LocalConfiguration";
function headersWithToken() {
    return { headers: { 'Authorization': 'Bearer ' + store.state.token } };
}
var OrdersApiConnector = /** @class */ (function () {
    function OrdersApiConnector(rootState) {
        this.localConfiguration = new LocalConfiguration(rootState);
        this.configuration = this.localConfiguration.createConfiguration();
        this.orderApi = new OrderControllerApi(this.configuration);
        this.orderEntryApi = new OrderEntryControllerApi((this.configuration));
    }
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
        return this.orderEntryApi.save1(formData);
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
        // return ApiConnector.makePost(action, formData)
        return this.orderEntryApi.update1(formData);
    };
    OrdersApiConnector.prototype.deleteDishEntry = function (orderEntryId, dishEntryId) {
        // return ApiConnector.makeGet('/order_entries/' + orderEntryId + '/dish_entry/' + dishEntryId + '/delete')
        return this.orderEntryApi.delete1(orderEntryId, dishEntryId);
    };
    OrdersApiConnector.prototype.fetchOrder = function (orderId) {
        return this.orderApi.show(orderId, headersWithToken());
    };
    OrdersApiConnector.prototype.fetchAllOrders = function () {
        return this.orderApi.allOrders(headersWithToken());
    };
    OrdersApiConnector.prototype.fetchTodaysOrders = function () {
        return this.orderApi.todayOrders(headersWithToken());
    };
    OrdersApiConnector.prototype.fetchOrderView = function (orderId) {
        return this.orderApi.orderViewJson(orderId, headersWithToken());
    };
    OrdersApiConnector.prototype.getOrderCreateData = function () {
        var createResponse = this.orderApi.create(headersWithToken());
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
        return this.orderApi.edit(orderId, headersWithToken());
    };
    OrdersApiConnector.prototype.setOrderAsCreated = function (orderId) {
        // return ApiConnector.makePost('/orders/' + orderId + '/set_as_created')
        return this.orderApi.setAsCreated(orderId);
    };
    OrdersApiConnector.prototype.setOrderAsOrdered = function (orderId) {
        // return ApiConnector.makePost('/orders/' + orderId + '/set_back_as_ordered')
        return this.orderApi.setAsOrdered(orderId);
    };
    OrdersApiConnector.prototype.setOrderAsDelivered = function (orderId) {
        // return ApiConnector.makePost('/orders/' + orderId + '/set_as_delivered')
        return this.orderApi.setAsDelivered(orderId);
    };
    OrdersApiConnector.prototype.setOrderAsRejected = function (orderId) {
        // return ApiConnector.makePost('/orders/' + orderId + '/set_as_rejected')
        return this.orderApi.setAsRejected(orderId);
    };
    OrdersApiConnector.prototype.deleteOrder = function (orderId) {
        // return ApiConnector.makeDelete('/orders/' + orderId + '/delete')
        return this.orderApi._delete(orderId);
    };
    OrdersApiConnector.prototype.markOrderEntryAsPaid = function (orderEntryId) {
        // return ApiConnector.makeGet('/order_entries/' + orderEntryId + '/mark_as_paid')
        return this.orderEntryApi.setAsMarkedAsPaid(orderEntryId);
    };
    OrdersApiConnector.prototype.confirmOrderEntryAsPaid = function (orderEntryId) {
        // return ApiConnector.makeGet('/order_entries/' + orderEntryId + '/confirm_as_paid')
        return this.orderEntryApi.setAsConfirmedAsPaid(orderEntryId);
    };
    OrdersApiConnector.prototype.createOrder = function (order) {
        return this.orderApi.save(order, headersWithToken());
    };
    OrdersApiConnector.prototype.editOrder = function (order) {
        return this.orderApi.update(order);
    };
    OrdersApiConnector.prototype.makeAnOrder = function (orderId, _a) {
        var approxTimeOfDelivery = _a.approxTimeOfDelivery;
        var action = '/orders/' + orderId + '/set_as_ordered';
        var formData = {
            approxTimeOfDelivery: approxTimeOfDelivery.toString()
        };
        return this.orderApi.setAsOrdered1(orderId, formData)
            .then(function () { return router.push("/orders/show/" + orderId); });
        // return ApiConnector.makePost(action, formData)
        //     .then(() => router.push("/orders/show/" + orderId))
    };
    return OrdersApiConnector;
}());
export default OrdersApiConnector;
//# sourceMappingURL=OrdersApiConnector.js.map