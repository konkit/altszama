import {Module} from "vuex";
import {RootState} from "@/store";
import {SideDishData} from "@/frontend-client";

export interface NewDishData {
  kind: "NewDishData";
  newDishName: string;
  newDishPrice: number;
  chosenSideDishes: SideDishData[];
}

export interface ExistingDishData {
  kind: "ExistingDishData";
  dishId: string;
  chosenSideDishes: SideDishData[];
}

export interface OrderEntryData {
  dishData: NewDishData | ExistingDishData;
  additionalComments: string;
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
    dishData: {
      kind: "NewDishData",
      newDishName: "",
      newDishPrice: 0,
      chosenSideDishes: []
    },
    additionalComments: "",
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
        dishData: {
          kind: "NewDishData",
          newDishName: "",
          newDishPrice: 0,
          chosenSideDishes: []
        },
        additionalComments: "",
      }
    },
    setInitialEditedOrderEntry(state, { orderId, dishEntry }) {
      state.orderId = orderId
      state.dishEntryId = dishEntry.id;

      state.orderEntryData = {
        dishData: {
          kind: "ExistingDishData",
          dishId: dishEntry.dishId,
          chosenSideDishes: dishEntry.sideDishes || []
        },
        additionalComments: dishEntry.comments,
      }
    },
    updateOrderEntryData(state, newValue) {
      state.orderEntryData = newValue
    }
  }
};
