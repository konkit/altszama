import ErrorHandler from "../../lib/ErrorHandler";
import router from "../../router/index";
import { Module } from "vuex";
import { RootState } from "@/store";
import {
  DishDto,
  ParticipantsOrderEntry,
  ShowOrderDto,
  ShowOrderResponse,
  SideDish
} from "@/frontend-client";
import OrdersApiConnector from "@/lib/api/OrdersApiConnector";


const ordersConnector = new OrdersApiConnector()


export const NAMESPACE_SHOW_ORDER = "showOrder";

export const LOAD_SHOW_ORDER_DATA = "LOAD_SHOW_ORDER_DATA";
export const FETCH_ORDER_DATA_ACTION = "FETCH_ORDER_DATA_ACTION";
export const UNLOCK_ORDER_ACTION = "UNLOCK_ORDER_ACTION";
export const DELETE_DISH_ENTRY_ACTION = "DELETE_DISH_ENTRY_ACTION";
export const CONFIRM_ORDER_ENTRY_AS_PAID_ACTION =
  "CONFIRM_ORDER_ENTRY_AS_PAID_ACTION";
export const MARK_ORDER_ENTRY_AS_PAID_ACTION =
  "MARK_ORDER_ENTRY_AS_PAID_ACTION";
export const SET_ORDER_AS_CREATED_ACTION = "SET_ORDER_AS_CREATED_ACTION";
export const SET_ORDER_AS_ORDERED_ACTION = "SET_ORDER_AS_ORDERED_ACTION";
export const SET_ORDER_AS_DELIVERED_ACTION = "SET_ORDER_AS_DELIVERED_ACTION";
export const SET_ORDER_AS_REJECTED_ACTION = "SET_ORDER_AS_REJECTED_ACTION";
export const DELETE_ORDER_ACTION = "DELETE_ORDER_ACTION";

export interface ShowOrderState {
  order: ShowOrderDto;
  orderEntries: ParticipantsOrderEntry[];
  currentUserId: string;
  allDishesInRestaurant: DishDto[];
  allDishesByCategory: { [category: string]: DishDto[] };
  dishIdToSideDishesMap: { [key: string]: SideDish[] };
  totalOrderPrice: number;
  baseOrderPrice: number;
}

const showOrderState: ShowOrderState = {
  order: {
    id: "",
    restaurantId: "",
    restaurantName: "",
    restaurantUrl: "",
    orderCreatorId: "",
    orderCreatorUsername: "",
    orderDate: "",
    orderState: ShowOrderDto.OrderStateEnum.CREATED,
    deliveryData: {
      decreaseInPercent: 0,
      deliveryCostPerDish: 0,
      deliveryCostPerEverybody: 0
    },
    paymentData: {
      paymentByCash: false,
      paymentByBankTransfer: false,
      paymentByBlik: false,
      bankTransferNumber: "",
      blikPhoneNumber: ""
    }
  },
  orderEntries: [],
  currentUserId: "",
  allDishesInRestaurant: [],
  allDishesByCategory: {},
  dishIdToSideDishesMap: {},
  totalOrderPrice: 0,
  baseOrderPrice: 0
};

export const showOrderModule: Module<ShowOrderState, RootState> = {
  namespaced: true,

  state: showOrderState,

  mutations: {
    [LOAD_SHOW_ORDER_DATA](state, payload: ShowOrderResponse) {
      state.order = payload.order;
      state.orderEntries = payload.orderEntries;
      state.currentUserId = payload.currentUserId;
      state.allDishesInRestaurant = payload.allDishesInRestaurant;
      state.allDishesByCategory = payload.allDishesByCategory;
      state.dishIdToSideDishesMap = payload.dishIdToSideDishesMap;
      state.totalOrderPrice = payload.totalOrderPrice;
      state.baseOrderPrice = payload.baseOrderPrice;
    }
  },

  actions: {
    [FETCH_ORDER_DATA_ACTION]({ state, rootState }, orderId) {
      ordersConnector
        .fetchOrder(orderId)
        .then(showOrderData => {
          this.commit(
            `${NAMESPACE_SHOW_ORDER}/${LOAD_SHOW_ORDER_DATA}`,
            showOrderData
          );
          this.commit("setLoadingFalse");
          this.commit("setTitle", `[${state.order.orderState}] Order from ${state.order.restaurantName} (${state.order.orderDate})`)
        })
        .catch(errResponse => ErrorHandler.handleError(errResponse));
    },

    [UNLOCK_ORDER_ACTION]({ state, rootState }) {
      ordersConnector
        .setOrderAsCreated(state.order.id)
        .then(() => {
          this.commit("setLoadingTrue");
          this.dispatch(
            `${NAMESPACE_SHOW_ORDER}/${FETCH_ORDER_DATA_ACTION}`,
            state.order.id
          );
        })
        .catch(errResponse => ErrorHandler.handleError(errResponse));
    },
    [DELETE_DISH_ENTRY_ACTION](
      { state, rootState },
      { orderEntryId, dishEntryId }
    ) {
      ordersConnector
        .deleteDishEntry(orderEntryId, dishEntryId)
        .then(() => {
          this.commit("setLoadingTrue");
          this.dispatch(
            `${NAMESPACE_SHOW_ORDER}/${FETCH_ORDER_DATA_ACTION}`,
            state.order.id
          );
        })
        .catch(errResponse => ErrorHandler.handleError(errResponse));
    },
    [CONFIRM_ORDER_ENTRY_AS_PAID_ACTION](
      { state, rootState },
      { orderEntryId }
    ) {
      ordersConnector
        .confirmOrderEntryAsPaid(orderEntryId)
        .then(() => {
          this.commit("setLoadingTrue");
          this.dispatch(
            `${NAMESPACE_SHOW_ORDER}/${FETCH_ORDER_DATA_ACTION}`,
            state.order.id
          );
        })
        .catch(errResponse => ErrorHandler.handleError(errResponse));
    },
    [MARK_ORDER_ENTRY_AS_PAID_ACTION]({ state, rootState }, { orderEntryId }) {
      ordersConnector
        .markOrderEntryAsPaid(orderEntryId)
        .then(() => {
          this.commit("setLoadingTrue");
          this.dispatch(
            `${NAMESPACE_SHOW_ORDER}/${FETCH_ORDER_DATA_ACTION}`,
            state.order.id
          );
        })
        .catch(errResponse => ErrorHandler.handleError(errResponse));
    },
    [SET_ORDER_AS_CREATED_ACTION]({ state, rootState }, { orderId }) {
      ordersConnector
        .setOrderAsCreated(orderId)
        .then(() => {
          this.commit("setLoadingTrue");
          this.dispatch(
            `${NAMESPACE_SHOW_ORDER}/${FETCH_ORDER_DATA_ACTION}`,
            state.order.id
          );
        })
        .catch(errResponse => ErrorHandler.handleError(errResponse));
    },
    [SET_ORDER_AS_ORDERED_ACTION]({ state, rootState }, { orderId }) {
      ordersConnector
        .setOrderAsOrdered(orderId)
        .then(() => {
          this.commit("setLoadingTrue");
          this.dispatch(
            `${NAMESPACE_SHOW_ORDER}/${FETCH_ORDER_DATA_ACTION}`,
            state.order.id
          );
        })
        .catch(errResponse => ErrorHandler.handleError(errResponse));
    },
    [SET_ORDER_AS_DELIVERED_ACTION]({ state, rootState }, { orderId }) {
      ordersConnector
        .setOrderAsDelivered(orderId)
        .then(() => {
          this.commit("setLoadingTrue");
          this.dispatch(
            `${NAMESPACE_SHOW_ORDER}/${FETCH_ORDER_DATA_ACTION}`,
            state.order.id
          );
        })
        .catch(errResponse => ErrorHandler.handleError(errResponse));
    },
    [SET_ORDER_AS_REJECTED_ACTION]({ state, rootState }, { orderId }) {
      ordersConnector
        .setOrderAsRejected(orderId)
        .then(() => {
          this.commit("setLoadingTrue");
          this.dispatch(
            `${NAMESPACE_SHOW_ORDER}/${FETCH_ORDER_DATA_ACTION}`,
            state.order.id
          );
        })
        .catch(errResponse => ErrorHandler.handleError(errResponse));
    },
    [DELETE_ORDER_ACTION]({ rootState }, { orderId }) {
      ordersConnector
        .deleteOrder(orderId)
        .then(() => router.push({name: "TodayOrders"}))
        .catch(errResponse => ErrorHandler.handleError(errResponse));
    }
  }
};
