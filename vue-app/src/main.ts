// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueNumeric from "vue-numeric";
import vuetify from "./plugins/vuetify";

import Vuex from "vuex";
Vue.use(VueNumeric);
Vue.use(Vuex);
router.beforeEach(function(to, from, next) {
  document.title = "Alt Szama";
  store.commit("setCurrentRouteName", to.name)
  store.commit("setDisplayBackButton", to.meta.backButton)
  next();
});


// CSS libs
import "font-awesome/css/font-awesome.css";
import "./assets/main-styles.css";
import "./assets/global-styles.css";
import Raven from "raven-js";
import RavenVue from "raven-js/plugins/vue";
import {SENTRY_URL} from "@/lib/config";


if (SENTRY_URL) {
  Raven.config(SENTRY_URL)
    .addPlugin(RavenVue, Vue)
    .install();
}


Vue.config.productionTip = false;

Vue.config.errorHandler = function(err, vm, info) {
  console.error(err, vm, info);
  if (SENTRY_URL) {
    const options = {
      extra: {
        state: JSON.stringify(store.state)
      }
    };
    Raven.captureException(err, options);
  }
};


if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("/custom-service-worker.js").then(
      function(registration) {
        console.log("ServiceWorker registered")
      },
      function(err) {
        console.log("ServiceWorker registration failed: ", err);
      }
    );
  });
}


/* eslint-disable no-new */
new Vue({
  el: "#app",
  router: router,
  store: store,
  vuetify: vuetify,
  template: "<App/>",
  components: { App: App }
});
//# sourceMappingURL=main.js.map
