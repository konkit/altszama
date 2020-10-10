let _a, _b;
import Vue from "vue";
import OrdersApiConnector from "../../lib/OrdersApiConnector";
import ApiConnector from "../../lib/ApiConnector";
import {
  FETCH_ORDER_DATA_ACTION,
  NAMESPACE_SHOW_ORDER
} from "./ShowOrderModule";
export var NAMESPACE_MODIFY_ORDER_ENTRY = "modifyOrderEntry";
export var SET_ENTRY_LOADING_TRUE = "SET_ENTRY_LOADING_TRUE";
export var SET_ENTRY_LOADING_FALSE = "SET_ENTRY_LOADING_FALSE";
export var SET_DISH_ENTRY_CREATING = "SET_DISH_ENTRY_CREATING";
export var SET_DISH_ENTRY_EDITING = "SET_DISH_ENTRY_EDITING";
export var SET_DISH_AS_NEW = "SET_DISH_AS_NEW";
export var SET_DISH_AS_EXISTING = "SET_DISH_AS_EXISTING";
export var CANCEL_DISH_ENTRY_MODIFICATION = "CANCEL_DISH_ENTRY_MODIFICATION";
export var UPDATE_DISH_ID = "UPDATE_DISH_ID";
export var UPDATE_ADDITIONAL_COMMENTS = "UPDATE_ADDITIONAL_COMMENTS";
export var UPDATE_NEW_DISH_NAME = "UPDATE_EDITED_ORDER_ENTRY_NEW_DISH_NAME";
export var UPDATE_NEW_DISH_PRICE = "UPDATE_EDITED_ORDER_ENTRY_NEW_DISH_PRICE";
export var UPDATE_NEW_SIDE_DISH_NAME = "UPDATE_NEW_SIDE_DISH_NAME";
export var UPDATE_NEW_SIDE_DISH_PRICE = "UPDATE_NEW_SIDE_DISH_PRICE";
export var SET_SIDE_DISH = "SET_SIDE_DISH";
export var SET_SIDE_DISH_AS_NEW = "SET_SIDE_DISH_AS_NEW";
export var SET_SIDE_DISH_AS_EXISTING = "SET_SIDE_DISH_AS_EXISTING";
export var CLEAR_EDITED_SIDE_DISHES = "CLEAR_EDITED_SIDE_DISHES";
export var ADD_SIDE_DISH = "ADD_SIDE_DISH";
export var REMOVE_SIDE_DISH = "REMOVE_SIDE_DISH";
export var SET_INITIAL_CREATED_ORDER_ENTRY = "SET_INITIAL_CREATED_ORDER_ENTRY";
export var SET_INITIAL_EDITED_ORDER_ENTRY = "SET_INITIAL_EDITED_ORDER_ENTRY";
export var SETUP_CREATE_ORDER_ENTRY_ACTION = "SETUP_CREATE_ORDER_ENTRY_ACTION";
export var SETUP_EDIT_ORDER_ENTRY_ACTION = "SETUP_EDIT_ORDER_ENTRY_ACTION";
export var ADD_SIDE_DISH_ACTION = "ADD_SIDE_DISH_ACTION";
export var UPDATE_SIDE_DISH_ACTION = "UPDATE_SIDE_DISH_ACTION";
export var SAVE_ORDER_ENTRY_ACTION = "SAVE_ORDER_ENTRY_ACTION";
export var UPDATE_ORDER_ENTRY_ACTION = "UPDATE_ORDER_ENTRY_ACTION";
const modifyOrderEntryState = {
  loadingEntry: false,
  isEntryCreating: false,
  isEntryEdited: false,
  orderEntryId: "",
  dishEntryId: "",
  orderId: "",
  dishId: "",
  additionalComments: "",
  newDish: false,
  newDishName: "",
  newDishPrice: 0,
  chosenSideDishes: []
};
export var modifyOrderEntryModule = {
  namespaced: true,
  state: modifyOrderEntryState,
  mutations:
    ((_a = {}),
    (_a[SET_ENTRY_LOADING_TRUE] = function(state) {
      state.loadingEntry = true;
    }),
    (_a[SET_ENTRY_LOADING_FALSE] = function(state) {
      state.loadingEntry = false;
    }),
    (_a[SET_DISH_ENTRY_CREATING] = function(state) {
      state.isEntryCreating = true;
      state.isEntryEdited = false;
      state.orderEntryId = "";
      state.dishEntryId = "";
    }),
    (_a[SET_DISH_ENTRY_EDITING] = function(state, payload) {
      state.isEntryCreating = false;
      state.isEntryEdited = true;
      state.orderEntryId = payload.orderEntryId;
      state.dishEntryId = payload.dishEntryId;
    }),
    (_a[CANCEL_DISH_ENTRY_MODIFICATION] = function(state) {
      state.isEntryCreating = false;
      state.isEntryEdited = false;
      state.orderEntryId = "";
      state.dishEntryId = "";
    }),
    (_a[SET_DISH_AS_NEW] = function(state) {
      state.newDish = true;
      // state.dishId = ""
    }),
    (_a[SET_DISH_AS_EXISTING] = function(state) {
      state.newDish = false;
    }),
    (_a[SET_INITIAL_CREATED_ORDER_ENTRY] = function(state, _a) {
      const orderId = _a.orderId,
        dishId = _a.dishId;
      state.orderId = orderId;
      state.dishId = dishId;
      state.additionalComments = "";
      state.newDish = false;
      state.newDishName = "";
      state.newDishPrice = 0;
      state.chosenSideDishes = [];
    }),
    (_a[SET_INITIAL_EDITED_ORDER_ENTRY] = function(state, _a) {
      const orderId = _a.orderId,
        dishEntry = _a.dishEntry;
      state.orderId = orderId;
      state.dishId = dishEntry.dishId;
      state.dishEntryId = dishEntry.id;
      state.additionalComments = dishEntry.comments;
      state.newDish = false;
      state.newDishName = "";
      state.newDishPrice = 0;
      state.chosenSideDishes = dishEntry.sideDishes || [];
    }),
    (_a[UPDATE_DISH_ID] = function(state, newValue) {
      state.dishId = newValue;
    }),
    (_a[UPDATE_ADDITIONAL_COMMENTS] = function(state, newValue) {
      state.additionalComments = newValue;
    }),
    (_a[UPDATE_NEW_DISH_NAME] = function(state, newValue) {
      state.newDishName = newValue;
    }),
    (_a[UPDATE_NEW_DISH_PRICE] = function(state, newValue) {
      state.newDishPrice = newValue;
    }),
    (_a[ADD_SIDE_DISH] = function(state, sideDishToAdd) {
      state.chosenSideDishes.push(sideDishToAdd);
    }),
    (_a[SET_SIDE_DISH] = function(state, _a) {
      const sdIndex = _a.sdIndex,
        newValue = _a.newValue;
      state.chosenSideDishes[sdIndex] = newValue;
    }),
    (_a[UPDATE_NEW_SIDE_DISH_NAME] = function(state, _a) {
      const sdIndex = _a.sdIndex,
        newValue = _a.newValue;
      state.chosenSideDishes[sdIndex].newSideDishName = newValue;
    }),
    (_a[UPDATE_NEW_SIDE_DISH_PRICE] = function(state, _a) {
      const sdIndex = _a.sdIndex,
        newValue = _a.newValue;
      state.chosenSideDishes[sdIndex].newSideDishPrice = newValue;
    }),
    (_a[SET_SIDE_DISH_AS_NEW] = function(state, _a) {
      const sdIndex = _a.sdIndex;
      Vue.set(state.chosenSideDishes[sdIndex], "isNew", true);
    }),
    (_a[SET_SIDE_DISH_AS_EXISTING] = function(state, _a) {
      const sdIndex = _a.sdIndex;
      Vue.set(state.chosenSideDishes[sdIndex], "isNew", false);
    }),
    (_a[REMOVE_SIDE_DISH] = function(state, _a) {
      const sdIndex = _a.sdIndex;
      state.chosenSideDishes.splice(sdIndex, 1);
    }),
    (_a[CLEAR_EDITED_SIDE_DISHES] = function(state) {
      state.chosenSideDishes = [];
    }),
    _a),
  actions:
    ((_b = {}),
    (_b[SETUP_CREATE_ORDER_ENTRY_ACTION] = function(_a) {
      const state = _a.state,
        rootState = _a.rootState;
      this.commit("clearErrors");
      const showOrderState = rootState.showOrder;
      const orderId = showOrderState.order.id;
      let dishId;
      if (showOrderState.allDishesInRestaurant.length > 0) {
        dishId = showOrderState.allDishesInRestaurant[0].id;
      } else {
        dishId = null;
      }
      this.commit(
        NAMESPACE_MODIFY_ORDER_ENTRY + "/" + SET_INITIAL_CREATED_ORDER_ENTRY,
        { orderId: orderId, dishId: dishId }
      );
    }),
    (_b[SETUP_EDIT_ORDER_ENTRY_ACTION] = function(_a, _b) {
      const state = _a.state,
        rootState = _a.rootState;
      const dishEntry = _b.dishEntry;
      this.commit("clearErrors");
      const showOrderState = rootState.showOrder;
      const orderId = showOrderState.order.id;
      this.commit(
        NAMESPACE_MODIFY_ORDER_ENTRY + "/" + SET_INITIAL_EDITED_ORDER_ENTRY,
        { orderId: orderId, dishEntry: dishEntry }
      );
      this.commit(NAMESPACE_MODIFY_ORDER_ENTRY + "/" + SET_ENTRY_LOADING_FALSE);
    }),
    (_b[SAVE_ORDER_ENTRY_ACTION] = function(_a) {
      const _this = this;
      const state = _a.state,
        rootState = _a.rootState;
      const orderId = state.orderId;
      const orderEntryToSave = {
        orderId: state.orderId,
        dishId: state.dishId,
        dishEntryId: state.dishEntryId,
        additionalComments: state.additionalComments,
        newDish: state.newDish,
        newDishName: state.newDishName,
        newDishPrice: state.newDishPrice,
        chosenSideDishes: state.chosenSideDishes
      };
      new OrdersApiConnector(rootState)
        .saveOrderEntry(orderId, orderEntryToSave)
        .then(function() {
          _this.commit("setLoadingTrue");
          _this.commit(
            NAMESPACE_MODIFY_ORDER_ENTRY + "/" + CANCEL_DISH_ENTRY_MODIFICATION,
            {}
          );
          _this.dispatch(
            NAMESPACE_SHOW_ORDER + "/" + FETCH_ORDER_DATA_ACTION,
            orderId
          );
        })
        .catch(function(errResponse) {
          return ApiConnector.handleError(errResponse);
        });
    }),
    (_b[UPDATE_ORDER_ENTRY_ACTION] = function(_a, _b) {
      const _this = this;
      const state = _a.state,
        rootState = _a.rootState,
        getters = _a.getters;
      const orderEntryId = _b.orderEntryId;
      const orderId = state.orderId;
      const orderEntryToUpdate = {
        orderId: orderId,
        dishId: state.dishId,
        dishEntryId: state.dishEntryId,
        additionalComments: state.additionalComments,
        newDish: state.newDish,
        newDishName: state.newDishName,
        newDishPrice: state.newDishPrice,
        chosenSideDishes: state.chosenSideDishes
      };
      new OrdersApiConnector(rootState)
        .updateOrderEntry(orderId, orderEntryId, orderEntryToUpdate)
        .then(function() {
          _this.commit("setLoadingTrue");
          _this.commit(
            NAMESPACE_MODIFY_ORDER_ENTRY + "/" + CANCEL_DISH_ENTRY_MODIFICATION,
            {}
          );
          _this.dispatch(
            NAMESPACE_SHOW_ORDER + "/" + FETCH_ORDER_DATA_ACTION,
            orderId
          );
        })
        .catch(function(errResponse) {
          return ApiConnector.handleError(errResponse);
        });
    }),
    (_b[ADD_SIDE_DISH_ACTION] = function(_a) {
      const state = _a.state,
        rootState = _a.rootState;
      const showOrderState = rootState.showOrder;
      const sideDishesForGivenDish =
        showOrderState.dishIdToSideDishesMap[state.dishId];
      let sideDishToAdd; // = {};
      if (sideDishesForGivenDish && sideDishesForGivenDish.length > 0) {
        // sideDishToAdd = Object.assign({}, sideDishesForGivenDish[0]);
        // sideDishToAdd.isNew = false
        sideDishToAdd = {
          isNew: false,
          newSideDishName: "",
          newSideDishPrice: 0
        };
      } else {
        // sideDishToAdd = {};
        // sideDishToAdd.isNew = true
        sideDishToAdd = {
          isNew: false,
          newSideDishName: "",
          newSideDishPrice: 0
        };
      }
      // sideDishToAdd.newSideDishName = "";
      // sideDishToAdd.newSideDishPrice = 0;
      this.commit(
        NAMESPACE_MODIFY_ORDER_ENTRY + "/" + ADD_SIDE_DISH,
        sideDishToAdd
      );
    }),
    (_b[UPDATE_SIDE_DISH_ACTION] = function(_a, _b) {
      const state = _a.state,
        rootState = _a.rootState;
      const sdIndex = _b.sdIndex,
        sideDishId = _b.sideDishId;
      const showOrderState = rootState.showOrder;
      const newSideDish = showOrderState.dishIdToSideDishesMap[
        state.dishId
      ].find(function(sd) {
        return sd.id === sideDishId;
      });
      this.commit(NAMESPACE_MODIFY_ORDER_ENTRY + "/" + SET_SIDE_DISH, {
        sdIndex: sdIndex,
        newValue: newSideDish
      });
    }),
    _b)
};
//# sourceMappingURL=ModifyOrderEntryModule.js.map
