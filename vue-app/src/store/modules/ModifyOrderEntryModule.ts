import {Module} from "vuex";
import {RootState} from "@/store";
import {SideDishData} from "@/frontend-client";

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
    setEntryLoading(state, newValue: boolean) {
      state.loadingEntry = newValue
    },
    setDishEntryCreating(state) {
      state.isEntryCreating = true;
      state.isEntryEdited = false;
      state.orderEntryId = "";
      state.dishEntryId = "";
    },
    setDishEntryEditing(state, payload) {
      state.isEntryCreating = false;
      state.isEntryEdited = true;
      state.orderEntryId = payload.orderEntryId;
      state.dishEntryId = payload.dishEntryId;
    },
    cancelDishEntryModification(state) {
      state.isEntryCreating = false;
      state.isEntryEdited = false;
      state.orderEntryId = "";
      state.dishEntryId = "";
    },
    setInitialCreateOrderEntry(state, { orderId, dishId }) {
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
    setInitialEditedOrderEntry(state, { orderId, dishEntry }) {
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
