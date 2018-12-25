

export default {
    namespaced: true,
    state: {
        allOrdersList: []
    },
    mutations: {
        setAllOrdersList(state, payload) {
            state.allOrdersList = payload
        }
    }
};