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
        var formData = {
            orderId: orderId,
            dishId: editedOrderEntry.dishId,
            newDish: editedOrderEntry.newDish,
            newDishName: editedOrderEntry.newDishName,
            newDishPrice: editedOrderEntry.newDishPrice,
            additionalComments: editedOrderEntry.additionalComments,
            sideDishes: editedOrderEntry.chosenSideDishes.map(function (sd) { return Object.assign(sd, { newSideDishPrice: sd.newSideDishPrice }); })
        };
        return this.orderEntryApi.save1(formData, headersWithToken());
    };
    OrdersApiConnector.prototype.updateOrderEntry = function (orderId, orderEntryId, editedOrderEntry) {
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
        return this.orderEntryApi.update1(formData, headersWithToken());
    };
    OrdersApiConnector.prototype.deleteDishEntry = function (orderEntryId, dishEntryId) {
        // return ApiConnector.makeGet('/order_entries/' + orderEntryId + '/dish_entry/' + dishEntryId + '/delete')
        return this.orderEntryApi.delete1(orderEntryId, dishEntryId, headersWithToken());
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
        return this.orderApi.setAsCreated(orderId, headersWithToken());
    };
    OrdersApiConnector.prototype.setOrderAsOrdered = function (orderId) {
        return this.orderApi.setAsOrdered(orderId, headersWithToken());
    };
    OrdersApiConnector.prototype.setOrderAsDelivered = function (orderId) {
        return this.orderApi.setAsDelivered(orderId, headersWithToken());
    };
    OrdersApiConnector.prototype.setOrderAsRejected = function (orderId) {
        return this.orderApi.setAsRejected(orderId, headersWithToken());
    };
    OrdersApiConnector.prototype.deleteOrder = function (orderId) {
        return this.orderApi._delete(orderId, headersWithToken());
    };
    OrdersApiConnector.prototype.markOrderEntryAsPaid = function (orderEntryId) {
        return this.orderEntryApi.setAsMarkedAsPaid(orderEntryId, headersWithToken());
    };
    OrdersApiConnector.prototype.confirmOrderEntryAsPaid = function (orderEntryId) {
        return this.orderEntryApi.setAsConfirmedAsPaid(orderEntryId, headersWithToken());
    };
    OrdersApiConnector.prototype.createOrder = function (order) {
        return this.orderApi.save(order, headersWithToken());
    };
    OrdersApiConnector.prototype.editOrder = function (order) {
        return this.orderApi.update(order, headersWithToken());
    };
    OrdersApiConnector.prototype.makeAnOrder = function (orderId, formData) {
        return this.orderApi.setAsOrdered1(formData, orderId, headersWithToken())
            .then(function () { return router.push("/orders/show/" + orderId); });
    };
    return OrdersApiConnector;
}());
export default OrdersApiConnector;
//# sourceMappingURL=OrdersApiConnector.js.map