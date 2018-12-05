import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    loadingEntry: false,
    username: localStorage.getItem("username"),
    token: localStorage.getItem("token"),

    // SHOW ORDER
    order: {},
    orderEntries: [],
    currentUserId: '',
    allDishesInRestaurant: [],
    allDishesByCategory: [],
    dishIdToSideDishesMap: [],

    isEntryCreating: false,
    isEntryEdited: false,
    orderEntryId: "",
    dishEntryId: "",

    // CREATED / EDITED ORDER
    editedOrderEntry: {},

  },
  mutations: {
    setLoadingTrue (state) {
      state.loading = true;
    },
    setLoadingFalse (state) {
      state.loading = false;
    },
    setEntryLoadingTrue (state) {
      state.loadingEntry = true;
    },
    setEntryLoadingFalse (state) {
      state.loadingEntry = false;
    },
    loginUser (state, payload) {
      state.username = payload.username;
      localStorage.setItem("username", payload.username)

      state.token = payload.token;
      localStorage.setItem("token", payload.token)
    },
    logoutUser (state, payload) {
      state.username = ""
      localStorage.setItem("username", "")
      state.token = ""
      localStorage.setItem("token", "")
    },

    // SHOW ORDER
    loadShowOrderData (state, payload) {
      state.order = payload.order;
      state.orderEntries = payload.orderEntries;
      state.currentUserId = payload.currentUserId;
      state.allDishesInRestaurant = payload.allDishesInRestaurant;
      state.allDishesByCategory = payload.allDishesByCategory;
      state.dishIdToSideDishesMap  = payload.dishIdToSideDishesMap;
    },

    setEntryCreating (state, payload) {
      state.isEntryCreating = true;
      state.orderEntryId = "";
      state.dishEntryId = "";
    },

    setEntryEditing (state, payload) {
      state.isEntryEdited = true;
      state.orderEntryId = payload.orderEntryId;
      state.dishEntryId = payload.dishEntryId;
    },

    cancelEntryCreateOrEdit (state, payload) {
      state.isEntryCreating = false;
      state.isEntryEdited = false;
      state.orderEntryId = "";
      state.dishEntryId = "";
    },

    // CREATED / EDITED ORDER

    setEditedOrderEntry (state, payload) {
      state.editedOrderEntry = payload
    },
    clearEditedSideDishes (state, payload) {
      state.editedOrderEntry.chosenSideDishes = []
    },
    setNewDishFlag (state, payload) {
      var newDishValue = payload

      state.editedOrderEntry.newDish = newDishValue;
      if (newDishValue == true) {
        state.editedOrderEntry.dishId = ""
      }
    },

  }
})
