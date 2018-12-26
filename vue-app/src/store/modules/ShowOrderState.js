
export default {
    namespaced: true,
    state: {
        order: {
            restaurant: {
                name: ""
            },
            orderCreator: {}
        },
        orderEntries: [],
        currentUserId: '',
        allDishesInRestaurant: [],
        allDishesByCategory: [],
        dishIdToSideDishesMap: [],
        totalOrderPrice: 0,

        isEntryCreating: false,
        isEntryEdited: false,
        orderEntryId: "",
        dishEntryId: "",

        editedOrderEntry: {},
    },
    mutations: {
        loadShowOrderData (state, payload) {
            state.order = payload.order;
            state.orderEntries = payload.orderEntries;
            state.currentUserId = payload.currentUserId;
            state.allDishesInRestaurant = payload.allDishesInRestaurant;
            state.allDishesByCategory = payload.allDishesByCategory;
            state.dishIdToSideDishesMap  = payload.dishIdToSideDishesMap;
            state.totalOrderPrice  = payload.totalOrderPrice;
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
    },
};