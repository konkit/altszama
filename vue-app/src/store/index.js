import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    loadingEntry: false,
    username: localStorage.getItem("username"),
    token: localStorage.getItem("token")
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
    }
  }
})
