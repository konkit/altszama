import ApiConnector from "./ApiConnector";
import router from '../router/index';
export default {
    saveOrderEntry: function (orderId, editedOrderEntry) {
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
    },
    updateOrderEntry: function (orderId, orderEntryId, editedOrderEntry) {
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
    },
    deleteDishEntry: function (orderEntryId, dishEntryId) {
        return ApiConnector.makeGet('/order_entries/' + orderEntryId + '/dish_entry/' + dishEntryId + '/delete');
    },
    fetchOrder: function (orderId) {
        return ApiConnector.makeGet("/orders/" + orderId + "/show.json")
            .then(function (response) {
            return {
                order: response.data.order,
                orderEntries: response.data.orderEntries,
                currentUserId: response.data.currentUserId,
                allDishesInRestaurant: response.data.allDishesInRestaurant,
                allDishesByCategory: convertToMapEntries(response.data.allDishesByCategory),
                dishIdToSideDishesMap: response.data.dishIdToSideDishesMap,
                totalOrderPrice: response.data.totalOrderPrice,
                baseOrderPrice: response.data.baseOrderPrice
            };
        });
    },
    fetchAllOrders: function () {
        return ApiConnector.makeGet("/orders/all.json")
            .then(function (response) {
            return response.data.allOrdersList;
        });
    },
    fetchTodaysOrders: function () {
        return ApiConnector.makeGet("/orders/today.json")
            .then(function (response) {
            return {
                currentOrderEntries: response.data.currentOrderEntries,
                ordersList: response.data.ordersList
            };
        });
    },
    fetchOrderView: function (orderId) {
        return ApiConnector.makeGet("/orders/" + orderId + "/order_view.json")
            .then(function (response) {
            return {
                orderState: response.data.orderState,
                orderDecreaseInPercent: response.data.orderDecreaseInPercent,
                orderDeliveryCostPerEverybody: response.data.orderDeliveryCostPerEverybody,
                orderDeliveryCostPerDish: response.data.orderDeliveryCostPerDish,
                restaurantName: response.data.restaurantName,
                restaurantTelephone: response.data.restaurantTelephone,
                groupedEntries: response.data.groupedEntries,
                allEatingPeopleCount: response.data.allEatingPeopleCount,
                basePriceSum: response.data.basePriceSum,
                totalPrice: response.data.totalPrice
            };
        });
    },
    getOrderCreateData: function () {
        var createResponse = ApiConnector.makeGet("/orders/create.json");
        return createResponse
            .then(function (response) {
            var restaurantId;
            if (response.data.restaurant != null) {
                restaurantId = response.data.restaurant.id;
            }
            else if (response.data.restaurantsList.length > 0) {
                restaurantId = response.data.restaurantsList[0].id;
            }
            var bankTransferNumber = "";
            var paymentByBankTransfer = false;
            if (response.data.bankTransferNumber) {
                paymentByBankTransfer = true;
                bankTransferNumber = response.data.bankTransferNumber;
            }
            var blikPhoneNumber = "";
            var paymentByBlik = false;
            if (response.data.blikPhoneNumber) {
                paymentByBlik = true;
                blikPhoneNumber = response.data.blikPhoneNumber;
            }
            return {
                restaurantsList: response.data.restaurantsList,
                order: {
                    restaurantId: restaurantId,
                    orderDate: response.data.orderDate,
                    timeOfOrder: response.data.timeOfOrder,
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
    },
    getOrderEditData: function (orderId) {
        return ApiConnector.makeGet("/orders/" + orderId + "/edit.json")
            .then(function (response) {
            return {
                order: {
                    restaurantId: response.data.order.restaurantId,
                    restaurantName: response.data.order.restaurantName,
                    orderDate: response.data.order.orderDate,
                    timeOfOrder: response.data.order.timeOfOrder,
                    decreaseInPercent: response.data.order.decreaseInPercent,
                    deliveryCostPerEverybody: response.data.order.deliveryCostPerEverybody,
                    deliveryCostPerDish: response.data.order.deliveryCostPerDish,
                    paymentByCash: response.data.order.paymentByCash,
                    paymentByBankTransfer: response.data.order.paymentByBankTransfer,
                    bankTransferNumber: response.data.order.bankTransferNumber,
                    paymentByBlik: response.data.order.paymentByBlik,
                    blikPhoneNumber: response.data.order.blikPhoneNumber
                }
            };
        });
    },
    setOrderAsCreated: function (orderId) {
        return ApiConnector.makePost('/orders/' + orderId + '/set_as_created');
    },
    setOrderAsOrdered: function (orderId) {
        return ApiConnector.makePost('/orders/' + orderId + '/set_back_as_ordered');
    },
    setOrderAsDelivered: function (orderId) {
        return ApiConnector.makePost('/orders/' + orderId + '/set_as_delivered');
    },
    setOrderAsRejected: function (orderId) {
        return ApiConnector.makePost('/orders/' + orderId + '/set_as_rejected');
    },
    deleteOrder: function (orderId) {
        return ApiConnector.makeDelete('/orders/' + orderId + '/delete');
    },
    markOrderEntryAsPaid: function (orderEntryId) {
        return ApiConnector.makeGet('/order_entries/' + orderEntryId + '/mark_as_paid');
    },
    confirmOrderEntryAsPaid: function (orderEntryId) {
        return ApiConnector.makeGet('/order_entries/' + orderEntryId + '/confirm_as_paid');
    },
    createOrder: function (order) {
        var formData = {
            restaurantId: order.restaurantId,
            orderDate: order.orderDate,
            timeOfOrder: order.timeOfOrder,
            decreaseInPercent: order.decreaseInPercent,
            deliveryCostPerEverybody: order.deliveryCostPerEverybody,
            deliveryCostPerDish: order.deliveryCostPerDish,
            paymentByCash: order.paymentByCash === true,
            paymentByBankTransfer: order.paymentByBankTransfer === true,
            bankTransferNumber: order.bankTransferNumber,
            paymentByBlik: order.paymentByBlik === true,
            blikPhoneNumber: order.blikPhoneNumber
        };
        return ApiConnector.makePost("/orders/save", formData)
            .then(function (response) { return router.push("/orders/"); });
    },
    editOrder: function (orderId, order) {
        var formData = {
            orderId: orderId,
            restaurantId: order.restaurantId,
            orderDate: order.orderDate,
            timeOfOrder: order.timeOfOrder,
            decreaseInPercent: order.decreaseInPercent,
            deliveryCostPerEverybody: order.deliveryCostPerEverybody,
            deliveryCostPerDish: order.deliveryCostPerDish,
            paymentByCash: order.paymentByCash === true,
            paymentByBankTransfer: order.paymentByBankTransfer === true,
            bankTransferNumber: order.bankTransferNumber,
            paymentByBlik: order.paymentByBlik === true,
            blikPhoneNumber: order.blikPhoneNumber
        };
        return ApiConnector.makePost("/orders/update", formData)
            .then(function (response) { return router.push("/orders/show/" + orderId); });
    },
    makeAnOrder: function (orderId, _a) {
        var approxTimeOfDelivery = _a.approxTimeOfDelivery;
        var action = '/orders/' + orderId + '/set_as_ordered';
        var formData = {
            approxTimeOfDelivery: approxTimeOfDelivery.toString()
        };
        return ApiConnector.makePost(action, formData)
            .then(function (response) { return router.push("/orders/show/" + orderId); });
    }
};
function convertToMapEntries(dishesMap) {
    var result = [];
    for (var _i = 0, _a = Object.keys(dishesMap); _i < _a.length; _i++) {
        var key = _a[_i];
        result.push({ "category": key, "dishes": dishesMap[key] });
    }
    return result;
}
//# sourceMappingURL=OrdersApiConnector.js.map