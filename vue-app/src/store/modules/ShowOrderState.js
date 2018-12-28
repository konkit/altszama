import OrdersApiConnector from "../../lib/OrdersApiConnector";
import ApiConnector from "../../lib/ApiConnector";

export default {
  namespaced: true,
  state: {
    order: {
      restaurant: {
        name: ""
      },
      orderCreator: {}
    },
    orderEntries: [],
    currentUserId: '',
    allDishesInRestaurant: [],
    allDishesByCategory: [],
    dishIdToSideDishesMap: [],
    totalOrderPrice: 0,

    isEntryCreating: false,
    isEntryEdited: false,
    orderEntryId: "",
    dishEntryId: "",

    editedOrderEntry: {},
  },
  mutations: {
    loadShowOrderData(state, payload) {
      state.order = payload.order;
      state.orderEntries = payload.orderEntries;
      state.currentUserId = payload.currentUserId;
      state.allDishesInRestaurant = payload.allDishesInRestaurant;
      state.allDishesByCategory = payload.allDishesByCategory;
      state.dishIdToSideDishesMap = payload.dishIdToSideDishesMap;
      state.totalOrderPrice = payload.totalOrderPrice;
    },

    setEntryCreating(state, payload) {
      state.isEntryCreating = true;
      state.orderEntryId = "";
      state.dishEntryId = "";
    },

    setEntryEditing(state, payload) {
      state.isEntryEdited = true;
      state.orderEntryId = payload.orderEntryId;
      state.dishEntryId = payload.dishEntryId;
    },

    cancelEntryCreateOrEdit(state, payload) {
      state.isEntryCreating = false;
      state.isEntryEdited = false;
      state.orderEntryId = "";
      state.dishEntryId = "";
    },

    // CREATED / EDITED ORDER

    setEditedOrderEntry(state, payload) {
      state.editedOrderEntry = payload
    },
    clearEditedSideDishes(state, payload) {
      state.editedOrderEntry.chosenSideDishes = []
    },
    setNewDishFlag(state, payload) {
      var newDishValue = payload

      state.editedOrderEntry.newDish = newDishValue;
      if (newDishValue == true) {
        state.editedOrderEntry.dishId = ""
      }
    },
  },
  actions: {
    fetchOrderData({state}, payload) {
      const orderId = payload.orderId;

      OrdersApiConnector
        .fetchOrder(orderId)
        .then(showOrderData => {
          this.commit('showOrder/loadShowOrderData', showOrderData);
          this.commit('setLoadingFalse')
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    saveOrderEntry({state}, {orderId, editedOrderEntry, errorsComponent}) {
      OrdersApiConnector.saveOrderEntry(orderId, editedOrderEntry)
        .then(() => {
          // this.$emit("updateOrder");
          this.commit('setLoadingTrue');
          this.dispatch("showOrder/fetchOrderData", {orderId: orderId});


          this.commit('showOrder/cancelEntryCreateOrEdit', {})
        })
        .catch((error) => {
          console.log("orderEntryCreateEntry error:", error);
          error.body.messages.forEach(msg => errorsComponent.addError(msg));
        });
    },
    editOrderEntry({state}, {orderId, orderEntryId, editedOrderEntry, errorsComponent}) {
      OrdersApiConnector.editOrderEntry(this.order.id, this.orderEntry.id, this.editedOrderEntry)
        .then(() => {
          // this.$emit("updateOrder");
          this.commit('setLoadingTrue');
          this.dispatch("showOrder/fetchOrderData", {orderId: orderId});

          this.commit('showOrder/cancelEntryCreateOrEdit', {})
        })
        .catch((error) => {
          console.log("OrderEntryEditEntry error:", error);
          error.body.messages.forEach(msg => errorsComponent.addError(msg));
        });
    },
    unlockOrder({state}, {orderId}) {
      OrdersApiConnector.setOrderAsCreated(orderId)
        .then(response => {
          this.commit('setLoadingTrue');
          this.dispatch("showOrder/fetchOrderData", {orderId: orderId});
        })
    },
    deleteDishEntry({state}, {orderId, orderEntryId, dishEntryId}) {
      OrdersApiConnector.deleteDishEntry(orderEntryId, dishEntryId)
        .then(successResponse => {
          this.commit('setLoadingTrue');
          this.dispatch("showOrder/fetchOrderData", {orderId: orderId});
        })
        .catch(errResponse => console.log(errResponse));
    },
    confirmOrderEntryAsPaid({state}, {orderEntryId}) {
      OrdersApiConnector.confirmOrderEntryAsPaid(orderEntryId)
        .then(successResponse => window.location.reload())
        .catch(errResponse => console.log(errResponse));
    },
    markOrderEntryAsPaid({state}, {orderEntryId}) {
      OrdersApiConnector.markOrderEntryAsPaid(orderEntryId)
        .then(successResponse => window.location.reload())
        .catch(errResponse => console.log(errResponse));
    },
    setOrderAsCreated({state}, {orderId}) {
      OrdersApiConnector.setOrderAsCreated(orderId)
        .then(successResponse => window.location.reload())
        .catch(errResponse => console.log(errResponse));
    },
    setOrderAsOrdered({state}, {orderId}) {
      OrdersApiConnector.setOrderAsOrdered(orderId)
        .then(successResponse => window.location.reload())
        .catch(errResponse => console.log(errResponse));
    },
    setOrderAsDelivered({state}, {orderId}) {
      OrdersApiConnector.setOrderAsDelivered(orderId)
        .then(successResponse => window.location.reload())
        .catch(errResponse => console.log(errResponse));
    },
    setOrderAsRejected({state}, {orderId}) {
      OrdersApiConnector.setOrderAsRejected(orderId)
        .then(successResponse => window.location.reload())
        .catch(errResponse => console.log(errResponse));
    },
    deleteOrder({state}, {orderId}) {
      OrdersApiConnector.deleteOrder(orderId + '/delete')
        .then(successResponse => window.location.href = '#/orders')
        .catch(errResponse => console.log(errResponse));
    },
  }
};