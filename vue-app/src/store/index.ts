import Vue from "vue";
import Vuex from "vuex";

import {showOrderModule, ShowOrderState} from "./modules/ShowOrderModule";
import {
  showRestaurantModule,
  ShowRestaurantState
} from "./modules/ShowRestaurantModule";
import {
  modifyOrderEntryModule,
  ModifyOrderEntryState
} from "./modules/ModifyOrderEntryModule";

Vue.use(Vuex);

export interface RootState {
  loading: boolean;
  username: string;
  token: string;
  errors: string[];
  masterNavDrawerOpened: boolean;
  title: string;
  displayBackButton: boolean;
  currentRouteName: string;
  pushNotificationEnabled: boolean;


  showOrder?: ShowOrderState;
  modifyOrderEntry?: ModifyOrderEntryState;
  showRestaurant?: ShowRestaurantState;
}

const rootState: RootState = {
  loading: false,
  username: localStorage.getItem("username") || "",
  token: localStorage.getItem("token") || "",
  errors: [],
  masterNavDrawerOpened: false,
  title: "AltSzama",
  currentRouteName: "LandingPage",
  displayBackButton: false,
  pushNotificationEnabled: false,
} as RootState;

export default new Vuex.Store({
  state: rootState,
  mutations: {
    setLoadingTrue(state) {
      state.loading = true;
    },
    setLoadingFalse(state) {
      state.loading = false;
    },
    loginUser(state, payload) {
      state.username = payload.username;
      localStorage.setItem("username", payload.username);

      state.token = payload.token;
      localStorage.setItem("token", payload.token);
    },
    logoutUser(state) {
      state.username = "";
      localStorage.setItem("username", "");

      state.token = "";
      localStorage.setItem("token", "");

      state.pushNotificationEnabled = false
    },
    addError(state, error: any) {
      console.log("Error: ", error)

      const pushError = (errorStr: string) => {
        if (errorStr && errorStr.trim().length > 0) {
          state.errors.push(errorStr)
        }
      }

      if (error instanceof Array) {
        error.forEach(errorStr => pushError(errorStr));
      } else if (typeof error == "object" && error.messages !== undefined) {
        error.messages.forEach((errorStr: string) =>
          pushError(errorStr)
        );
      } else if (typeof error == "object" && error.exception !== undefined) {
        pushError("Error: " + error.exception + " occured!");
      } else if (typeof error == "object" && error.message !== undefined) {
        pushError(error.message);
      } else if (typeof error == "object" && error.body?.message !== undefined) {
        pushError(error.body.message);
      } else if (typeof error == "object" && error.body?.messages !== undefined) {
        error.body.messages.forEach((errorStr: string) =>
          pushError(errorStr)
        );
      } else if (typeof error == "object" && error.statusText !== undefined) {
        pushError(error.statusText);
      } else {
        console.log("Error: ", error);
        pushError(error);
      }
    },
    clearErrorAtIndex(state, index) {
      state.errors.splice(index, 1);
    },
    clearErrors(state) {
      state.errors = [];
    },
    setMasterNavigationDrawerOpened(state, value) {
      state.masterNavDrawerOpened = value;
    },
    toggleMasterNavigationDrawerOpened(state) {
      state.masterNavDrawerOpened = !state.masterNavDrawerOpened;
    },
    setTitle(state, value) {
      document.title = `${value} | AltSzama`
      state.title = value
    },
    setDisplayBackButton(state, value) {
      state.displayBackButton = value
    },
    setCurrentRouteName(state, value) {
      state.currentRouteName = value
    },
    setPushNotificationEnabled(state, value) {
      state.pushNotificationEnabled = value
    }
  },
  getters: {
    titleText: state => {
      if (state.loading === true) {
        return "Loading ...";
      } else {
        return state.title;
      }
    },
    shouldDisplayToolbar: state => {
      return !["Login", "LandingPage"].includes(state.currentRouteName)
    },
    shouldDisplayLoginToolbar: state => {
      return ["Login", "LandingPage"].includes(state.currentRouteName)
    }
  },
  modules: {
    // Orders
    showOrder: showOrderModule,
    modifyOrderEntry: modifyOrderEntryModule,

    // Dishes
    showRestaurant: showRestaurantModule
  }
});
