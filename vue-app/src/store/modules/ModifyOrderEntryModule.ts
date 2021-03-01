import {Module} from "vuex";
import {RootState} from "@/store";
import {SideDishData} from "@/frontend-client";


export const NAMESPACE_MODIFY_ORDER_ENTRY = "modifyOrderEntry";

export const SET_ENTRY_LOADING_TRUE = "SET_ENTRY_LOADING_TRUE";
export const SET_ENTRY_LOADING_FALSE = "SET_ENTRY_LOADING_FALSE";

export const SET_DISH_ENTRY_CREATING = "SET_DISH_ENTRY_CREATING";
export const SET_DISH_ENTRY_EDITING = "SET_DISH_ENTRY_EDITING";

export const CANCEL_DISH_ENTRY_MODIFICATION = "CANCEL_DISH_ENTRY_MODIFICATION";

export const SET_INITIAL_CREATED_ORDER_ENTRY = "SET_INITIAL_CREATED_ORDER_ENTRY";
export const SET_INITIAL_EDITED_ORDER_ENTRY = "SET_INITIAL_EDITED_ORDER_ENTRY";


export interface OrderEntryData {
  dishId: string;
  additionalComments: string;
  newDish: boolean;
  newDishName: string;
  newDishPrice: number;
  chosenSideDishes: SideDishData[];
}

export interface ModifyOrderEntryState {
  loadingEntry: boolean;

  isEntryCreating: boolean;
  isEntryEdited: boolean;
  orderEntryId: string;
  dishEntryId: string;
  orderId: string;

  orderEntryData: OrderEntryData;
}

const modifyOrderEntryState: ModifyOrderEntryState = {
  loadingEntry: false,

  isEntryCreating: false,
  isEntryEdited: false,
  orderEntryId: "",
  dishEntryId: "",
  orderId: "",

  orderEntryData: {
    dishId: "",
    additionalComments: "",
    newDish: false,
    newDishName: "",
    newDishPrice: 0,
    chosenSideDishes: []
  }
};

export const modifyOrderEntryModule: Module<ModifyOrderEntryState,RootState> = {
  namespaced: true,

  state: modifyOrderEntryState,
  mutations: {
    [SET_ENTRY_LOADING_TRUE](state) {
      state.loadingEntry = true;
    },
    [SET_ENTRY_LOADING_FALSE](state) {
      state.loadingEntry = false;
    },
    [SET_DISH_ENTRY_CREATING](state) {
      state.isEntryCreating = true;
      state.isEntryEdited = false;
      state.orderEntryId = "";
      state.dishEntryId = "";
    },
    [SET_DISH_ENTRY_EDITING](state, payload) {
      state.isEntryCreating = false;
      state.isEntryEdited = true;
      state.orderEntryId = payload.orderEntryId;
      state.dishEntryId = payload.dishEntryId;
    },
    [CANCEL_DISH_ENTRY_MODIFICATION](state) {
      state.isEntryCreating = false;
      state.isEntryEdited = false;
      state.orderEntryId = "";
      state.dishEntryId = "";
    },
    [SET_INITIAL_CREATED_ORDER_ENTRY](state, { orderId, dishId }) {
      state.orderId = orderId

      state.orderEntryData = {
        dishId: dishId,
        additionalComments: "",
        newDish: false,
        newDishName: "",
        newDishPrice: 0,
        chosenSideDishes: []
      }
    },
    [SET_INITIAL_EDITED_ORDER_ENTRY](state, { orderId, dishEntry }) {
      state.orderId = orderId
      state.dishEntryId = dishEntry.id;

      state.orderEntryData = {
        dishId: dishEntry.dishId,
        additionalComments: dishEntry.comments,
        newDish: false,
        newDishName: "",
        newDishPrice: 0,
        chosenSideDishes: dishEntry.sideDishes || []
      }
    },
    updateOrderEntryData(state, newValue) {
      state.orderEntryData = newValue
    }
  }
};
