import ErrorHandler from "../../lib/ErrorHandler";
import {Module} from "vuex";
import {RootState} from "@/store";
import {DishDto, ParticipantsOrderEntry, ShowOrderDto, ShowOrderResponse, SideDish} from "@/frontend-client";
import OrdersApiConnector from "@/lib/api/OrdersApiConnector";


const ordersConnector = new OrdersApiConnector()

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
    loadShowOrderData(state, payload: ShowOrderResponse) {
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
    fetchOrderDataAction({ state, rootState }, orderId) {
      ordersConnector
        .fetchOrder(orderId)
        .then(showOrderData => {
          this.commit("showOrder/loadShowOrderData",showOrderData);
          this.commit("setLoadingFalse");
          this.commit("setTitle", `[${state.order.orderState}] Order from ${state.order.restaurantName} (${state.order.orderDate})`)
        })
        .catch(errResponse => ErrorHandler.handleError(errResponse));
    },
  }
};
