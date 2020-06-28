var _a, _b;
import OrdersApiConnector from "../../lib/OrdersApiConnector";
import ApiConnector from "../../lib/ApiConnector";
import router from '../../router/index';
export var NAMESPACE_SHOW_ORDER = "showOrder";
export var LOAD_SHOW_ORDER_DATA = "LOAD_SHOW_ORDER_DATA";
export var FETCH_ORDER_DATA_ACTION = "FETCH_ORDER_DATA_ACTION";
export var UNLOCK_ORDER_ACTION = "UNLOCK_ORDER_ACTION";
export var DELETE_DISH_ENTRY_ACTION = "DELETE_DISH_ENTRY_ACTION";
export var CONFIRM_ORDER_ENTRY_AS_PAID_ACTION = "CONFIRM_ORDER_ENTRY_AS_PAID_ACTION";
export var MARK_ORDER_ENTRY_AS_PAID_ACTION = "MARK_ORDER_ENTRY_AS_PAID_ACTION";
export var SET_ORDER_AS_CREATED_ACTION = "SET_ORDER_AS_CREATED_ACTION";
export var SET_ORDER_AS_ORDERED_ACTION = "SET_ORDER_AS_ORDERED_ACTION";
export var SET_ORDER_AS_DELIVERED_ACTION = "SET_ORDER_AS_DELIVERED_ACTION";
export var SET_ORDER_AS_REJECTED_ACTION = "SET_ORDER_AS_REJECTED_ACTION";
export var DELETE_ORDER_ACTION = "DELETE_ORDER_ACTION";
var showOrderState = {
    order: {
        restaurant: {
            name: ""
        },
        orderState: "",
        orderCreator: {}
    },
    orderEntries: [],
    currentUserId: '',
    allDishesInRestaurant: [],
    allDishesByCategory: {},
    dishIdToSideDishesMap: [],
    totalOrderPrice: 0,
    baseOrderPrice: 0,
};
export var showOrderModule = {
    namespaced: true,
    state: showOrderState,
    mutations: (_a = {},
        _a[LOAD_SHOW_ORDER_DATA] = function (state, payload) {
            state.order = payload.order;
            state.orderEntries = payload.orderEntries;
            state.currentUserId = payload.currentUserId;
            state.allDishesInRestaurant = payload.allDishesInRestaurant;
            state.allDishesByCategory = payload.allDishesByCategory;
            state.dishIdToSideDishesMap = payload.dishIdToSideDishesMap;
            state.totalOrderPrice = payload.totalOrderPrice;
            state.baseOrderPrice = payload.baseOrderPrice;
        },
        _a),
    actions: (_b = {},
        _b[FETCH_ORDER_DATA_ACTION] = function (_a, payload) {
            var _this = this;
            var state = _a.state, rootState = _a.rootState;
            var orderId = payload.orderId;
            new OrdersApiConnector(rootState)
                .fetchOrder(orderId)
                .then(function (showOrderData) {
                _this.commit(NAMESPACE_SHOW_ORDER + "/" + LOAD_SHOW_ORDER_DATA, showOrderData);
                _this.commit('setLoadingFalse');
                document.title = "Order from " + state.order.restaurantName + " (" + state.order.orderDate + ") | Alt Szama";
            })
                .catch(function (errResponse) { return ApiConnector.handleError(errResponse); });
        },
        _b[UNLOCK_ORDER_ACTION] = function (_a) {
            var _this = this;
            var state = _a.state, rootState = _a.rootState;
            new OrdersApiConnector(rootState).setOrderAsCreated(state.order.id)
                .then(function () {
                _this.commit('setLoadingTrue');
                _this.dispatch(NAMESPACE_SHOW_ORDER + "/" + FETCH_ORDER_DATA_ACTION, { orderId: state.order.id });
            })
                .catch(function (errResponse) { return ApiConnector.handleError(errResponse); });
        },
        _b[DELETE_DISH_ENTRY_ACTION] = function (_a, _b) {
            var _this = this;
            var state = _a.state, rootState = _a.rootState;
            var orderEntryId = _b.orderEntryId, dishEntryId = _b.dishEntryId;
            new OrdersApiConnector(rootState).deleteDishEntry(orderEntryId, dishEntryId)
                .then(function () {
                _this.commit('setLoadingTrue');
                _this.dispatch(NAMESPACE_SHOW_ORDER + "/" + FETCH_ORDER_DATA_ACTION, { orderId: state.order.id });
            })
                .catch(function (errResponse) { return ApiConnector.handleError(errResponse); });
        },
        _b[CONFIRM_ORDER_ENTRY_AS_PAID_ACTION] = function (_a, _b) {
            var _this = this;
            var state = _a.state, rootState = _a.rootState;
            var orderEntryId = _b.orderEntryId;
            new OrdersApiConnector(rootState).confirmOrderEntryAsPaid(orderEntryId)
                .then(function () {
                _this.commit('setLoadingTrue');
                _this.dispatch(NAMESPACE_SHOW_ORDER + "/" + FETCH_ORDER_DATA_ACTION, { orderId: state.order.id });
            })
                .catch(function (errResponse) { return ApiConnector.handleError(errResponse); });
        },
        _b[MARK_ORDER_ENTRY_AS_PAID_ACTION] = function (_a, _b) {
            var _this = this;
            var state = _a.state, rootState = _a.rootState;
            var orderEntryId = _b.orderEntryId;
            new OrdersApiConnector(rootState).markOrderEntryAsPaid(orderEntryId)
                .then(function () {
                _this.commit('setLoadingTrue');
                _this.dispatch(NAMESPACE_SHOW_ORDER + "/" + FETCH_ORDER_DATA_ACTION, { orderId: state.order.id });
            })
                .catch(function (errResponse) { return ApiConnector.handleError(errResponse); });
        },
        _b[SET_ORDER_AS_CREATED_ACTION] = function (_a, _b) {
            var _this = this;
            var state = _a.state, rootState = _a.rootState;
            var orderId = _b.orderId;
            new OrdersApiConnector(rootState).setOrderAsCreated(orderId)
                .then(function () {
                _this.commit('setLoadingTrue');
                _this.dispatch(NAMESPACE_SHOW_ORDER + "/" + FETCH_ORDER_DATA_ACTION, { orderId: state.order.id });
            })
                .catch(function (errResponse) { return ApiConnector.handleError(errResponse); });
        },
        _b[SET_ORDER_AS_ORDERED_ACTION] = function (_a, _b) {
            var _this = this;
            var state = _a.state, rootState = _a.rootState;
            var orderId = _b.orderId;
            new OrdersApiConnector(rootState).setOrderAsOrdered(orderId)
                .then(function () {
                _this.commit('setLoadingTrue');
                _this.dispatch(NAMESPACE_SHOW_ORDER + "/" + FETCH_ORDER_DATA_ACTION, { orderId: state.order.id });
            })
                .catch(function (errResponse) { return ApiConnector.handleError(errResponse); });
        },
        _b[SET_ORDER_AS_DELIVERED_ACTION] = function (_a, _b) {
            var _this = this;
            var state = _a.state, rootState = _a.rootState;
            var orderId = _b.orderId;
            new OrdersApiConnector(rootState).setOrderAsDelivered(orderId)
                .then(function () {
                _this.commit('setLoadingTrue');
                _this.dispatch(NAMESPACE_SHOW_ORDER + "/" + FETCH_ORDER_DATA_ACTION, { orderId: state.order.id });
            })
                .catch(function (errResponse) { return ApiConnector.handleError(errResponse); });
        },
        _b[SET_ORDER_AS_REJECTED_ACTION] = function (_a, _b) {
            var _this = this;
            var state = _a.state, rootState = _a.rootState;
            var orderId = _b.orderId;
            new OrdersApiConnector(rootState).setOrderAsRejected(orderId)
                .then(function () {
                _this.commit('setLoadingTrue');
                _this.dispatch(NAMESPACE_SHOW_ORDER + "/" + FETCH_ORDER_DATA_ACTION, { orderId: state.order.id });
            })
                .catch(function (errResponse) { return ApiConnector.handleError(errResponse); });
        },
        _b[DELETE_ORDER_ACTION] = function (_a, _b) {
            var rootState = _a.rootState;
            var orderId = _b.orderId;
            new OrdersApiConnector(rootState).deleteOrder(orderId)
                .then(function () { return router.push('/orders'); })
                .catch(function (errResponse) { return ApiConnector.handleError(errResponse); });
        },
        _b)
};
//# sourceMappingURL=ShowOrderModule.js.map