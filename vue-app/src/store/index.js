import Vue from 'vue';
import Vuex from 'vuex';
import { showOrderModule } from './modules/ShowOrderModule';
import { showRestaurantModule } from "./modules/ShowRestaurantModule";
import ModifyOrderEntryState from "./modules/ModifyOrderEntryState";
Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        loading: false,
        username: localStorage.getItem("username") || "",
        token: localStorage.getItem("token") || "",
        errors: [],
        masterNavDrawerOpened: false,
    },
    mutations: {
        setLoadingTrue: function (state) {
            state.loading = true;
        },
        setLoadingFalse: function (state) {
            state.loading = false;
        },
        loginUser: function (state, payload) {
            state.username = payload.username;
            localStorage.setItem("username", payload.username);
            state.token = payload.token;
            localStorage.setItem("token", payload.token);
        },
        logoutUser: function (state) {
            state.username = "";
            localStorage.setItem("username", "");
            state.token = "";
            localStorage.setItem("token", "");
        },
        addError: function (state, error) {
            if (error instanceof Array) {
                error.forEach(function (errorStr) { return state.errors.push(errorStr); });
            }
            else if (typeof error == 'object' && typeof error.exception !== "undefined") {
                state.errors.push("Error: " + error.exception + " occured!");
            }
            else if (typeof error == 'object' && typeof error.message !== "undefined") {
                state.errors.push(error.message);
            }
            else if (typeof error == 'object' && typeof error.body.message !== "undefined") {
                state.errors.push(error.body.message);
            }
            else if (typeof error == 'object' && typeof error.body.messages !== "undefined") {
                error.body.messages.forEach(function (errorStr) { return state.errors.push(errorStr); });
            }
            else {
                state.errors.push(error);
            }
        },
        clearErrorAtIndex: function (state, index) {
            state.errors.splice(index, 1);
        },
        clearErrors: function (state) {
            state.errors = [];
        },
        setMasterNavigationDrawerOpened: function (state, value) {
            state.masterNavDrawerOpened = value;
        },
        toggleMasterNavigationDrawerOpened: function (state) {
            state.masterNavDrawerOpened = !state.masterNavDrawerOpened;
        }
    },
    modules: {
        // Orders
        showOrder: showOrderModule,
        modifyOrderEntry: ModifyOrderEntryState,
        // Dishes
        showRestaurant: showRestaurantModule,
    }
});
//# sourceMappingURL=index.js.map